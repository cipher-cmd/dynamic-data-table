import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.url, // Change to 'import.meta.url' if you're using modern JS module syntax
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      // Add more rules to disable as needed:
      '@typescript-eslint/no-unused-vars': 'off',
      // You can add more rules or override existing ones as per your needs
    },
  }),
];

export default eslintConfig;
