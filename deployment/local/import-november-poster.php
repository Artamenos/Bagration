<?php
// Run only in the local Docker environment; data transcribed from the supplied poster.
declare(strict_types=1);
require '/srv/Bagration/releases/local/admin/runtime.php';
if(config()['origin']!=='https://localhost:8443') throw new RuntimeException('Local environment required');
$image=imagecreatefrompng('/tmp/bagration-november-poster.png');
if(!$image) throw new RuntimeException('Cannot read poster');
$imageId=bin2hex(random_bytes(16)); $path='/media/'.$imageId.'.jpg';
try { if(!imagejpeg($image,shared().$path,92)) throw new RuntimeException('Cannot save poster'); chmod(shared().$path,0644); } finally { imagedestroy($image); }
$item=validateItem([
    'title'=>'Первенство, чемпионат и фестиваль городского округа Лобня',
    'city'=>'Лобня, Чехова, д. 65 · Дворец спорта «Лобня»',
    'startDate'=>'2026-11-21','endDate'=>'2026-11-21','layout'=>'poster','image'=>$path,
    'description'=>'21 ноября 2026 года во Дворце спорта «Лобня» пройдут первенство, чемпионат и фестиваль городского округа Лобня по киокушин. Начало в 10:00.',
],'events');
$payload=json_encode($item,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
$lock=fopen(shared().'/.publish.lock','c');
if(!$lock || !flock($lock,LOCK_EX)) throw new RuntimeException('Cannot lock publication');
try {
    db()->beginTransaction();
    query('INSERT INTO images(id,path) VALUES(?,?)',[$imageId,$path]);
    $row=query('SELECT * FROM materials WHERE kind=? AND JSON_UNQUOTE(JSON_EXTRACT(draft,?))=?',['events','$.title',$item['title']])->fetch(PDO::FETCH_ASSOC);
    if($row) {
        query('INSERT INTO revisions(material_id,payload) VALUES(?,?)',[$row['id'],$row['draft']]);
        query('UPDATE materials SET draft=?,published=?,version=version+1 WHERE id=?',[$payload,$payload,$row['id']]); $id=$row['id'];
    } else {
        query('INSERT INTO materials(kind,draft,published,sort_order) VALUES(?,?,?,?)',['events',$payload,$payload,0]); $id=db()->lastInsertId();
    }
    db()->commit(); publishSnapshot(); echo 'Published local event '.$id.' on 21.11.2026'.PHP_EOL;
} catch(Throwable $e) { if(db()->inTransaction()) db()->rollBack(); throw $e; }
finally { flock($lock,LOCK_UN); fclose($lock); }
