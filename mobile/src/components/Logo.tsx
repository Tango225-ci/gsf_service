import { Image } from 'expo-image';

/** Logo GSF (rouge sur fond transparent, rapport 230 × 70). */
export function Logo({ largeur = 200 }: { largeur?: number }) {
  return (
    <Image
      source={require('@/assets/images/logo-gsf.png')}
      style={{ width: largeur, height: (largeur * 70) / 230 }}
      contentFit="contain"
      accessibilityLabel="GSF, Géomètre Son Femme"
    />
  );
}
