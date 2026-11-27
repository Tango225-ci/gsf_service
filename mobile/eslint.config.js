// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // Règle prévue pour le HTML ; en React Native l'apostrophe s'affiche telle quelle (textes en français).
      'react/no-unescaped-entities': 'off',
    },
  },
]);
