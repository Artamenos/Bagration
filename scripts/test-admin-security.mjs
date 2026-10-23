import { execFileSync } from 'node:child_process';
const docker = args => execFileSync('docker', ['compose', ...args], {encoding:'utf8',stdio:['pipe','pipe','pipe']});
const database='bagration_admin_acceptance';
const sql = statement => docker(['exec','-T','-e','MYSQL_PWD=local-root-only','db','mysql','-uroot','-Nse',statement]);
let created=false;
try {
  if(sql(`SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME='${database}'`).trim()) throw new Error('Acceptance database already exists; refusing to overwrite');
  sql(`CREATE DATABASE ${database} CHARACTER SET utf8mb4; GRANT ALL PRIVILEGES ON ${database}.* TO 'bagration'@'%'`); created=true;
  docker(['cp','scripts/test-admin-security.php','web:/tmp/bagration-admin-security.php']);
  process.stdout.write(docker(['exec','-T','-e','BAGRATION_ACCEPTANCE=local-docker-only','web','php','-d','display_errors=stderr','-d','log_errors=0','/tmp/bagration-admin-security.php']));
} catch(error) {
  console.error(error.message);
  if(error.stdout) process.stdout.write(error.stdout.toString());
  if(error.stderr) process.stderr.write(error.stderr.toString());
  process.exitCode=1;
} finally {
  if(created) sql(`DROP DATABASE ${database}`);
}
