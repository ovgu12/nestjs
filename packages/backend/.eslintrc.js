module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  extends: [
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
};
