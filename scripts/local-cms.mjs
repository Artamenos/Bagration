import { spawn, spawnSync } from 'node:child_process';
const check = spawnSync('docker', ['compose', 'up', '-d', '--build'], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);
console.log('Site: https://localhost:8443 · Admin: https://localhost:8443/admin/');
console.log('Local certificate is self-signed. Accept it only for localhost.');
console.log('Credentials: npm run local:account');
const next = spawn(process.execPath, ['node_modules/next/dist/bin/next','dev','--hostname','0.0.0.0','--port','3000'], { stdio:'inherit' });
next.on('exit', code => process.exit(code ?? 0));
