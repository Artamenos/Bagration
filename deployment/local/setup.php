<?php
declare(strict_types=1);
$shared='/srv/Bagration/shared';
if(!is_file($shared.'/config.php')) {
    $config=['dsn'=>'mysql:host=db;dbname=bagration;charset=utf8mb4','user'=>'bagration','password'=>'local-database-only','key'=>bin2hex(random_bytes(32)),'origin'=>'https://localhost:8443'];
    file_put_contents($shared.'/config.php',"<?php\nreturn ".var_export($config,true).";\n"); chmod($shared.'/config.php',0600);
}
