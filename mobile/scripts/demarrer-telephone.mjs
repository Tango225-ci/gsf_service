// Démarre Expo en annonçant au téléphone l'adresse Wi-Fi du PC
// (sinon Expo peut choisir la carte Ethernet ou VMware, injoignable depuis le téléphone).
//   npm run telephone
// Adresse imposée à la main si besoin :  $env:IP_PC="192.168.1.71"; npm run telephone
import { spawn } from 'node:child_process';
import os from 'node:os';

const candidats = Object.entries(os.networkInterfaces())
  .filter(([nom]) => /wi-?fi|wlan|wireless|sans fil/i.test(nom))
  .flatMap(([nom, adresses]) =>
    (adresses ?? [])
      .filter((a) => a.family === 'IPv4' && !a.internal && !a.address.startsWith('169.254.'))
      .map((a) => ({ nom, ip: a.address })),
  );

const ip = process.env.IP_PC || candidats[0]?.ip;
if (!ip) {
  console.error('Aucune adresse Wi-Fi trouvée : connectez le PC au même Wi-Fi que le téléphone.');
  console.error('Ou indiquez l\'adresse à la main :  $env:IP_PC="192.168.x.x"; npm run telephone');
  process.exit(1);
}

// Port 8082 par défaut : sur ce PC, le 8081 est déjà pris par l'agent McAfee (macmnsvc).
const args = process.argv.slice(2);
const iPort = args.indexOf('--port');
const port = iPort >= 0 ? args[iPort + 1] : process.env.PORT_EXPO || '8082';
if (iPort < 0) args.push('--port', port);

console.log(`\nAdresse annoncée au téléphone : ${ip}`);
console.log(`  appli : exp://${ip}:${port}`);
console.log(`  API   : http://${ip}:8000  (le serveur doit tourner : php artisan serve --host=0.0.0.0 dans le dossier server)\n`);

const enfant = spawn('npx', ['expo', 'start', ...args], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, REACT_NATIVE_PACKAGER_HOSTNAME: ip },
});
enfant.on('exit', (code) => process.exit(code ?? 0));
