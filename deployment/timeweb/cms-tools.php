<?php
// Upload to $HOME/Bagration/cms-tools.php, NEVER public_html. CLI only.
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
umask(0077);
$base = __DIR__;
$admin = $base.'/releases/cms-setup/admin';
$command = $argv[1] ?? 'verify';
try {
    if ($command === 'configure') {
        $input = json_decode(base64_decode(trim(stream_get_contents(STDIN)), true), true, 32, JSON_THROW_ON_ERROR);
        $name = 'cp29116_bagration';
        $settings = ['dsn'=>'mysql:host=localhost;dbname='.$name.';charset=utf8mb4','user'=>$name,'password'=>$input['password'],'key'=>bin2hex(random_bytes(32)),'origin'=>'https://sc-bagration.ru'];
        $pdo = new PDO($settings['dsn'], $settings['user'], $settings['password'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
        if ($pdo->query('SHOW TABLES')->fetchAll()) throw new RuntimeException('Database is not empty; refusing first-time configuration');
        foreach (['pdo_mysql','openssl','gd','mbstring','json','fileinfo'] as $extension) if (!extension_loaded($extension)) throw new RuntimeException('Missing extension '.$extension);
        if (!defined('PASSWORD_ARGON2ID')) throw new RuntimeException('Argon2id missing');
        foreach (['JPEG Support','PNG Support','WebP Support'] as $format) if (empty(gd_info()[$format])) throw new RuntimeException('GD format missing');
        if (!is_dir($base.'/shared')) mkdir($base.'/shared',0700);
        foreach (['content','media','backups'] as $directory) if (!is_dir($base.'/shared/'.$directory)) mkdir($base.'/shared/'.$directory,$directory==='backups'?0700:0755);
        $handle = fopen($base.'/shared/config.php','x');
        if (!$handle) throw new RuntimeException('Configuration already exists; refusing overwrite');
        fwrite($handle,"<?php\nreturn ".var_export($settings,true).";\n"); fclose($handle); chmod($base.'/shared/config.php',0600);
        echo "Configuration created outside public_html; MySQL connection and PHP prerequisites OK.\n";
        exit;
    }
    require $admin.'/runtime.php';
    if ($command === 'import') {
        $data=json_decode(file_get_contents($base.'/cms-transfer/content.json'),true,512,JSON_THROW_ON_ERROR);
        $seed=json_decode(file_get_contents($admin.'/seed.json'),true,512,JSON_THROW_ON_ERROR);
        // Initial import only. Never silently overwrite later administrator changes.
        $rows=query('SELECT * FROM materials ORDER BY sort_order,id')->fetchAll(PDO::FETCH_ASSOC);
        if(count($rows)!==count($seed['news'])+count($seed['events'])) throw new RuntimeException('Unexpected material count; refusing import');
        foreach($rows as $row) {
            $expected=array_values(array_filter($seed[$row['kind']],fn($i)=>$i['title']===json_decode($row['draft'],true)['title']));
            if(count($expected)!==1) throw new RuntimeException('Unexpected existing material');
            unset($expected[0]['id']);
            if(json_decode($row['draft'],true)!=$expected[0] || $row['draft']!==$row['published']) throw new RuntimeException('Existing material was edited; refusing import');
        }
        foreach(['news','events'] as $kind) foreach($data[$kind] as $item) {
            $check=$item; if($kind==='news' && ($item['showDetails']??true)) $check['showDetails']='on';
            validateItem($check,$kind);
            if(isset($item['image']) && str_starts_with($item['image'],'/media/')) {
                $source=$base.'/cms-transfer'.$item['image'];
                if(!is_file($source) || !getimagesize($source)) throw new RuntimeException('Missing media');
                $destination=shared().$item['image'];
                if(is_file($destination)) throw new RuntimeException('Media already exists');
                copy($source,$destination); chmod($destination,0644);
            }
        }
        $backup=shared().'/backups/pre-import-'.gmdate('Ymd-His').'.json';
        file_put_contents($backup,json_encode($rows,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)); chmod($backup,0600);
        db()->beginTransaction();
        foreach(['news','events'] as $kind) foreach($data[$kind] as $order=>$item) {
            unset($item['id']); $payload=json_encode($item,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
            $existing=array_values(array_filter($rows,fn($r)=>$r['kind']===$kind && json_decode($r['draft'],true)['title']===$item['title']));
            if($existing) query('UPDATE materials SET draft=?,published=?,sort_order=? WHERE id=?',[$payload,$payload,$order,$existing[0]['id']]);
            else query('INSERT INTO materials(kind,draft,published,sort_order) VALUES(?,?,?,?)',[$kind,$payload,$payload,$order]);
            if(isset($item['image']) && str_starts_with($item['image'],'/media/')) query('INSERT INTO images(id,path) VALUES(?,?)',[basename($item['image'],'.jpg'),$item['image']]);
        }
        db()->commit(); publishSnapshot();
        echo "Approved public content imported; no local administrators or test records copied.\n";
    } elseif($command==='create-admin') {
        if(query('SELECT COUNT(*) FROM admins')->fetchColumn()) throw new RuntimeException('An administrator already exists');
        $password=bin2hex(random_bytes(16)); $secret=''; $alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        for($i=0;$i<32;$i++) $secret.=$alphabet[random_int(0,31)];
        $enrollment=shared().'/admin-01-setup.json';
        $handle=fopen($enrollment,'x'); if(!$handle) throw new RuntimeException('Enrollment already exists');
        fwrite($handle,json_encode(['login'=>'admin-01','password'=>$password,'totpSecret'=>$secret,'algorithm'=>'SHA1','digits'=>6,'period'=>30],JSON_PRETTY_PRINT|JSON_THROW_ON_ERROR)); fclose($handle); chmod($enrollment,0600);
        query('INSERT INTO admins(login,password,secret) VALUES(?,?,?)',['admin-01',password_hash($password,PASSWORD_ARGON2ID),seal($secret)]);
        echo "Production administrator created. Enrollment stored in private shared/admin-01-setup.json; no secrets printed.\n";
    } elseif($command!=='verify') throw new RuntimeException('Unknown command');
    $snapshot=snapshot();
    $file=json_decode(file_get_contents(shared().'/content/current.json'),true,512,JSON_THROW_ON_ERROR);
    if($snapshot!==$file) throw new RuntimeException('Published snapshot differs from database');
    foreach(['news','events'] as $kind) echo $kind.': '.count($snapshot[$kind])."\n";
    echo 'MySQL version: '.query('SELECT VERSION()')->fetchColumn()."\n";
    echo 'Active admins: '.query('SELECT COUNT(*) FROM admins WHERE active=1')->fetchColumn()."\n";
    echo 'Config permissions: '.substr(sprintf('%o',fileperms(shared().'/config.php')),-4)."\n";
    echo "Database and snapshot verified.\n";
} catch(Throwable $error) {
    if(isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    // Never echo a DSN/password or raw PDO error containing connection details.
    fwrite(STDERR,'CMS preparation failed: '.($error instanceof PDOException?'Database connection or query failed':$error->getMessage())."\n"); exit(1);
}
