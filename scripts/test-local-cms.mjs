import https from 'node:https';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const docker = (...args) => execFileSync('docker',['compose','exec','-T','web',...args],{encoding:'utf8'});
docker('php','/usr/local/bin/local-account.php');
const account=JSON.parse(docker('cat','/srv/Bagration/shared/local-access.json'));
const code=docker('php','/usr/local/bin/local-account.php').match(/Current code: (\d+)/)[1];
let cookie='';
function request(path, fields) {
  return new Promise((resolve,reject)=>{
    const body=fields?new URLSearchParams(fields).toString():'';
    const req=https.request({hostname:'localhost',port:8443,path,rejectUnauthorized:false,method:fields?'POST':'GET',headers:{Cookie:cookie,...(fields?{'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(body)}:{})}},res=>{
      if(res.headers['set-cookie']) cookie=res.headers['set-cookie'].map(c=>c.split(';')[0]).join('; ');
      let text='';res.setEncoding('utf8');res.on('data',d=>text+=d);res.on('end',()=>resolve({status:res.statusCode,text,location:res.headers.location}));
    }); req.on('error',reject);req.end(body);
  });
}
const csrf = page => page.text.match(/name="csrf" value="([a-f0-9]+)"/)[1];
let page=await request('/admin/'); assert.equal(page.status,200);
const login=await request('/admin/',{csrf:csrf(page),action:'login',login:account.login,password:account.password,code}); assert.equal(login.status,302,'Login failed');
page=await request('/admin/?kind=events'); assert.match(page.text,/name="startDate"/);
const saved=await request('/admin/',{csrf:csrf(page),action:'save',kind:'events',title:'Локальная проверка CMS',city:'Тестовый зал',startDate:'2026-10-23',endDate:'2026-10-24',sort_order:'99'});
assert.equal(saved.status,302); const id=new URL(saved.location,'https://localhost').searchParams.get('edit'); assert.ok(id);
await request('/admin/',{csrf:csrf(page),action:'publish',id});
let snapshot=JSON.parse((await request('/content/current.json')).text);assert.ok(snapshot.events.some(e=>String(e.id)===id));
const changed=await request('/admin/',{csrf:csrf(page),action:'publish_changes',id,version:'1',kind:'events',title:'Изменено одной кнопкой',city:'Тестовый зал',startDate:'2026-10-23',endDate:'2026-10-24',sort_order:'99'});
assert.equal(changed.status,302);
snapshot=JSON.parse((await request('/content/current.json')).text);assert.equal(snapshot.events.find(e=>String(e.id)===id).title,'Изменено одной кнопкой');
const restored=await request('/admin/',{csrf:csrf(page),action:'rollback',id,version:'2'}); assert.equal(restored.status,302);
snapshot=JSON.parse((await request('/content/current.json')).text);assert.equal(snapshot.events.find(e=>String(e.id)===id).title,'Локальная проверка CMS');
await request('/admin/',{csrf:csrf(page),action:'unpublish',id});
snapshot=JSON.parse((await request('/content/current.json')).text);assert.ok(!snapshot.events.some(e=>String(e.id)===id));
const created=[];
for(const layout of ['poster','photo']) {
  const response=await request('/admin/',{csrf:csrf(page),action:'publish_changes',kind:'events',layout,title:'Проверка: '+layout,city:'Москва',startDate:'2026-10-23',endDate:'2026-10-23',description:'Описание события',image:'/images/112.jpg'});
  assert.equal(response.status,302); created.push(new URL(response.location,'https://localhost').searchParams.get('edit'));
}
snapshot=JSON.parse((await request('/content/current.json')).text);
assert.equal(snapshot.events.filter(e=>created.includes(String(e.id)) && e.startDate==='2026-10-23').length,2);
for(const [index,eventId] of created.entries()) {
  assert.equal(snapshot.events.find(e=>String(e.id)===eventId).layout,index===0?'poster':'photo');
  const removed=await request('/admin/',{csrf:csrf(page),action:'delete',id:eventId,version:'1',confirm_delete:'on'});assert.equal(removed.status,302);
  const current=JSON.parse((await request('/content/current.json')).text); assert.ok(!current.events.some(e=>String(e.id)===eventId));
  const trash=await request('/admin/?trash=1&edit='+eventId); assert.match(trash.text,/Восстановить из корзины/);
  const restored=await request('/admin/',{csrf:csrf(page),action:'restore_deleted',id:eventId,version:'2'});assert.equal(restored.status,302);
  assert.match((await request('/admin/?edit='+eventId)).text,/name="layout"/);
}
await request('/admin/',{csrf:csrf(page),action:'logout'});
page=await request('/admin/');assert.match(page.text,/autocomplete="username"/);
for(const path of ['/admin/runtime.php','/admin/seed.json','/preview/runtime.php']) assert.equal((await request(path)).status,403,path);
console.log('PASS: login, publication, rollback, poster/photo on same day, deletion, trash restoration, static JSON, logout, protected files.');
