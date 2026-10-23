<?php
declare(strict_types=1);
ini_set('display_errors','0');
require __DIR__.'/runtime.php';
header('X-Robots-Tag: noindex, nofollow'); header('Cache-Control: no-store'); header('Referrer-Policy: no-referrer'); header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; img-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'");
if(empty($_SERVER['HTTPS']) || $_SERVER['HTTPS']==='off') { http_response_code(403); exit('HTTPS required'); }
try {
    $token=(string)($_GET['token']??''); if(!preg_match('/^[a-f0-9]{64}$/',$token)) throw new RuntimeException();
    $payload=query('SELECT payload FROM previews WHERE token=? AND expires>?',[hash('sha256',$token),time()])->fetchColumn(); if(!$payload) throw new RuntimeException();
    $item=json_decode($payload,true,512,JSON_THROW_ON_ERROR);
} catch(Throwable $e) { http_response_code(404); exit('Предпросмотр недоступен или срок ссылки истёк'); }
?><!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Предпросмотр — Багратион</title><link rel="stylesheet" href="/admin/style.css"><body><main><p>Черновик · предпросмотр</p><article><h1><?=esc($item['title'])?></h1><?php if(!empty($item['image'])): ?><img src="<?=esc($item['image'])?>" alt="" width="600"><?php endif; ?><?php if(isset($item['startDate'])): ?><p><?=esc($item['city'])?></p><p><?=esc($item['startDate'])?> — <?=esc($item['endDate']??$item['startDate'])?></p><?php else: ?><p><?=esc($item['dateLabel']??$item['date']??'')?></p><?php endif; ?><p><?=nl2br(esc($item['description']??''))?></p><?php if(!empty($item['details'])): ?><p><?=nl2br(esc($item['details']))?></p><?php endif; ?></article></main></body></html>
