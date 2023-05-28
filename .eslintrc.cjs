module.exports = {
  ignorePatterns: [
    'node_modules',
    'dist',
    '.github/workflows',
  ],
  plugins: ['react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};
