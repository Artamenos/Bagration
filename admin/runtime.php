<?php
declare(strict_types=1);

function shared(): string { return dirname(__DIR__, 3) . '/shared'; }
function config(): array {
    static $c;
    if (!$c) {
        $path = shared() . '/config.php';
        if (!is_file($path)) throw new RuntimeException('CMS is not configured');
        $c = require $path;
        if (!preg_match('/^[a-f0-9]{64}$/i', $c['key'] ?? '')) throw new RuntimeException('Invalid encryption key');
    }
    return $c;
}
function db(): PDO {
    static $pdo;
    if (!$pdo) { $c = config(); $pdo = new PDO($c['dsn'], $c['user'], $c['password'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES=>false]); }
    return $pdo;
}
function query(string $sql, array $args = []): PDOStatement { $s = db()->prepare($sql); $s->execute($args); return $s; }
function esc(mixed $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function seal(string $text): string {
    $iv = random_bytes(12); $tag = '';
    $encrypted = openssl_encrypt($text, 'aes-256-gcm', hex2bin(config()['key']), OPENSSL_RAW_DATA, $iv, $tag);
    if ($encrypted === false) throw new RuntimeException('Encryption failed');
    return base64_encode($iv . $tag . $encrypted);
}
function unseal(string $text): string {
    $data = base64_decode($text, true);
    if ($data === false || strlen($data) < 28) throw new RuntimeException('Invalid secret');
    $plain = openssl_decrypt(substr($data,28), 'aes-256-gcm', hex2bin(config()['key']), OPENSSL_RAW_DATA, substr($data,0,12), substr($data,12,16));
    if ($plain === false) throw new RuntimeException('Decryption failed');
    return $plain;
}
function totp(string $secret, int $counter): string {
    $bits = ''; $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    foreach (str_split($secret) as $char) { $position = strpos($alphabet,$char); if ($position === false) throw new RuntimeException('Invalid TOTP'); $bits .= str_pad(decbin($position),5,'0',STR_PAD_LEFT); }
    $key = ''; foreach (str_split($bits,8) as $byte) if (strlen($byte)===8) $key .= chr(bindec($byte));
    $hash = hash_hmac('sha1',pack('N2',0,$counter),$key,true); $offset=ord($hash[19])&15;
    return str_pad((string)((unpack('N',substr($hash,$offset,4))[1]&0x7fffffff)%1000000),6,'0',STR_PAD_LEFT);
}
function audit(string $action, ?int $id=null): void { query('INSERT INTO audit(admin_id,action,material_id) VALUES(?,?,?)',[$_SESSION['admin']??null,$action,$id]); }
function snapshot(): array {
    $result=['schemaVersion'=>1,'news'=>[],'events'=>[]];
    foreach(query('SELECT id,kind,published FROM materials WHERE published IS NOT NULL ORDER BY sort_order,id')->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $item=json_decode($row['published'],true,512,JSON_THROW_ON_ERROR); $item['id']=(int)$row['id']; $result[$row['kind']][]=$item;
    }
    return $result;
}
function publishSnapshot(): void {
    $dir=shared().'/content';
    $json=json_encode(snapshot(),JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
    $temporary=tempnam($dir,'.snapshot-');
    try { if(file_put_contents($temporary,$json)===false) throw new RuntimeException('Snapshot write failed'); chmod($temporary,0644); if(!rename($temporary,$dir.'/current.json')) throw new RuntimeException('Snapshot rename failed'); } finally { if(is_file($temporary)) unlink($temporary); }
}
function textField(array $data,string $key,int $max,bool $required=false): string {
    $value=trim((string)($data[$key]??''));
    if(mb_strlen($value)>$max || ($required && $value==='')) throw new RuntimeException('Проверьте поле '.$key);
    return $value;
}
function validDate(string $value): bool { $d=DateTimeImmutable::createFromFormat('!Y-m-d',$value); return $d && $d->format('Y-m-d')===$value; }
function uploadPhoto(array $file): string {
    if(($file['error']??1)!==UPLOAD_ERR_OK || $file['size']>8*1024*1024 || !is_uploaded_file($file['tmp_name'])) throw new RuntimeException('Выберите фотографию размером до 8 МБ');
    $info=getimagesize($file['tmp_name']);
    if(!$info || !in_array($info[2],[IMAGETYPE_JPEG,IMAGETYPE_PNG,IMAGETYPE_WEBP],true) || $info[0]*$info[1]>20000000) throw new RuntimeException('Подойдёт JPEG, PNG или WebP до 20 мегапикселей');
    $image=imagecreatefromstring(file_get_contents($file['tmp_name']));
    if(!$image) throw new RuntimeException('Не удалось прочитать фотографию');
    $id=bin2hex(random_bytes(16)); $path='/media/'.$id.'.jpg';
    try { if(!imagejpeg($image,shared().$path,85)) throw new RuntimeException('Не удалось сохранить фотографию'); chmod(shared().$path,0644); } finally { imagedestroy($image); }
    query('INSERT INTO images(id,path) VALUES(?,?)',[$id,$path]);
    return $path;
}
function validateItem(array $data,string $kind): array {
    $item=['title'=>textField($data,'title',180,true)];
    if($kind==='events') {
        $item['city']=textField($data,'city',180,true); $item['startDate']=textField($data,'startDate',10,true); $item['endDate']=textField($data,'endDate',10)?:$item['startDate'];
        if(!validDate($item['startDate'])||!validDate($item['endDate'])||$item['endDate']<$item['startDate']) throw new RuntimeException('Проверьте даты');
        $item['layout']=textField($data,'layout',10)?:'photo';
        if(!in_array($item['layout'],['poster','photo'],true)) throw new RuntimeException('Выберите «Постер» или «Фото»');
        $item['description']=textField($data,'description',12000);
        $image=textField($data,'image',200);
        if($image!=='' && !preg_match('~^/(images/[a-zA-Z0-9_.-]+|media/[a-f0-9]{32}\.jpg)$~',$image)) throw new RuntimeException('Выберите изображение события');
        if($image!=='') $item['image']=$image;
    } else {
        foreach(['date'=>10,'dateLabel'=>40,'category'=>100,'description'=>600,'details'=>12000,'image'=>200] as $key=>$max) $item[$key]=textField($data,$key,$max,in_array($key,['date','category','description','details','image'],true));
        if(!validDate($item['date'])||!preg_match('~^/(images/[a-zA-Z0-9_.-]+|media/[a-f0-9]{32}\.jpg)$~',$item['image'])) throw new RuntimeException('Проверьте дату и изображение');
        $item['imagePosition']=($data['imagePosition']??'center')==='center top'?'center top':'center';
        $item['showDetails']=isset($data['showDetails']);
        $url=textField($data,'detailsUrl',300);
        if($url!=='' && !preg_match('~^(#[a-zA-Z0-9_-]+|https://[^\s<>"\x27]+)$~',$url)) throw new RuntimeException('Разрешены HTTPS-ссылки и якоря');
        if($url!=='') $item['detailsUrl']=$url;
        if($item['dateLabel']==='') unset($item['dateLabel']);
    }
    return $item;
}
