module.exports = {
  ignorePatterns: [
    'node_modules',
    'dist',
    '.github/workflows',
    '.eslintrc.cjs',
  ],
  plugins: ['react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};
