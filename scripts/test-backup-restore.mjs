// Restore a downloaded Timeweb SQL backup only into a disposable local Docker DB.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const directory=process.argv[2]??'deployment-bundle/release-backup';
const dump=readFileSync(`${directory}/database.sql`);
const manifest=JSON.parse(readFileSync(`${directory}/manifest.json`,'utf8'));
assert.equal(createHash('sha256').update(dump).digest('hex'),manifest.files['database.sql'],'SQL checksum mismatch');
const database='bagration_restore_acceptance';
const docker=args=>execFileSync('docker',['compose',...args],{encoding:'utf8',maxBuffer:20*1024*1024});
const sql=statement=>docker(['exec','-T','-e','MYSQL_PWD=local-root-only','db','mysql','-uroot','-Nse',statement]);
let created=false;
try {
  assert.equal(sql(`SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME='${database}'`).trim(),'','Restore database already exists');
  sql(`CREATE DATABASE ${database} CHARACTER SET utf8mb4`); created=true;
  execFileSync('docker',['compose','exec','-T','-e','MYSQL_PWD=local-root-only','db','mysql','-uroot',database],{input:dump,stdio:['pipe','pipe','pipe']});
  const counts=Object.fromEntries(sql(`SELECT kind,COUNT(*) FROM ${database}.materials WHERE published IS NOT NULL GROUP BY kind`).trim().split('\n').map(line=>{const [kind,count]=line.split('\t');return [kind,Number(count)];}));
  assert.equal(counts.news,manifest.news); assert.equal(counts.events,manifest.events);
  assert.ok(Number(sql(`SELECT COUNT(*) FROM ${database}.admins WHERE active=1`).trim())>=1);
  assert.ok(Number(sql(`SELECT COUNT(*) FROM ${database}.materials WHERE kind='events' AND JSON_UNQUOTE(JSON_EXTRACT(published,'$.startDate'))='2026-11-21' AND JSON_UNQUOTE(JSON_EXTRACT(published,'$.image')) LIKE '/media/%'`).trim())>=1);
  console.log(`PASS: backup checksum and restore into disposable Docker DB; ${counts.news} news, ${counts.events} events, production account and November poster record preserved.`);
} finally { if(created) sql(`DROP DATABASE ${database}`); }
