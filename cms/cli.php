<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli') { http_response_code(404); exit; }
require __DIR__.'/runtime.php';
try {
    $command=$argv[1]??'check';
    foreach(['pdo_mysql','openssl','gd','mbstring','json','fileinfo'] as $module) if(!extension_loaded($module)) throw new RuntimeException('Missing PHP extension: '.$module);
    if(!defined('PASSWORD_ARGON2ID')) throw new RuntimeException('Argon2id required');
    config(); db();
    if($command==='install') {
        foreach(explode(';',file_get_contents(__DIR__.'/schema.sql')) as $statement) if(trim($statement)!=='') db()->exec($statement);
        foreach(['content','media'] as $directory) { $path=shared().'/'.$directory; if(!is_dir($path)) mkdir($path,0755,true); }
        if(!query('SELECT COUNT(*) FROM materials')->fetchColumn()) {
            $seed=json_decode(file_get_contents(__DIR__.'/seed.json'),true,512,JSON_THROW_ON_ERROR);
            foreach(['news','events'] as $kind) foreach($seed[$kind] as $order=>$item) { unset($item['id']); $payload=json_encode($item,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR); query('INSERT INTO materials(kind,draft,published,sort_order) VALUES(?,?,?,?)',[$kind,$payload,$payload,$order]); }
        }
        file_put_contents(shared().'/media/.htaccess', "Options -Indexes\nRemoveHandler .php .phtml .phar\n<FilesMatch \"\\.(php|phtml|phar|html|svg)$\">\nRequire all denied\n</FilesMatch>\n");
        chmod(shared().'/media/.htaccess',0644);
        publishSnapshot(); echo "Installed. Create an administrator next.\n";
    } elseif($command==='add-admin') {
        $login=$argv[2]??''; if(!preg_match('/^admin-[0-9]{2}$/',$login)) throw new RuntimeException('Use login admin-01, admin-02, etc.');
        if((int)query('SELECT COUNT(*) FROM admins WHERE active=1')->fetchColumn()>=3) throw new RuntimeException('Maximum three active administrators');
        echo 'Password (hidden): '; system('stty -echo'); try { $password=rtrim(fgets(STDIN),"\r\n"); } finally { system('stty echo'); echo "\n"; }
        if(strlen($password)<16 || strlen($password)>200) throw new RuntimeException('Password must contain 16–200 bytes');
        $secret=''; $alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; for($i=0;$i<32;$i++) $secret.=$alphabet[random_int(0,31)];
        query('INSERT INTO admins(login,password,secret) VALUES(?,?,?)',[$login,password_hash($password,PASSWORD_ARGON2ID),seal($secret)]);
        echo "Add to your authenticator app manually (time-based, SHA1, 6 digits, 30 sec):\n".$secret."\nStore securely. This secret will not be displayed again.\n";
    } elseif($command==='disable-admin') {
        query('UPDATE admins SET active=0 WHERE login=?',[$argv[2]??'']); echo "Administrator disabled; existing sessions revoked.\n";
    } elseif($command==='snapshot') { publishSnapshot(); echo "Snapshot rebuilt.\n";
    } elseif($command==='ready') {
        if((int)query('SELECT MAX(version) FROM migrations')->fetchColumn()!==1) throw new RuntimeException('Unsupported database schema');
        if(!(int)query('SELECT COUNT(*) FROM admins WHERE active=1')->fetchColumn()) throw new RuntimeException('Create a production administrator first');
        if(!is_writable(shared().'/content') || !is_writable(shared().'/media')) throw new RuntimeException('Persistent directories are not writable');
        $published=json_decode(file_get_contents(shared().'/content/current.json'),true,512,JSON_THROW_ON_ERROR);
        if($published!==snapshot()) throw new RuntimeException('Published snapshot does not match database');
        foreach(['news','events'] as $kind) foreach($published[$kind] as $item) if(!empty($item['image'])) {
            if(!preg_match('~^/(images/[a-zA-Z0-9_.-]+|media/[a-f0-9]{32}\\.jpg)$~',$item['image'])) throw new RuntimeException('Invalid published image path');
            if(!is_file(dirname(__DIR__).$item['image'])) throw new RuntimeException('Published image is missing from release');
        }
        if(!is_file(dirname(__DIR__).'/preview/index.php')) throw new RuntimeException('Preview endpoint missing');
        if((fileperms(shared().'/config.php') & 0077)!==0) throw new RuntimeException('Config must not be group/world readable');
        echo "CMS release readiness checks passed.\n";
    } elseif($command==='storage') {
        // Account-wide usage must be checked in Timeweb: PHP cannot reliably see the account quota.
        $bytes=0; foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator(dirname(shared()),FilesystemIterator::SKIP_DOTS)) as $file) if($file->isFile()&&!$file->isLink()) $bytes+=$file->getSize();
        echo sprintf("Bagration directory: %.2f GB / account quota 15 GB\n",$bytes/1073741824); if($bytes>=15*1073741824*.7) echo "WARNING: at least 70% of account quota used by Bagration alone. Check Timeweb storage.\n";
    } else echo "PHP modules, Argon2id, config and database connection OK.\n";
} catch(Throwable $e) { fwrite(STDERR,"CMS command failed: ".$e->getMessage()."\n"); exit(1); }
