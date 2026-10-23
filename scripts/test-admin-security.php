<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli' || getenv('BAGRATION_ACCEPTANCE')!=='local-docker-only') exit('Local Docker test only');
$source='/srv/Bagration/releases/local/admin';
$local=require '/srv/Bagration/shared/config.php';
if($local['origin']!=='https://localhost:8443') exit('Local environment required');
$fixture='/tmp/bagration-acceptance-'.bin2hex(random_bytes(6));
$admin=$fixture.'/releases/test/admin';
mkdir($admin,0700,true); mkdir($fixture.'/shared',0700);
foreach(glob($source.'/*') as $file) if(is_file($file)) copy($file,$admin.'/'.basename($file));
$settings=['dsn'=>'mysql:host=db;dbname=bagration_admin_acceptance;charset=utf8mb4','user'=>'bagration','password'=>'local-database-only','key'=>bin2hex(random_bytes(32)),'origin'=>'https://localhost:8443'];
file_put_contents($fixture.'/shared/config.php',"<?php return ".var_export($settings,true).';');
require $admin.'/runtime.php'; require $admin.'/ordering.php';
$process=null; $cookie=''; $router=$fixture.'/router.php';
function check(bool $test,string $label): void { if(!$test) throw new RuntimeException($label); }
function request(string $path,?array $fields=null,array $extra=[],?string $raw=null): array {
    global $cookie;
    $method=$extra['method']??($fields!==null||$raw!==null?'POST':'GET'); unset($extra['method']);
    $headers="Cookie: $cookie\r\n";
    $headers.='Content-Type: '.($extra['Content-Type']??'application/x-www-form-urlencoded')."\r\n"; unset($extra['Content-Type']);
    foreach($extra as $key=>$value) $headers.=$key.': '.$value."\r\n";
    $context=stream_context_create(['http'=>['method'=>$method,'header'=>$headers,'content'=>$raw??($fields===null?'':http_build_query($fields)),'ignore_errors'=>true,'follow_location'=>0,'timeout'=>20]]);
    $body=file_get_contents('http://127.0.0.1:18882'.$path,false,$context); $status=0; $location='';
    foreach($http_response_header??[] as $header) {
        if(preg_match('~^HTTP/\S+ (\d+)~',$header,$m)) $status=(int)$m[1];
        if(preg_match('~^Set-Cookie: ([^;]+)~i',$header,$m)) $cookie=$m[1];
        if(str_starts_with($header,'Location: ')) $location=substr($header,10);
    }
    return ['status'=>$status,'text'=>$body?:'','location'=>$location,'headers'=>$http_response_header??[]];
}
function csrf(array $page): string { check((bool)preg_match('/name="csrf" value="([a-f0-9]+)"/',$page['text'],$m),'CSRF token missing'); return $m[1]; }
function row(int $id): array { return query('SELECT * FROM materials WHERE id=?',[$id])->fetch(PDO::FETCH_ASSOC); }
function publish(array $fields): int {
    $page=request('/admin/'); $result=request('/admin/',['csrf'=>csrf($page),'action'=>'publish_changes','kind'=>'events','title'=>'Acceptance event','city'=>'Москва','startDate'=>'2040-11-21','endDate'=>'2040-11-22','layout'=>'poster','description'=>'Plain text','image'=>'/images/112.jpg',...$fields]);
    check($result['status']===302,'Publish failed: '.strip_tags($result['text'])); parse_str(parse_url($result['location'],PHP_URL_QUERY),$query); return (int)$query['edit'];
}
function move(int $id,string $day,string $direction,?string $signature=null): array {
    $record=row($id); $rows=query('SELECT * FROM materials WHERE kind=?',[$record['kind']])->fetchAll(PDO::FETCH_ASSOC); $ordered=materialsForDay($rows,$record['kind'],$day);
    return request('/admin/',['csrf'=>csrf(request('/admin/')),'action'=>'move','id'=>$id,'version'=>$record['version'],'day'=>$day,'direction'=>$direction,'list_version'=>$signature??daySignature($ordered)]);
}
function upload(string $contents,string $name): array {
    $boundary='acceptance-'.bin2hex(random_bytes(8)); $raw='';
    foreach(['csrf'=>csrf(request('/admin/')),'action'=>'publish_changes','kind'=>'events','title'=>'Upload acceptance','city'=>'Москва','startDate'=>'2026-11-21','layout'=>'photo'] as $key=>$value) $raw.="--$boundary\r\nContent-Disposition: form-data; name=\"$key\"\r\n\r\n$value\r\n";
    $raw.="--$boundary\r\nContent-Disposition: form-data; name=\"photo\"; filename=\"$name\"\r\nContent-Type: image/jpeg\r\n\r\n$contents\r\n--$boundary--\r\n";
    return request('/admin/',null,['Content-Type'=>'multipart/form-data; boundary='.$boundary],$raw);
}
try {
    $install=proc_open([PHP_BINARY,$admin.'/cli.php','install'],[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes);
    fclose($pipes[0]); stream_get_contents($pipes[1]); fclose($pipes[1]); $error=stream_get_contents($pipes[2]); fclose($pipes[2]); check(proc_close($install)===0,'Install failed: '.$error);
    $password=bin2hex(random_bytes(16)); $secret='JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
    query('INSERT INTO admins(login,password,secret) VALUES(?,?,?)',['admin-01',password_hash($password,PASSWORD_ARGON2ID),seal($secret)]);
    $routerCode='<?php $_SERVER["HTTPS"]="on"; if(parse_url($_SERVER["REQUEST_URI"],PHP_URL_PATH)==="/admin/") { require '.var_export($admin.'/index.php',true).'; return true; } http_response_code(404);';
    file_put_contents($router,$routerCode);
    $process=proc_open([PHP_BINARY,'-S','127.0.0.1:18882',$router],[0=>['pipe','r'],1=>['file',$fixture.'/server.log','a'],2=>['file',$fixture.'/server.log','a']],$pipes); fclose($pipes[0]);
    for($i=0;$i<30;$i++) { $socket=@fsockopen('127.0.0.1',18882,$errno,$error,.2); if($socket) { fclose($socket); break; } usleep(100000); }
    $page=request('/admin/'); $token=csrf($page);
    $cookieHeaders=implode("\n",$page['headers']); check(str_contains(strtolower($cookieHeaders),'httponly') && str_contains(strtolower($cookieHeaders),'secure') && str_contains(strtolower($cookieHeaders),'samesite=strict'),'Cookie protections missing');
    check(str_contains(strtolower($cookieHeaders),'referrer-policy: same-origin'),'Browser form origin would be suppressed');
    $before=(int)query('SELECT COUNT(*) FROM materials')->fetchColumn();
    foreach(['publish_changes','move','delete','restore_deleted','rollback','preview','save','publish','unpublish','restore','upload'] as $action) {
        request('/admin/',['csrf'=>$token,'action'=>$action,'id'=>1,'version'=>1]);
        check((int)query('SELECT COUNT(*) FROM materials')->fetchColumn()===$before,'Unauthenticated mutation');
    }
    $injected=request('/admin/',['csrf'=>$token,'action'=>'login','login'=>"admin-01' OR 1=1 --",'password'=>'x','code'=>'000000']);
    check($injected['status']!==302 && !str_contains($injected['text'],'class="workspace"'),'SQL login injection bypass');
    request('/admin/',['csrf'=>$token,'action'=>'login','login'=>'admin-01','password'=>$password,'code'=>'999999']);
    check((int)query('SELECT failures FROM admins WHERE login=?',['admin-01'])->fetchColumn()===1,'Wrong TOTP bypass');
    for($i=0;$i<4;$i++) request('/admin/',['csrf'=>$token,'action'=>'login','login'=>'admin-01','password'=>'wrong','code'=>'000000']);
    check((int)query('SELECT locked_until FROM admins WHERE login=?',['admin-01'])->fetchColumn()>time(),'Account throttle failed');
    query('UPDATE admins SET locked_until=0,failures=0 WHERE login=?',['admin-01']);
    $login=request('/admin/',['csrf'=>$token,'action'=>'login','login'=>'admin-01','password'=>$password,'code'=>totp($secret,(int)floor(time()/30))],['Origin'=>'https://localhost:8443','Sec-Fetch-Site'=>'same-origin']);
    check($login['status']===302,'Valid login failed'); $authCookie=$cookie;
    $token=csrf(request('/admin/'));
    $bad=request('/admin/',['csrf'=>'wrong','action'=>'delete','id'=>1,'version'=>1,'confirm_delete'=>1]); check(str_contains($bad['text'],'Обновите страницу'),'CSRF bypass');
    $bad=request('/admin/',['csrf'=>$token,'action'=>'delete','id'=>1,'version'=>1,'confirm_delete'=>1],['Origin'=>'https://attacker.invalid']); check(str_contains($bad['text'],'другого сайта'),'Cross-origin bypass');
    $bad=request('/admin/',['csrf'=>$token,'action'=>'delete','id'=>1,'version'=>1,'confirm_delete'=>1],['Sec-Fetch-Site'=>'cross-site']); check(str_contains($bad['text'],'другого сайта'),'Fetch metadata bypass');
    $bad=request('/admin/',null,['method'=>'PUT']); check($bad['status']===405,'Unexpected HTTP method allowed');
    $bad=request('/admin/',null,[],http_build_query(['csrf'=>[$token],'action'=>'delete'])); check(!str_contains($bad['text'],'Fatal error'),'Malformed array request failed unsafely');
    $a=publish(['title'=>'First multi-day']); $b=publish(['title'=>'Second multi-day']);
    check(move($b,'2040-11-21','up')['status']===302,'Move failed');
    $all=query('SELECT * FROM materials WHERE id IN (?,?)',[$a,$b])->fetchAll(PDO::FETCH_ASSOC);
    check(array_column(materialsForDay($all,'events','2040-11-21'),'id')===[$b,$a],'Wrong order on selected day');
    check(array_column(materialsForDay($all,'events','2040-11-22'),'id')===[$a,$b],'Reorder changed another day');
    $public=snapshot()['events']; $moved=array_values(array_filter($public,fn($e)=>$e['id']===$b))[0]; check($moved['dayOrder']['2040-11-21']===1,'Order not in public JSON');
    check(move($b,'2040-11-21','down',str_repeat('0',64))['status']!==302,'Stale group signature accepted');
    $record=row($b); publish(['id'=>$b,'version'=>$record['version'],'title'=>'Updated multi-day']);
    check(json_decode(row($b)['draft'],true)['dayOrder']['2040-11-21']===1,'Editing lost daily order');
    $record=row($b); $rollback=request('/admin/',['csrf'=>$token,'action'=>'rollback','id'=>$b,'version'=>$record['version']]); check($rollback['status']===302,'Rollback failed');
    check(json_decode(row($b)['draft'],true)['dayOrder']['2040-11-21']===1,'Rollback lost daily order');
    $n1=publish(['kind'=>'news','title'=>'News first','date'=>'2040-11-21','category'=>'Test','details'=>'Text']);
    $n3=publish(['kind'=>'news','title'=>'News other date','date'=>'2040-11-22','category'=>'Test','details'=>'Text']);
    $n2=publish(['kind'=>'news','title'=>'News second','date'=>'2040-11-21','category'=>'Test','details'=>'Text']);
    $newsBefore=array_column(snapshot()['news'],'id'); $expected=$newsBefore;
    $firstSlot=array_search($n1,$expected,true); $secondSlot=array_search($n2,$expected,true);
    [$expected[$firstSlot],$expected[$secondSlot]]=[$expected[$secondSlot],$expected[$firstSlot]];
    check(move($n2,'2040-11-21','up')['status']===302,'News move failed');
    check(array_column(snapshot()['news'],'id')===$expected,'News move changed other date slots');
    check(in_array($n3,$expected,true),'News on another day was lost');
    $page=request('/admin/?kind=events&day=2040-11-21'); check(str_contains($page['text'],'ПОРЯДОК НА САЙТЕ') && !str_contains($page['text'],'name="sort_order"'),'Date UI missing');
    $xss='<script>alert(1)</script>'; $x=publish(['title'=>$xss,'description'=>"' OR 1=1; DROP TABLE admins; --"]);
    $page=request('/admin/?edit='.$x); check(str_contains($page['text'],'&lt;script&gt;alert(1)&lt;/script&gt;') && !str_contains($page['text'],$xss),'Stored XSS not escaped');
    check((int)query('SELECT COUNT(*) FROM admins')->fetchColumn()===1,'SQL content altered schema');
    $images=(int)query('SELECT COUNT(*) FROM images')->fetchColumn();
    foreach([['<?php echo 1; ?>','bad.jpg'],['<svg onload="alert(1)"></svg>','bad.svg'],[str_repeat('a',8*1024*1024+1),'huge.jpg']] as [$bytes,$filename]) { check(upload($bytes,$filename)['status']!==302,'Dangerous upload accepted'); }
    check((int)query('SELECT COUNT(*) FROM images')->fetchColumn()===$images,'Rejected upload registered');
    $image=imagecreatetruecolor(8,8); ob_start(); imagepng($image); $png=ob_get_clean(); imagedestroy($image);
    check(upload($png,'valid.png')['status']===302,'Valid image rejected');
    $path=query('SELECT path FROM images ORDER BY created_at DESC LIMIT 1')->fetchColumn(); check(getimagesize(shared().$path)[2]===IMAGETYPE_JPEG,'Image not reencoded');
    $record=row($a); request('/admin/',['csrf'=>$token,'action'=>'delete','id'=>$a,'version'=>$record['version'],'confirm_delete'=>1]);
    check(query('SELECT published FROM materials WHERE id=?',[$a])->fetchColumn()===null,'Delete failed');
    $record=row($a); check(request('/admin/',['csrf'=>$token,'action'=>'restore_deleted','id'=>$a,'version'=>$record['version']])['status']===302,'Restore failed');
    // TOTP replay in a fresh session is rejected, while the established session stays valid.
    $cookie=''; $fresh=request('/admin/');
    check(request('/admin/',['csrf'=>csrf($fresh),'action'=>'login','login'=>'admin-01','password'=>$password,'code'=>totp($secret,(int)floor(time()/30))])['status']!==302,'TOTP replay accepted');
    $cookie=$authCookie; query('UPDATE admins SET active=0 WHERE login=?',['admin-01']);
    check(!str_contains(request('/admin/')['text'],'class="workspace"'),'Revoked account still has access');
    query('UPDATE admins SET active=1,last_totp=0,failures=0,locked_until=0 WHERE login=?',['admin-01']);
    $fresh=request('/admin/');
    check(request('/admin/',['csrf'=>csrf($fresh),'action'=>'login','login'=>'admin-01','password'=>$password,'code'=>totp($secret,(int)floor(time()/30))])['status']===302,'Re-login failed');
    $oldCookie=$cookie; $fresh=request('/admin/');
    check(request('/admin/',['csrf'=>csrf($fresh),'action'=>'logout'])['status']===302,'Logout failed');
    $cookie=$oldCookie; check(!str_contains(request('/admin/')['text'],'class="workspace"'),'Logout session remained usable');
    $bucket=hash_hmac('sha256','global-login',config()['key']);
    query('INSERT INTO login_throttle(bucket,attempts,expires) VALUES(?,30,?) ON DUPLICATE KEY UPDATE attempts=30,expires=?',[$bucket,time()+300,time()+300]);
    $fresh=request('/admin/');
    check(str_contains(request('/admin/',['csrf'=>csrf($fresh),'action'=>'login','login'=>'admin-01','password'=>$password,'code'=>'000000'])['text'],'Слишком много попыток'),'Global login throttle failed');
    foreach(['/admin/runtime.php','/admin/ordering.php','/admin/date-sidebar.php','/admin/cli.php','/admin/schema.sql','/admin/seed.json'] as $path) {
        $context=stream_context_create(['ssl'=>['verify_peer'=>false,'verify_peer_name'=>false],'http'=>['ignore_errors'=>true,'timeout'=>10]]);
        file_get_contents('https://127.0.0.1'.$path,false,$context);
        check(str_contains($http_response_header[0],'403'),'Apache exposed '.$path);
    }
    echo "PASS: date-based UI, independent daily ordering, public order, stale forms, editing/rollback preservation.\n";
    echo "PASS: anonymous actions, SQL login/content injection, stored XSS, CSRF, cross-origin, methods, malformed input, account lock, TOTP replay, revoked session, dangerous/oversize uploads, image reencoding, Apache protected files.\n";
} finally {
    if(is_resource($process)) { proc_terminate($process); proc_close($process); }
    if(str_starts_with($fixture,'/tmp/bagration-acceptance-') && !is_link($fixture)) {
        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($fixture,FilesystemIterator::SKIP_DOTS),RecursiveIteratorIterator::CHILD_FIRST) as $file) $file->isDir()?rmdir($file->getPathname()):unlink($file->getPathname());
        rmdir($fixture);
    }
}
