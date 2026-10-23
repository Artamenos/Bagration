<?php if(empty($admin)) { http_response_code(404); exit; }
$dateKeys=array_keys($days); $currentIndex=array_search($day,$dateKeys,true);
$months=[]; foreach($days as $key=>$count) $months[substr($key,0,7)][$key]=$count;
$monthNames=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
?>
<aside class="materials date-materials">
<div class="date-nav-heading"><span class="eyebrow">ПО ДАТАМ</span><a href="<?=esc(adminUrl($kind,$day,!$trash))?>"><?=$trash?'← Все материалы':'Корзина'?></a></div>
<form method="get" class="date-picker"><input type="hidden" name="kind" value="<?=esc($kind)?>"><?php if($trash): ?><input type="hidden" name="trash" value="1"><?php endif; ?><label for="chosen-day">Перейти к дате</label><div><input id="chosen-day" type="date" name="day" value="<?=esc($day)?>" required><button type="submit" class="secondary">Открыть</button></div></form>
<nav class="date-months" aria-label="Даты материалов">
<?php foreach($months as $month=>$monthDays): ?><details class="date-month" <?=substr($day,0,7)===$month?'open':''?>>
<summary><?=esc(mb_convert_case($monthNames[(int)substr($month,5,2)-1],MB_CASE_TITLE,'UTF-8').' '.substr($month,0,4))?></summary><div class="date-grid">
<?php foreach($monthDays as $key=>$count): ?><a class="date-chip <?=$key===$day?'active':''?>" href="<?=esc(adminUrl($kind,$key,$trash))?>" <?=$key===$day?'aria-current="date"':''?> aria-label="<?=esc(russianDate($key).': '.$count.' материалов')?>"><strong><?=(int)substr($key,8,2)?></strong><small><?=$count?></small></a><?php endforeach; ?></div></details><?php endforeach; ?>
</nav>
<div class="day-heading"><div><span class="eyebrow"><?=$trash?'КОРЗИНА':'ПОРЯДОК НА САЙТЕ'?></span><h3><?=esc(russianDate($day))?></h3></div><div class="day-arrows">
<?php foreach([-1=>'←',1=>'→'] as $step=>$symbol): $target=$currentIndex===false?null:($dateKeys[$currentIndex+$step]??null); ?>
<?php if($target): ?><a href="<?=esc(adminUrl($kind,$target,$trash))?>" aria-label="<?=$step<0?'Предыдущая дата':'Следующая дата'?>"><?=$symbol?></a><?php else: ?><span aria-hidden="true"><?=$symbol?></span><?php endif; ?><?php endforeach; ?></div></div>
<?php if(!$trash): ?><a class="new-item" href="<?=esc(adminUrl($kind,$day))?>&amp;new=1">＋ <?=$kind==='news'?'Добавить новость':'Добавить событие'?></a><?php endif; ?>
<?php if(!$dayRows): ?><p class="empty-day">На эту дату <?=$trash?'нет удалённых материалов':'пока ничего нет'?>.</p><?php endif; ?>
<ol class="day-materials">
<?php foreach($dayRows as $position=>$row): $data=json_decode($row['draft'],true); ?>
<li class="day-material <?=($edit && (int)$edit['id']===(int)$row['id'])?'selected':''?>">
<a class="day-material-link" href="<?=esc(adminUrl($kind,$day,$trash,(int)$row['id']))?>"><span class="position"><?=$position+1?></span><span class="day-material-copy"><strong><?=esc($data['title'])?></strong><small><?=$trash?'В корзине':($row['published']?'● На сайте':'○ Не опубликовано')?><?php if($kind==='events' && ($data['endDate']??$data['startDate'])!==$data['startDate']): ?> · <?=esc(substr($data['startDate'],8,2).'.'.substr($data['startDate'],5,2).'–'.substr($data['endDate'],8,2).'.'.substr($data['endDate'],5,2))?><?php endif; ?></small></span></a>
<?php if(!$trash): ?><form method="post" class="reorder-form"><?php hidden('move',(int)$row['id']); ?><input type="hidden" name="kind" value="<?=esc($kind)?>"><input type="hidden" name="day" value="<?=esc($day)?>"><input type="hidden" name="version" value="<?=(int)$row['version']?>"><input type="hidden" name="list_version" value="<?=esc(daySignature($dayRows))?>"><button name="direction" value="up" aria-label="<?=esc('Поднять: '.$data['title'])?>" <?=$position===0?'disabled':''?>>↑</button><button name="direction" value="down" aria-label="<?=esc('Опустить: '.$data['title'])?>" <?=$position===count($dayRows)-1?'disabled':''?>>↓</button></form><?php endif; ?>
</li><?php endforeach; ?></ol>
<?php if($kind==='events' && count($dayRows)>1): ?><p class="order-caption">Стрелки меняют порядок только на выбранную дату. В другие дни он останется прежним.</p><?php endif; ?>
</aside>
