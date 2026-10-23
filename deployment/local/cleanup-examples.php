<?php
declare(strict_types=1);
require '/srv/Bagration/releases/local/admin/runtime.php';
$known=['Локальная проверка CMS','Изменено одной кнопкой','Проверка: poster','Проверка: photo','Первенство и чемпионат городского округа Лобни','Пример события с фотографией','Пример события без фотографии'];
$rows=query('SELECT * FROM materials ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);
$remove=[];
foreach($rows as $row) {
    $item=json_decode($row['draft'],true);
    echo $row['id'].' '.$row['kind'].' '.$item['title'].PHP_EOL;
    if($row['kind']==='events' && (int)$row['id']>=22 && in_array($item['title'],$known,true)) $remove[]=$row;
}
if(($argv[1]??'')!=='--apply') { echo 'Candidates: '.implode(',',array_column($remove,'id')).PHP_EOL; exit; }
if(!$remove) { echo "Nothing to remove\n"; exit; }
$ids=array_column($remove,'id'); $marks=implode(',',array_fill(0,count($ids),'?'));
$backup=['materials'=>$remove,'revisions'=>query('SELECT * FROM revisions WHERE material_id IN ('.$marks.')',$ids)->fetchAll(PDO::FETCH_ASSOC)];
$path=shared().'/cleanup-backup-'.gmdate('Ymd-His').'.json';
if(file_put_contents($path,json_encode($backup,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR))===false) throw new RuntimeException('Backup failed');
chmod($path,0600);
db()->beginTransaction();
try {
    query('DELETE FROM revisions WHERE material_id IN ('.$marks.')',$ids);
    query('DELETE FROM materials WHERE id IN ('.$marks.')',$ids);
    db()->commit();
} catch(Throwable $e) { db()->rollBack(); throw $e; }
publishSnapshot();
echo 'Removed: '.implode(',',$ids).'; recovery copy: '.$path.PHP_EOL;
