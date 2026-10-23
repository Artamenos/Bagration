<?php
// Isolated loopback HTTP integration test. Never expose this file as a web endpoint.
declare(strict_types=1);
if(PHP_SAPI!=='cli') exit;
require __DIR__.'/releases/cms-setup/admin/runtime.php';
$root=__DIR__.'/releases/cms-setup';
$baseline=snapshot(); $ids=[]; $process=null; $account=null;
$cookie='';
function check(bool $value,string $message): void { if(!$value) throw new RuntimeException($message); }
function request(string $path,?array $fields=null,?string $raw=null,?string $contentType=null): array {
    global $cookie;
    $body=$raw??($fields===null?'':http_build_query($fields));
    $headers="Cookie: $cookie\r\n";
    if($fields!==null || $raw!==null) $headers.='Content-Type: '.($contentType??'application/x-www-form-urlencoded')."\r\n";
    $context=stream_context_create(['http'=>['method'=>$fields!==null||$raw!==null?'POST':'GET','header'=>$headers,'content'=>$body,'ignore_errors'=>true,'follow_location'=>0,'timeout'=>15]]);
    $text=file_get_contents('http://127.0.0.1:18881'.$path,false,$context);
    $status=0; $location='';
    foreach($http_response_header??[] as $h) {
        if(preg_match('~^HTTP/\S+ (\d+)~',$h,$m)) $status=(int)$m[1];
        if(preg_match('~^Set-Cookie: ([^;]+)~i',$h,$m)) $cookie=$m[1];
        if(str_starts_with($h,'Location: ')) $location=substr($h,10);
    }
    return ['status'=>$status,'text'=>$text?:'','location'=>$location];
}
function csrf(array $page): string { check((bool)preg_match('/name="csrf" value="([a-f0-9]+)"/',$page['text'],$m),'CSRF token missing'); return $m[1]; }
try {
    check(!query('SELECT COUNT(*) FROM admins WHERE login=?',['admin-99'])->fetchColumn(),'Temporary test account already exists');
    $password=bin2hex(random_bytes(16)); $secret='JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
    query('INSERT INTO admins(login,password,secret) VALUES(?,?,?)',['admin-99',password_hash($password,PASSWORD_ARGON2ID),seal($secret)]); $account=(int)db()->lastInsertId();
    $process=proc_open([PHP_BINARY,'-S','127.0.0.1:18881','-t',$root,__DIR__.'/cms-test-router.php'],[0=>['pipe','r'],1=>['file',shared().'/http-test.log','a'],2=>['file',shared().'/http-test.log','a']],$pipes);
    check(is_resource($process),'Cannot start loopback server'); fclose($pipes[0]);
    for($i=0;$i<30;$i++) { $socket=@fsockopen('127.0.0.1',18881,$errno,$error,.2); if($socket) { fclose($socket); break; } usleep(100000); }
    $page=request('/admin/'); check($page['status']===200,'Login page failed');
    $bad=request('/admin/',['csrf'=>csrf($page),'action'=>'login','login'=>'admin-99','password'=>'invalid','code'=>'000000']); check($bad['status']===200 && str_contains($bad['text'],'Не удалось войти'),'Wrong password was not rejected');
    $bad=request('/admin/',['csrf'=>csrf($page),'action'=>'login','login'=>'admin-99','password'=>$password,'code'=>'invalid']); check(str_contains($bad['text'],'Не удалось войти'),'Wrong TOTP was not rejected');
    $login=request('/admin/',['csrf'=>csrf($page),'action'=>'login','login'=>'admin-99','password'=>$password,'code'=>totp($secret,(int)floor(time()/30))]); check($login['status']===302,'TOTP login failed');
    $page=request('/admin/'); $token=csrf($page);
    $bad=request('/admin/',['csrf'=>'bad','action'=>'publish_changes','kind'=>'events']); check(str_contains($bad['text'],'Обновите страницу'),'CSRF not rejected');
    foreach(['poster','photo'] as $layout) {
        $saved=request('/admin/',['csrf'=>$token,'action'=>'publish_changes','kind'=>'events','layout'=>$layout,'title'=>'CMS acceptance temporary '.$layout,'city'=>'Москва','startDate'=>'2026-11-21','endDate'=>'2026-11-21','description'=>'Временная серверная проверка','image'=>'/images/112.jpg']);
        check($saved['status']===302,'Publication failed'); parse_str(parse_url($saved['location'],PHP_URL_QUERY),$params); $ids[]=(int)$params['edit'];
    }
    check(count(snapshot()['events'])===count($baseline['events'])+2,'Same-day events missing');
    $id=$ids[0];
    $changed=request('/admin/',['csrf'=>$token,'action'=>'publish_changes','id'=>$id,'version'=>'1','layout'=>'poster','title'=>'CMS acceptance updated','city'=>'Москва','startDate'=>'2026-11-21','description'=>'Updated']); check($changed['status']===302,'Edit failed');
    $stale=request('/admin/',['csrf'=>$token,'action'=>'delete','id'=>$id,'version'=>'1','confirm_delete'=>'on']); check(str_contains($stale['text'],'Другой администратор'),'Stale editor not rejected');
    $rollback=request('/admin/',['csrf'=>$token,'action'=>'rollback','id'=>$id,'version'=>'2']); check($rollback['status']===302,'Rollback failed');
    check(json_decode(query('SELECT draft FROM materials WHERE id=?',[$id])->fetchColumn(),true)['title']==='CMS acceptance temporary poster','Wrong rollback content');
    $deleted=request('/admin/',['csrf'=>$token,'action'=>'delete','id'=>$id,'version'=>'3','confirm_delete'=>'on']); check($deleted['status']===302,'Delete failed');
    $restore=request('/admin/',['csrf'=>$token,'action'=>'restore_deleted','id'=>$id,'version'=>'4']); check($restore['status']===302,'Restore failed');
    // A file with a .jpg name but executable content must not be decoded or stored.
    $boundary='cms-test-'.bin2hex(random_bytes(8)); $raw='';
    foreach(['csrf'=>$token,'action'=>'upload'] as $name=>$value) $raw.="--$boundary\r\nContent-Disposition: form-data; name=\"$name\"\r\n\r\n$value\r\n";
    $raw.="--$boundary\r\nContent-Disposition: form-data; name=\"image\"; filename=\"invalid.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n<?php echo 123; ?>\r\n--$boundary--\r\n";
    $images=(int)query('SELECT COUNT(*) FROM images')->fetchColumn();
    request('/admin/',null,$raw,'multipart/form-data; boundary='.$boundary);
    check((int)query('SELECT COUNT(*) FROM images')->fetchColumn()===$images,'Invalid upload was accepted');
    query('UPDATE admins SET active=0 WHERE id=?',[$account]);
    $revoked=request('/admin/'); check(str_contains($revoked['text'],'autocomplete="username"'),'Revoked account retained access');
    echo "PASS: login, wrong password/TOTP, CSRF, poster/photo same day, publish/edit, stale version, rollback, delete/restore, invalid image, account revocation.\n";
} finally {
    if(is_resource($process)) { proc_terminate($process); proc_close($process); }
    foreach($ids as $id) { query('DELETE FROM revisions WHERE material_id=?',[$id]); query('DELETE FROM audit WHERE material_id=?',[$id]); query('DELETE FROM materials WHERE id=?',[$id]); }
    if($account) { query('DELETE FROM audit WHERE admin_id=?',[$account]); query('DELETE FROM admins WHERE id=?',[$account]); }
    publishSnapshot();
    check(snapshot()===$baseline,'Test cleanup changed original content');
    echo "Original public content preserved; temporary test records/account removed.\n";
}
