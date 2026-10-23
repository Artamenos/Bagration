<?php
declare(strict_types=1);
ini_set('display_errors','0');
require __DIR__.'/runtime.php';
header('X-Robots-Tag: noindex, nofollow'); header('Cache-Control: no-store'); header('X-Content-Type-Options: nosniff'); header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'self'; img-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
header('X-Frame-Options: DENY');
if(empty($_SERVER['HTTPS']) || $_SERVER['HTTPS']==='off') { http_response_code(403); exit('HTTPS required'); }
session_name('__Secure-bagration-admin'); session_set_cookie_params(['secure'=>true,'httponly'=>true,'samesite'=>'Strict','path'=>'/admin/']); ini_set('session.use_strict_mode','1'); session_start();
$_SESSION['csrf']??=bin2hex(random_bytes(32));
$error=''; $notice='';
try {
    $admin=isset($_SESSION['admin'])?query('SELECT * FROM admins WHERE id=? AND active=1',[$_SESSION['admin']])->fetch(PDO::FETCH_ASSOC):false;
    if($admin && (time()-($_SESSION['seen']??0)>1800 || time()-($_SESSION['started']??0)>28800)) { session_unset(); $admin=false; $_SESSION['csrf']=bin2hex(random_bytes(32)); }
    if($admin) $_SESSION['seen']=time();
    if($_SERVER['REQUEST_METHOD']==='POST') {
        if(!hash_equals($_SESSION['csrf'],(string)($_POST['csrf']??''))) throw new RuntimeException('Обновите страницу и повторите действие');
        $action=(string)($_POST['action']??'');
        if($action==='login') {
            $bucket=hash_hmac('sha256','global-login',config()['key']);
            query('INSERT IGNORE INTO login_throttle(bucket,expires) VALUES(?,?)',[$bucket,time()+300]);
            query('UPDATE login_throttle SET attempts=0,expires=? WHERE bucket=? AND expires<?',[time()+300,$bucket,time()]);
            query('UPDATE login_throttle SET attempts=attempts+1 WHERE bucket=?',[$bucket]);
            if(query('SELECT attempts FROM login_throttle WHERE bucket=?',[$bucket])->fetchColumn()>30) throw new RuntimeException('Слишком много попыток. Подождите 5 минут');
            $candidate=query('SELECT * FROM admins WHERE login=? AND active=1',[substr((string)($_POST['login']??''),0,40)])->fetch(PDO::FETCH_ASSOC);
            $valid=password_verify((string)($_POST['password']??''),$candidate['password']??'$argon2id$v=19$m=65536,t=4,p=1$VGhpcyBpcyBhIHNhbHQxMg$MLD/dummyhashnotavalidpasswordhash1234567890');
            $counter=0;
            if($candidate && $valid && (int)$candidate['locked_until']<=time()) for($n=-1;$n<=1;$n++) { $step=(int)floor(time()/30)+$n; if($step>(int)$candidate['last_totp'] && hash_equals(totp(unseal($candidate['secret']),$step),(string)($_POST['code']??''))) $counter=$step; }
            if(!$counter) { if($candidate) query('UPDATE admins SET failures=failures+1,locked_until=IF(failures>=5,?,locked_until) WHERE id=?',[time()+900,$candidate['id']]); throw new RuntimeException('Не удалось войти. Проверьте данные или подождите'); }
            $updated=query('UPDATE admins SET last_totp=?,failures=0,locked_until=0 WHERE id=? AND last_totp<?',[$counter,$candidate['id'],$counter]);
            if($updated->rowCount()!==1) throw new RuntimeException('Код уже использован');
            session_regenerate_id(true); $_SESSION=['admin'=>(int)$candidate['id'],'started'=>time(),'seen'=>time(),'csrf'=>bin2hex(random_bytes(32))]; audit('login'); header('Location: /admin/'); exit;
        }
        if(!$admin) throw new RuntimeException('Войдите в систему');
        if($action==='logout') { audit('logout'); session_destroy(); header('Location: /admin/'); exit; }
        $id=(int)($_POST['id']??0);
        if(in_array($action,['publish_changes','rollback','delete','restore_deleted'],true)) {
            $lock=fopen(shared().'/.publish.lock','c');
            if(!$lock || !flock($lock,LOCK_EX)) throw new RuntimeException('Повторите действие');
            try {
                db()->beginTransaction();
                $row=$id?query('SELECT * FROM materials WHERE id=? FOR UPDATE',[$id])->fetch(PDO::FETCH_ASSOC):false;
                if($id && !$row) throw new RuntimeException('Материал не найден');
                if($row && (int)$row['version']!==(int)($_POST['version']??0)) throw new RuntimeException('Другой администратор изменил материал. Обновите страницу');
                $kind=$row['kind']??($_POST['kind']??'news');
                if(!in_array($kind,['news','events'],true)) throw new RuntimeException('Неверный раздел');
                if(in_array($action,['delete','restore_deleted'],true)) {
                    if(!$row) throw new RuntimeException('Материал не найден');
                    $data=json_decode($row['draft'],true,512,JSON_THROW_ON_ERROR);
                    if($action==='delete') {
                        if(empty($_POST['confirm_delete'])) throw new RuntimeException('Подтвердите удаление');
                        $data['_deleted']=true;
                    } else unset($data['_deleted']);
                    query('UPDATE materials SET draft=?,published=NULL,version=version+1 WHERE id=?',[json_encode($data,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),$id]);
                    audit($action,$id); db()->commit(); publishSnapshot();
                    $_SESSION['flash']=$action==='delete'?'Материал удалён с сайта и перемещён в корзину.':'Материал восстановлен. Откройте его и опубликуйте, когда будете готовы.';
                    header('Location: /admin/?kind='.$kind); exit;
                }
                if($row && !empty(json_decode($row['draft'],true)['_deleted'])) throw new RuntimeException('Сначала восстановите материал из корзины');
                if($action==='rollback') {
                    $previous=query('SELECT id,payload FROM revisions WHERE material_id=? ORDER BY id DESC LIMIT 1',[$id])->fetch(PDO::FETCH_ASSOC);
                    if(!$previous) throw new RuntimeException('Предыдущих сохранений пока нет');
                    query('UPDATE materials SET draft=?,published=?,version=version+1 WHERE id=?',[$previous['payload'],$previous['payload'],$id]);
                    query('DELETE FROM revisions WHERE id=?',[$previous['id']]);
                } else {
                    if(isset($_FILES['photo']) && $_FILES['photo']['error']!==UPLOAD_ERR_NO_FILE) $_POST['image']=uploadPhoto($_FILES['photo']);
                    // The summary is enough for a short news item; a full text is optional in the editor.
                    if($kind==='news' && trim((string)($_POST['details']??''))==='') $_POST['details']=$_POST['description']??'';
                    $payload=json_encode(validateItem($_POST,$kind),JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
                    if($row) {
                        query('INSERT INTO revisions(material_id,payload) VALUES(?,?)',[$id,$row['published']??$row['draft']]);
                        query('UPDATE materials SET draft=?,published=?,sort_order=?,version=version+1 WHERE id=?',[$payload,$payload,(int)($_POST['sort_order']??0),$id]);
                    } else {
                        query('INSERT INTO materials(kind,draft,published,sort_order) VALUES(?,?,?,?)',[$kind,$payload,$payload,(int)($_POST['sort_order']??0)]); $id=(int)db()->lastInsertId();
                    }
                }
                audit($action,$id); db()->commit(); publishSnapshot();
                $_SESSION['flash']=$action==='rollback'?'Предыдущее сохранение восстановлено. Изменения уже на сайте.':'Готово! Изменения опубликованы на сайте.';
                header('Location: /admin/?edit='.$id); exit;
            } catch(Throwable $e) { if(db()->inTransaction()) db()->rollBack(); throw $e; }
            finally { flock($lock,LOCK_UN); fclose($lock); }
        } elseif($action==='upload') {
            $file=$_FILES['image']??[];
            if(($file['error']??1)!==UPLOAD_ERR_OK || $file['size']>8*1024*1024 || !is_uploaded_file($file['tmp_name'])) throw new RuntimeException('Изображение должно быть не больше 8 МБ');
            $info=getimagesize($file['tmp_name']);
            if(!$info || !in_array($info[2],[IMAGETYPE_JPEG,IMAGETYPE_PNG,IMAGETYPE_WEBP],true) || $info[0]*$info[1]>20000000) throw new RuntimeException('Разрешены JPEG, PNG, WebP до 20 мегапикселей');
            $image=imagecreatefromstring(file_get_contents($file['tmp_name'])); if(!$image) throw new RuntimeException('Не удалось обработать изображение');
            $key=bin2hex(random_bytes(16)); $path=shared().'/media/'.$key.'.jpg';
            try { if(!imagejpeg($image,$path,85)) throw new RuntimeException('Не удалось сохранить изображение'); chmod($path,0644); } finally { imagedestroy($image); }
            query('INSERT INTO images(id,path) VALUES(?,?)',[$key,'/media/'.$key.'.jpg']); audit('upload'); $notice='Изображение: /media/'.$key.'.jpg';
        } elseif(in_array($action,['save','publish','unpublish','restore','preview'],true)) {
            $lock=fopen(shared().'/.publish.lock','c'); if(!$lock || !flock($lock,LOCK_EX)) throw new RuntimeException('Повторите действие');
            try {
                $row=$id?query('SELECT * FROM materials WHERE id=?',[$id])->fetch(PDO::FETCH_ASSOC):false;
                if($id && !$row) throw new RuntimeException('Материал не найден');
                $kind=$row['kind']??($_POST['kind']??'news'); if(!in_array($kind,['news','events'],true)) throw new RuntimeException('Неверный раздел');
                if($row && !empty(json_decode($row['draft'],true)['_deleted'])) throw new RuntimeException('Сначала восстановите материал из корзины');
                if($action==='save') {
                    $item=validateItem($_POST,$kind); $json=json_encode($item,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
                    if($row) {
                        db()->beginTransaction();
                        $changed=query('UPDATE materials SET draft=?,sort_order=?,version=version+1 WHERE id=? AND version=?',[$json,(int)($_POST['sort_order']??0),$id,(int)($_POST['version']??0)]);
                        if($changed->rowCount()!==1) { db()->rollBack(); throw new RuntimeException('Материал изменён другим администратором. Обновите страницу'); }
                        query('INSERT INTO revisions(material_id,payload) VALUES(?,?)',[$id,$row['draft']]); db()->commit();
                    } else { query('INSERT INTO materials(kind,draft,sort_order) VALUES(?,?,?)',[$kind,$json,(int)($_POST['sort_order']??0)]); $id=(int)db()->lastInsertId(); }
                } elseif($row) {
                    if($action==='publish') query('UPDATE materials SET published=draft WHERE id=?',[$id]);
                    if($action==='unpublish') query('UPDATE materials SET published=NULL WHERE id=?',[$id]);
                    if($action==='restore') {
                        $revision=query('SELECT payload FROM revisions WHERE id=? AND material_id=?',[(int)($_POST['revision']??0),$id])->fetchColumn();
                        if(!$revision) throw new RuntimeException('Версия не найдена');
                        db()->beginTransaction(); query('INSERT INTO revisions(material_id,payload) VALUES(?,?)',[$id,$row['draft']]); query('UPDATE materials SET draft=?,version=version+1 WHERE id=?',[$revision,$id]); db()->commit();
                    }
                    if($action==='preview') {
                        query('DELETE FROM previews WHERE expires<?',[time()]); $token=bin2hex(random_bytes(32));
                        query('INSERT INTO previews(token,payload,expires) VALUES(?,?,?)',[hash('sha256',$token),$row['draft'],time()+3600]);
                        $notice=config()['origin'].'/preview/?token='.$token;
                    }
                }
                if(in_array($action,['publish','unpublish','save'],true)) publishSnapshot();
                audit($action,$id); if(!$notice) { header('Location: /admin/?edit='.$id); exit; }
            } finally { flock($lock,LOCK_UN); fclose($lock); }
        }
    }
} catch(Throwable $e) { if(isset($pdo) && $pdo->inTransaction()) $pdo->rollBack(); $error=$e instanceof RuntimeException && !($e instanceof PDOException)?$e->getMessage():'Операция не выполнена. Проверьте настройку CMS'; }
function hidden(string $action,int $id=0): void { echo '<input type="hidden" name="csrf" value="'.esc($_SESSION['csrf']).'"><input type="hidden" name="action" value="'.esc($action).'"><input type="hidden" name="id" value="'.$id.'">'; }
require __DIR__ . '/view.php';
