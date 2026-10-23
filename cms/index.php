<?php
declare(strict_types=1);
ini_set('display_errors','0');
date_default_timezone_set('Europe/Moscow');
require __DIR__.'/runtime.php';
require __DIR__.'/ordering.php';
header('X-Robots-Tag: noindex, nofollow'); header('Cache-Control: no-store');
// no-referrer makes browser form POSTs send Origin:null, conflicting with the origin check.
// same-origin keeps form origins usable without sending admin URLs to other websites.
header('X-Content-Type-Options: nosniff'); header('Referrer-Policy: same-origin'); header('X-Frame-Options: DENY');
header("Content-Security-Policy: default-src 'none'; style-src 'self'; img-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
if(empty($_SERVER['HTTPS']) || $_SERVER['HTTPS']==='off') { http_response_code(403); exit('HTTPS required'); }
if(!in_array($_SERVER['REQUEST_METHOD'],['GET','POST'],true)) { header('Allow: GET, POST'); http_response_code(405); exit; }
if((int)($_SERVER['CONTENT_LENGTH']??0)>10*1024*1024) { http_response_code(413); exit('Request too large'); }
ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1'); ini_set('session.use_trans_sid','0');
session_name('__Secure-bagration-admin');
session_set_cookie_params(['secure'=>true,'httponly'=>true,'samesite'=>'Strict','path'=>'/admin/']); session_start();
$_SESSION['csrf']??=bin2hex(random_bytes(32));
$error=''; $notice=''; $admin=false;
try {
    foreach([$_GET,$_POST] as $input) foreach($input as $value) if(!is_string($value)) throw new RuntimeException('Неверный формат запроса');
    $admin=isset($_SESSION['admin'])?query('SELECT * FROM admins WHERE id=? AND active=1',[$_SESSION['admin']])->fetch(PDO::FETCH_ASSOC):false;
    if(isset($_SESSION['admin']) && !$admin) { session_unset(); session_regenerate_id(true); $_SESSION['csrf']=bin2hex(random_bytes(32)); }
    if($admin && (time()-($_SESSION['seen']??0)>1800 || time()-($_SESSION['started']??0)>28800)) {
        session_unset(); session_regenerate_id(true); $admin=false; $_SESSION['csrf']=bin2hex(random_bytes(32));
    }
    if($admin) $_SESSION['seen']=time();
    if($_SERVER['REQUEST_METHOD']==='POST') {
        if(($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site' || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN']!==config()['origin'])) throw new RuntimeException('Запрос с другого сайта запрещён');
        if(!hash_equals($_SESSION['csrf'],$_POST['csrf']??'')) throw new RuntimeException('Обновите страницу и повторите действие');
        $action=$_POST['action']??'';
        if($action==='login') {
            $bucket=hash_hmac('sha256','global-login',config()['key']);
            query('DELETE FROM login_throttle WHERE expires<?',[time()]);
            query('INSERT IGNORE INTO login_throttle(bucket,expires) VALUES(?,?)',[$bucket,time()+300]);
            query('UPDATE login_throttle SET attempts=attempts+1 WHERE bucket=?',[$bucket]);
            if((int)query('SELECT attempts FROM login_throttle WHERE bucket=?',[$bucket])->fetchColumn()>30) throw new RuntimeException('Слишком много попыток. Подождите 5 минут');
            $login=$_POST['login']??''; $password=$_POST['password']??''; $code=$_POST['code']??'';
            if(strlen($password)>200 || !preg_match('/^admin-[0-9]{2}$/D',$login) || !preg_match('/^[0-9]{6}$/D',$code)) throw new RuntimeException('Не удалось войти. Проверьте данные или подождите');
            $candidate=query('SELECT * FROM admins WHERE login=? AND active=1',[$login])->fetch(PDO::FETCH_ASSOC);
            $dummy='$argon2id$v=19$m=65536,t=4,p=1$YWJjZGVmZ2hpamtsbW5vcA$YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU';
            $valid=password_verify($password,$candidate['password']??$dummy); $counter=0;
            if($candidate && (int)$candidate['locked_until']>0 && (int)$candidate['locked_until']<=time()) {
                query('UPDATE admins SET failures=0,locked_until=0 WHERE id=?',[$candidate['id']]); $candidate['locked_until']=0;
            }
            if($candidate && $valid && (int)$candidate['locked_until']<=time()) for($n=-1;$n<=1;$n++) {
                $step=(int)floor(time()/30)+$n;
                if($step>(int)$candidate['last_totp'] && hash_equals(totp(unseal($candidate['secret']),$step),$code)) $counter=$step;
            }
            if(!$counter) {
                if($candidate && (int)$candidate['locked_until']<=time()) query('UPDATE admins SET locked_until=IF(failures>=4,?,locked_until),failures=failures+1 WHERE id=?',[time()+900,$candidate['id']]);
                throw new RuntimeException('Не удалось войти. Проверьте данные или подождите');
            }
            if(query('UPDATE admins SET last_totp=?,failures=0,locked_until=0 WHERE id=? AND active=1 AND last_totp<?',[$counter,$candidate['id'],$counter])->rowCount()!==1) throw new RuntimeException('Код уже использован');
            session_regenerate_id(true); $_SESSION=['admin'=>(int)$candidate['id'],'started'=>time(),'seen'=>time(),'csrf'=>bin2hex(random_bytes(32))]; audit('login');
            header('Location: /admin/'); exit;
        }
        if(!$admin) throw new RuntimeException('Войдите в систему');
        if($action==='logout') {
            audit('logout'); $_SESSION=[]; session_destroy();
            setcookie(session_name(),'', ['expires'=>time()-3600,'path'=>'/admin/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);
            header('Location: /admin/'); exit;
        }
        if(!in_array($action,['publish_changes','rollback','delete','restore_deleted','move','preview'],true)) throw new RuntimeException('Неизвестное действие');
        $id=filter_var($_POST['id']??'0',FILTER_VALIDATE_INT,['options'=>['min_range'=>0]]);
        if($id===false) throw new RuntimeException('Неверный материал');
        $lock=fopen(shared().'/.publish.lock','c');
        if(!$lock || !flock($lock,LOCK_EX)) throw new RuntimeException('Повторите действие');
        $uploaded=null; $committed=false;
        try {
            db()->beginTransaction();
            $row=$id?query('SELECT * FROM materials WHERE id=? FOR UPDATE',[$id])->fetch(PDO::FETCH_ASSOC):false;
            if($id && !$row) throw new RuntimeException('Материал не найден');
            if($row && (int)$row['version']!==(int)($_POST['version']??0)) throw new RuntimeException('Другой администратор изменил материал. Обновите страницу');
            $kind=$row['kind']??($_POST['kind']??'news');
            if(!in_array($kind,['news','events'],true)) throw new RuntimeException('Неверный раздел');
            $old=$row?json_decode($row['draft'],true,512,JSON_THROW_ON_ERROR):[];
            $day=$_POST['day']??'';
            if($day!=='' && !validDate($day)) throw new RuntimeException('Проверьте дату списка');
            if($action==='restore_deleted' || $action==='delete') {
                if(!$row) throw new RuntimeException('Материал не найден');
                if($action==='delete') { if(empty($_POST['confirm_delete'])) throw new RuntimeException('Подтвердите удаление'); $old['_deleted']=true; }
                else unset($old['_deleted']);
                query('UPDATE materials SET draft=?,published=NULL,version=version+1 WHERE id=?',[json_encode($old,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),$id]); audit($action,$id);
            } else {
                if(!empty($old['_deleted'])) throw new RuntimeException('Сначала восстановите материал из корзины');
                if($action==='move') {
                    if(!$row) throw new RuntimeException('Материал не найден');
                    moveMaterial($id,$kind,$day,$_POST['direction']??'',$_POST['list_version']??'');
                } elseif($action==='preview') {
                    if(!$row) throw new RuntimeException('Сначала опубликуйте материал');
                    query('DELETE FROM previews WHERE expires<?',[time()]); $token=bin2hex(random_bytes(32));
                    query('INSERT INTO previews(token,payload,expires) VALUES(?,?,?)',[hash('sha256',$token),$row['draft'],time()+3600]);
                    audit('preview',$id); db()->commit(); $committed=true;
                    header('Location: /preview/?token='.$token); exit;
                } else {
                    if($action==='rollback') {
                        $previous=query('SELECT id,payload FROM revisions WHERE material_id=? ORDER BY id DESC LIMIT 1',[$id])->fetch(PDO::FETCH_ASSOC);
                        if(!$previous) throw new RuntimeException('Предыдущих сохранений пока нет');
                        $item=retainDayOrder(json_decode($previous['payload'],true,512,JSON_THROW_ON_ERROR),$old);
                        query('DELETE FROM revisions WHERE id=?',[$previous['id']]);
                    } else {
                        $input=$_POST;
                        if($kind==='news' && trim($input['details']??'')==='') $input['details']=$input['description']??'';
                        $hasUpload=isset($_FILES['photo']) && ($_FILES['photo']['error']??UPLOAD_ERR_NO_FILE)!==UPLOAD_ERR_NO_FILE;
                        if($hasUpload) $input['image']='/images/logo_coaches.png';
                        $item=retainDayOrder(validateItem($input,$kind),$old);
                        if($hasUpload) $item['image']=$uploaded=uploadPhoto($_FILES['photo']);
                        if($row) query('INSERT INTO revisions(material_id,payload) VALUES(?,?)',[$id,$row['published']??$row['draft']]);
                    }
                    $payload=json_encode($item,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
                    if($row) query('UPDATE materials SET draft=?,published=?,version=version+1 WHERE id=?',[$payload,$payload,$id]);
                    else {
                        $last=(int)query('SELECT COALESCE(MAX(sort_order),0) FROM materials WHERE kind=?',[$kind])->fetchColumn();
                        query('INSERT INTO materials(kind,draft,published,sort_order) VALUES(?,?,?,?)',[$kind,$payload,$payload,$last+1]); $id=(int)db()->lastInsertId();
                    } audit($action,$id);
                    if($day==='' || !materialOnDay(['kind'=>$kind,'draft'=>$payload],$day)) $day=$item[$kind==='events'?'startDate':'date'];
                }
            }
            db()->commit(); $committed=true; publishSnapshot();
            $_SESSION['flash']=match($action) {
                'move'=>'Порядок на '.russianDate($day).' обновлён на сайте.', 'delete'=>'Материал перемещён в корзину.',
                'restore_deleted'=>'Материал восстановлен. Откройте и опубликуйте его.', 'rollback'=>'Предыдущее сохранение восстановлено и опубликовано.',
                default=>'Изменения опубликованы на сайте.',
            };
            $suffix=$day!==''?'&day='.rawurlencode($day):'';
            header('Location: /admin/?kind='.$kind.($action==='delete'?'':'&edit='.$id).$suffix); exit;
        } catch(Throwable $e) {
            if(db()->inTransaction()) db()->rollBack();
            if(!$committed && $uploaded && is_file(shared().$uploaded)) unlink(shared().$uploaded);
            throw $e;
        } finally { flock($lock,LOCK_UN); fclose($lock); }
    }
} catch(Throwable $e) {
    $error=$e instanceof RuntimeException && !($e instanceof PDOException)?$e->getMessage():'Операция не выполнена. Проверьте настройку CMS';
}
function hidden(string $action,int $id=0): void {
    echo '<input type="hidden" name="csrf" value="'.esc($_SESSION['csrf']).'"><input type="hidden" name="action" value="'.esc($action).'"><input type="hidden" name="id" value="'.$id.'">';
}
require __DIR__.'/view.php';
