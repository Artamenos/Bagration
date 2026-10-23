<?php
declare(strict_types=1);
function materialOnDay(array $row,string $day): bool {
    $item=json_decode($row['draft'],true,512,JSON_THROW_ON_ERROR);
    return $row['kind']==='events' ? $day>=($item['startDate']??'') && $day<=($item['endDate']??$item['startDate']??'') : $day===($item['date']??'');
}
function materialsForDay(array $rows,string $kind,string $day): array {
    $rows=array_values(array_filter($rows,fn($r)=>$r['kind']===$kind && materialOnDay($r,$day)));
    usort($rows,function($a,$b) use($kind,$day) {
        $left=json_decode($a['draft'],true); $right=json_decode($b['draft'],true);
        $rankA=$kind==='events'?($left['dayOrder'][$day]??PHP_INT_MAX):(int)$a['sort_order'];
        $rankB=$kind==='events'?($right['dayOrder'][$day]??PHP_INT_MAX):(int)$b['sort_order'];
        return ($rankA<=>$rankB) ?: ((int)$a['sort_order']<=>(int)$b['sort_order']) ?: ((int)$a['id']<=>(int)$b['id']);
    }); return $rows;
}
function daySignature(array $rows): string { return hash('sha256',json_encode(array_map(fn($r)=>[(int)$r['id'],(int)$r['version']],$rows),JSON_THROW_ON_ERROR)); }
function retainDayOrder(array $item,array $old): array {
    unset($item['dayOrder']);
    if(isset($item['startDate'])) foreach($old['dayOrder']??[] as $day=>$position) if(validDate((string)$day) && $day>=$item['startDate'] && $day<=($item['endDate']??$item['startDate']) && is_int($position) && $position>=1 && $position<=1000) $item['dayOrder'][$day]=$position;
    return $item;
}
function moveMaterial(int $id,string $kind,string $day,string $direction,string $signature): void {
    if(!validDate($day) || !in_array($direction,['up','down'],true)) throw new RuntimeException('Выберите дату и направление');
    $all=query('SELECT * FROM materials WHERE kind=? FOR UPDATE',[$kind])->fetchAll(PDO::FETCH_ASSOC);
    $all=array_filter($all,fn($r)=>empty(json_decode($r['draft'],true)['_deleted']));
    $rows=materialsForDay($all,$kind,$day);
    if(!hash_equals(daySignature($rows),$signature)) throw new RuntimeException('Список уже изменился. Обновите страницу и повторите');
    $index=array_search($id,array_map(fn($r)=>(int)$r['id'],$rows),true);
    if($index===false) throw new RuntimeException('Материал не относится к выбранной дате');
    $target=$index+($direction==='up'?-1:1); if(!isset($rows[$target])) return;
    [$rows[$index],$rows[$target]]=[$rows[$target],$rows[$index]];
    if($kind==='news') {
        // Keep other dates in their existing carousel slots; only exchange this day's items.
        $global=array_values($all);
        usort($global,fn($a,$b)=>((int)$a['sort_order']<=>(int)$b['sort_order']) ?: ((int)$a['id']<=>(int)$b['id']));
        $next=0;
        foreach($global as $slot=>&$record) if(materialOnDay($record,$day)) $record=$rows[$next++];
        unset($record);
        foreach($global as $slot=>$record) if((int)$record['sort_order']!==$slot+1) query('UPDATE materials SET sort_order=?,version=version+1 WHERE id=?',[$slot+1,$record['id']]);
        audit('move_'.$direction,$id); return;
    }
    foreach($rows as $position=>$row) {
        $draft=json_decode($row['draft'],true); $draft['dayOrder'][$day]=$position+1;
        $published=$row['published']===null?null:json_decode($row['published'],true);
        if($published!==null && $day>=$published['startDate'] && $day<=($published['endDate']??$published['startDate'])) $published['dayOrder'][$day]=$position+1;
        query('UPDATE materials SET draft=?,published=?,version=version+1 WHERE id=?',[json_encode($draft,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),$published===null?null:json_encode($published,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),$row['id']]);
    } audit('move_'.$direction,$id);
}
function availableDays(array $rows,string $kind): array {
    $days=[];
    foreach($rows as $row) {
        if($row['kind']!==$kind) continue; $item=json_decode($row['draft'],true);
        $start=$kind==='events'?($item['startDate']??''):($item['date']??''); if(!validDate($start)) continue;
        $end=$kind==='events'?($item['endDate']??$start):$start; $date=new DateTimeImmutable($start);
        for($n=0;$n<366 && $date->format('Y-m-d')<=$end;$n++,$date=$date->modify('+1 day')) { $key=$date->format('Y-m-d'); $days[$key]=($days[$key]??0)+1; }
    }
    $kind==='news'?krsort($days):ksort($days); return $days;
}
function russianDate(string $day): string {
    $months=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']; $date=new DateTimeImmutable($day);
    return $date->format('j').' '.$months[(int)$date->format('n')-1].' '.$date->format('Y');
}
