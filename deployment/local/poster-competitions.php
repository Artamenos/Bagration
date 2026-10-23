<?php
declare(strict_types=1);
require '/srv/Bagration/releases/local/admin/runtime.php';
if(config()['origin']!=='https://localhost:8443') throw new RuntimeException('Local environment required');
$lock=fopen(shared().'/.publish.lock','c'); if(!$lock || !flock($lock,LOCK_EX)) throw new RuntimeException('Lock failed');
try {
    $changes=[];
    foreach(query('SELECT * FROM materials WHERE kind=?',['events'])->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $draft=json_decode($row['draft'],true,512,JSON_THROW_ON_ERROR);
        if(!empty($draft['_deleted']) || !preg_match('/соревнован|первенств|чемпионат|спартакиад|юношеские игры|турнир/iu',$draft['title'])) continue;
        $published=$row['published']!==null?json_decode($row['published'],true,512,JSON_THROW_ON_ERROR):null;
        if(($draft['layout']??null)==='poster' && (!$published || ($published['layout']??null)==='poster')) continue;
        $changes[]=$row;
    }
    if($changes) {
        $backup=shared().'/poster-format-backup-'.gmdate('Ymd-His').'.json';
        if(file_put_contents($backup,json_encode($changes,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR))===false) throw new RuntimeException('Backup failed'); chmod($backup,0600);
        db()->beginTransaction();
        foreach($changes as $row) {
            $draft=json_decode($row['draft'],true); $draft['layout']='poster';
            $published=$row['published']!==null?json_decode($row['published'],true):null;
            if($published) $published['layout']='poster';
            query('INSERT INTO revisions(material_id,payload) VALUES(?,?)',[$row['id'],$row['draft']]);
            query('UPDATE materials SET draft=?,published=?,version=version+1 WHERE id=?',[json_encode($draft,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),$published?json_encode($published,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR):null,$row['id']]);
        }
        db()->commit();
    }
    publishSnapshot(); echo 'Competitions converted: '.count($changes).PHP_EOL;
} catch(Throwable $e) { if(db()->inTransaction()) db()->rollBack(); throw $e; }
finally { flock($lock,LOCK_UN); fclose($lock); }
