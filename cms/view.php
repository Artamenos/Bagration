<?php
if(!isset($error)) { http_response_code(404); exit; }
$_GET=array_filter($_GET,'is_string'); $_POST=array_filter($_POST,'is_string');
$flash=$_SESSION['flash']??''; unset($_SESSION['flash']);
$rows=[]; $edit=null; $kind='news'; $item=[]; $previous=false; $days=[]; $dayRows=[]; $day=date('Y-m-d');
$trash=isset($_GET['trash']);
if(!empty($admin)) {
    try {
        $rows=query('SELECT * FROM materials ORDER BY kind,sort_order,id')->fetchAll(PDO::FETCH_ASSOC);
        $rows=array_filter($rows,fn($r)=>!empty(json_decode($r['draft'],true)['_deleted'])===$trash);
        foreach($rows as $row) if((int)$row['id']===(int)($_GET['edit']??$_POST['id']??0)) $edit=$row;
        $kind=$edit['kind']??($_GET['kind']??$_POST['kind']??'news'); if(!in_array($kind,['news','events'],true)) $kind='news';
        $item=$edit?json_decode($edit['draft'],true):[];
        $days=availableDays($rows,$kind);
        $requested=$_GET['day']??$_POST['day']??'';
        if(validDate($requested)) $day=$requested;
        elseif($edit) $day=$item[$kind==='events'?'startDate':'date'];
        elseif($days) {
            $future=array_filter(array_keys($days),fn($d)=>$d>=date('Y-m-d'));
            $day=$kind==='events' && $future?min($future):array_key_first($days);
        }
        $dayRows=materialsForDay($rows,$kind,$day);
        if(!$edit && !isset($_GET['new']) && !$error && $dayRows) { $edit=$dayRows[0]; $item=json_decode($edit['draft'],true); }
        if(!$edit) $item[$kind==='events'?'startDate':'date']=$day;
        if($error && ($_POST['action']??'')==='publish_changes') $item=array_merge($item,$_POST);
        $previous=$edit && query('SELECT id FROM revisions WHERE material_id=? LIMIT 1',[$edit['id']])->fetchColumn();
    } catch(Throwable $e) { $error='Не удалось загрузить материалы. Попробуйте обновить страницу.'; $rows=[]; $dayRows=[]; }
}
function field(string $key,string $label,array $item,string $type='text',bool $required=false): void {
    echo '<label class="field"><span>'.esc($label).($required?' *':'').'</span>';
    if($type==='textarea') echo '<textarea rows="'.($key==='details'?7:3).'" name="'.esc($key).'"'.($required?' required':'').'>'.esc($item[$key]??'').'</textarea>';
    else echo '<input type="'.esc($type).'" name="'.esc($key).'" value="'.esc($item[$key]??'').'"'.($required?' required':'').'>';
    echo '</label>';
}
function adminUrl(string $kind,string $day,bool $trash=false,?int $id=null): string {
    return '?'.http_build_query(array_filter(['kind'=>$kind,'day'=>$day,'trash'=>$trash?'1':null,'edit'=>$id],fn($v)=>$v!==null));
}
?><!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Багратион — управление сайтом</title><link rel="stylesheet" href="/admin/style.css?v=3"></head><body>
<header class="topbar"><a class="brand" href="/admin/"><img src="/images/logo.png" alt=""><span>БАГРАТИОН<small>Управление сайтом</small></span></a><div class="top-actions"><a href="/" target="_blank" rel="noopener">Открыть сайт ↗</a><?php if(!empty($admin)): ?><form method="post"><?php hidden('logout'); ?><button class="quiet">Выйти</button></form><?php endif; ?></div></header>
<?php if(empty($admin)): ?>
<main class="login"><div class="eyebrow">ПАНЕЛЬ КЛУБА</div><h1>Добро пожаловать</h1><p class="muted">Войдите, чтобы обновлять новости и календарь клуба.</p>
<?php if($error): ?><p class="alert" role="alert"><?=esc($error)?></p><?php endif; ?>
<form method="post"><?php hidden('login'); ?>
<label class="field"><span>Логин</span><input name="login" required maxlength="40" autocomplete="username"></label>
<label class="field"><span>Пароль</span><input name="password" type="password" required maxlength="200" autocomplete="current-password"></label>
<label class="field"><span>Код из приложения</span><input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required autocomplete="one-time-code" placeholder="000000"></label>
<button class="primary full">Войти в панель →</button></form></main>
<?php else: ?>
<main class="workspace"><div class="page-heading"><div><div class="eyebrow">КОНТЕНТ КЛУБА</div><h1><?=$kind==='news'?'Новости':'Календарь событий'?></h1><p class="muted">Выберите дату. Меняйте порядок стрелками — он сразу обновится на сайте.</p></div><nav class="tabs"><a class="<?=$kind==='news'?'active':''?>" href="?kind=news">Новости</a><a class="<?=$kind==='events'?'active':''?>" href="?kind=events">События</a></nav></div>
<?php if($error): ?><p class="alert" role="alert"><?=esc($error)?></p><?php endif; ?>
<?php if($flash): ?><p class="success" role="status">✓ <?=esc($flash)?></p><?php endif; ?>
<div class="layout">
<?php require __DIR__.'/date-sidebar.php'; ?>
<section class="editor"><div class="editor-heading"><div><span class="eyebrow"><?=$edit?'РЕДАКТИРОВАНИЕ':'НОВЫЙ МАТЕРИАЛ'?></span><h2><?=$kind==='news'?'Новость':'Событие'?></h2></div><span class="badge"><?=$edit && $edit['published']?'● На сайте':'○ Не опубликовано'?></span></div>
<form method="post" enctype="multipart/form-data">
<?php hidden('publish_changes',(int)($edit['id']??0)); ?>
<input type="hidden" name="kind" value="<?=esc($kind)?>"><input type="hidden" name="version" value="<?=(int)($edit['version']??0)?>"><input type="hidden" name="day" value="<?=esc($day)?>">
<?php field('title',$kind==='news'?'Заголовок новости':'Название события',$item,'text',true); ?>
<?php if($kind==='news'): ?>
<div class="two-cols"><?php field('date','Дата новости',$item,'date',true); field('category','Категория',$item,'text',true); ?></div>
<?php field('description','Короткое описание для карточки',$item,'textarea',true); field('details','Полный текст новости (необязательно)',$item,'textarea'); ?>
<div class="photo-block"><div><h3>Фотография новости</h3><p class="muted">Выберите файл — он загрузится при публикации.</p><input type="file" name="photo" accept="image/jpeg,image/png,image/webp"><small>JPEG, PNG или WebP · до 8 МБ</small></div><?php if(!empty($item['image'])): ?><img src="<?=esc($item['image'])?>" alt="Текущая фотография"><?php endif; ?><input type="hidden" name="image" value="<?=esc($item['image']??'')?>"></div>
<details class="settings"><summary>Дополнительные настройки</summary>
<?php field('dateLabel','Подпись даты, например 10–20.08.2026',$item); ?>
<label class="field"><span>Положение фотографии</span><select name="imagePosition"><option value="center">По центру</option><option value="center top" <?=($item['imagePosition']??'')==='center top'?'selected':''?>>От верхнего края</option></select></label>
<?php field('detailsUrl','Ссылка кнопки (если нужна)',$item); ?>
<label class="check"><input type="checkbox" name="showDetails" <?=($item['showDetails']??true)?'checked':''?>> Показывать кнопку «Читать»</label></details>
<?php else: ?>
<?php field('city','Город или место проведения',$item,'text',true); ?>
<div class="two-cols"><?php field('startDate','Дата начала',$item,'date',true); field('endDate','Дата окончания (если несколько дней)',$item,'date'); ?></div>
<?php require __DIR__.'/event-fields.php'; ?>
<?php endif; ?>
<div class="save-bar"><input type="hidden" name="confirm_delete" value="1"><div class="buttons">
<button class="primary" type="submit" <?=$trash?'disabled':''?>>Опубликовать изменения</button>
<button class="secondary" type="submit" name="action" value="rollback" formnovalidate <?=(!$previous || $trash)?'disabled':''?>>Откатить к предыдущему сохранению</button>
<button class="secondary danger" type="submit" name="action" value="delete" formnovalidate <?=(!$edit || $trash)?'disabled':''?>>Удалить</button>
</div></div></form>
<?php if($trash) require __DIR__.'/delete-controls.php'; ?>
</section></div></main>
<?php endif; ?></body></html>
