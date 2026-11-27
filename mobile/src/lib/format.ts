/** Montant en FCFA, avec espaces fines : 1 226 500 F. */
export function fcfa(montant: number, suffixe = ' F'): string {
  return `${Math.round(montant).toLocaleString('fr-FR').replace(/ | /g, ' ')}${suffixe}`;
}

/** Équivalent en euros, arrondi à l'euro (1 EUR = 655,957 FCFA). */
export function euros(montantFcfa: number): string {
  return `${Math.round(montantFcfa / 655.957).toLocaleString('fr-FR').replace(/ | /g, ' ')} €`;
}

/** Initiales d'un nom : « Yao K. » → « YK ». */
export function initiales(nom: string): string {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .map((m) => m[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}
