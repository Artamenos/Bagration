<?php
declare(strict_types=1);
require '/srv/Bagration/releases/local/admin/runtime.php';
$file=shared().'/local-access.json';
if(!is_file($file)) {
    $password=bin2hex(random_bytes(12)); $secret=''; $alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    for($i=0;$i<32;$i++) $secret.=$alphabet[random_int(0,31)];
    query('INSERT INTO admins(login,password,secret) VALUES(?,?,?)',['admin-01',password_hash($password,PASSWORD_ARGON2ID),seal($secret)]);
    file_put_contents($file,json_encode(['login'=>'admin-01','password'=>$password,'totpSecret'=>$secret])); chmod($file,0600); chown($file,'www-data');
}
$access=json_decode(file_get_contents($file),true);
echo "LOCAL TEST ACCOUNT ONLY\nLogin: ".$access['login']."\nPassword: ".$access['password']."\nTOTP secret: ".$access['totpSecret']."\nCurrent code: ".totp($access['totpSecret'],(int)floor(time()/30))."\n";
