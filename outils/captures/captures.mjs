// Captures d'écran de l'app (version web, taille iPhone) pour validation.
// Usage : node captures.mjs <dossier de sortie>   (le serveur web Expo doit tourner sur le port 8094)
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const sortie = process.argv[2] ?? 'images';
mkdirSync(sortie, { recursive: true });
const BASE = 'http://localhost:8094';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const navigateur = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const page = await navigateur.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const capturer = async (nom, pleinePage = false) => {
  await pause(700);
  await page.screenshot({ path: `${sortie}/${nom}.png`, fullPage: pleinePage });
  console.log('capture', nom);
};
const cliquerTexte = async (texte) => {
  const ok = await page.evaluate((t) => {
    const el = [...document.querySelectorAll('div,span,a,button')].reverse().find((e) => e.textContent?.trim() === t && e.offsetParent !== null);
    if (!el) return false;
    el.click();
    return true;
  }, texte);
  if (!ok) throw new Error(`Texte introuvable : ${texte}`);
  await pause(500);
};
const taper = async (placeholder, texte) => {
  const champ = await page.waitForSelector(`input[placeholder="${placeholder}"]`, { timeout: 10000 });
  await champ.click({ clickCount: 3 });
  await champ.type(texte);
  await pause(300);
};

// Le premier chargement peut être long (compilation)
await page.goto(`${BASE}/connexion`, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction(() => document.body.innerText.includes('Se connecter'), { timeout: 180000 });

// 1. Connexion par téléphone (Côte d'Ivoire par défaut)
await capturer('1-connexion');

// 2. Liste des pays ouverte
await cliquerTexte("🇨🇮  Côte d'Ivoire");
await capturer('2-liste-pays');

// 3. Recherche « cana »
await taper('Rechercher un pays ou un indicatif', 'cana');
await capturer('3-recherche-pays');
await cliquerTexte('Canada');

// 4. Numéro saisi (Canada, +1)
await taper('Numéro sans l’indicatif', '514 555 0101');
await capturer('4-numero-saisi');

// 5. Numéro inconnu : invitation à créer un compte
await cliquerTexte('Recevoir un code');
await capturer('5-compte-inconnu');

// 6. Création de compte, numéro repris
await cliquerTexte('Créer mon compte');
await page.waitForFunction(() => document.body.innerText.includes('Gratuit, en une minute'), { timeout: 20000 });
await capturer('6-creation-compte');

// 7. Écran du code
await page.goto(`${BASE}/code?vers=${encodeURIComponent('+225 07 00 00 00 11')}`, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction(() => document.body.innerText.includes('Code de connexion'), { timeout: 30000 });
await page.keyboard.type('1234');
await capturer('7-code');

await navigateur.close();
