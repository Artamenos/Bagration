<?php
// CLI only. Upload to $HOME/Bagration/cms-backup.php (not public_html).
declare(strict_types=1);
if(PHP_SAPI!=='cli') exit;
umask(0077);
require __DIR__.'/releases/cms-setup/admin/runtime.php';
$directory=shared().'/backups/'.gmdate('Ymd-His');
if(!mkdir($directory,0700)) throw new RuntimeException('Cannot create backup directory');
$settings=config();
$escape=fn(string $s)=>str_replace(["\\","\"","\n","\r"],["\\\\","\\\"","\\n","\\r"],$s);
$client=$directory.'/.mysql.cnf';
file_put_contents($client,"[client]\nhost=localhost\nuser=\"".$escape($settings['user'])."\"\npassword=\"".$escape($settings['password'])."\"\n"); chmod($client,0600);
try {
    $process=proc_open(['/usr/bin/mysqldump','--defaults-extra-file='.$client,'--single-transaction','--no-tablespaces','--hex-blob',$settings['user']],[0=>['pipe','r'],1=>['file',$directory.'/database.sql','w'],2=>['pipe','w']],$pipes);
    if(!is_resource($process)) throw new RuntimeException('Cannot start database backup');
    fclose($pipes[0]); $error=stream_get_contents($pipes[2]); fclose($pipes[2]);
    if(proc_close($process)!==0) throw new RuntimeException('Database backup failed (no secret details printed)');
} finally { unlink($client); }
$process=proc_open(['tar','-czf',$directory.'/shared.tar.gz','-C',shared(),'config.php','content','media'],[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes);
fclose($pipes[0]); stream_get_contents($pipes[1]); fclose($pipes[1]); stream_get_contents($pipes[2]); fclose($pipes[2]);
if(proc_close($process)!==0) throw new RuntimeException('Media backup failed');
$manifest=['createdAt'=>gmdate(DATE_ATOM),'news'=>count(snapshot()['news']),'events'=>count(snapshot()['events']),'files'=>[]];
foreach(['database.sql','shared.tar.gz'] as $name) { chmod($directory.'/'.$name,0600); $manifest['files'][$name]=hash_file('sha256',$directory.'/'.$name); }
file_put_contents($directory.'/manifest.json',json_encode($manifest,JSON_PRETTY_PRINT|JSON_THROW_ON_ERROR));
echo $directory."\n";
