<?php
// Local demonstration only. This file is not included in the public release.
declare(strict_types=1);
require '/srv/Bagration/releases/local/admin/runtime.php';
$image=imagecreatefrompng('/tmp/bagration-example-poster.png');
if(!$image) throw new RuntimeException('Cannot read example poster');
$imageId=bin2hex(random_bytes(16)); $path='/media/'.$imageId.'.jpg';
imagejpeg($image,shared().$path,90); imagedestroy($image); chmod(shared().$path,0644);
query('INSERT INTO images(id,path) VALUES(?,?)',[$imageId,$path]);
$examples=[
 ['title'=>'Первенство и чемпионат городского округа Лобни','city'=>'Лобня, Чехова, д. 65 · Дворец спорта Лобня','layout'=>'poster','image'=>$path,'description'=>'Начало в 10:00. Киокушин — сила духа, воля к победе.'],
 ['title'=>'Пример события с фотографией','city'=>'Багратион','layout'=>'photo','image'=>'/images/112.jpg','description'=>'Это демонстрационная карточка для проверки оформления. Фотография находится сверху, а название, место, дата и полный текст — под ней. Текст не перекрывается изображением и доступен целиком.'],
 ['title'=>'Пример события без фотографии','city'=>'Багратион','layout'=>'photo','description'=>'Если изображение ещё не загружено, вместо него показывается логотип клуба. Это локальный пример, который можно удалить в админке.'],
];
foreach($examples as $order=>$item) {
    $item['startDate']='2026-11-21'; $item['endDate']='2026-11-21';
    $payload=json_encode($item,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
    $id=query('SELECT id FROM materials WHERE kind=? AND JSON_UNQUOTE(JSON_EXTRACT(draft,?))=?',['events','$.title',$item['title']])->fetchColumn();
    if($id) query('UPDATE materials SET draft=?,published=?,version=version+1 WHERE id=?',[$payload,$payload,$id]);
    else query('INSERT INTO materials(kind,draft,published,sort_order) VALUES(?,?,?,?)',['events',$payload,$payload,-10+$order]);
}
publishSnapshot(); echo "Local examples published on 21.11.2026\n";
