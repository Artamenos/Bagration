<?php
// For private loopback acceptance tests only, never copy into a public release.
declare(strict_types=1);
if(PHP_SAPI!=='cli-server' || ($_SERVER['REMOTE_ADDR']??'')!=='127.0.0.1') { http_response_code(403); exit; }
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
if($path==='/admin/' || $path==='/admin/index.php') {
    // Simulate Timeweb's HTTPS server variable; traffic stays on loopback, not public HTTP.
    $_SERVER['HTTPS']='on'; require __DIR__.'/releases/cms-setup/admin/index.php'; return true;
}
http_response_code(404); return true;
