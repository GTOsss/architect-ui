const tsConfig = require('./tsconfig.json');
const tsPaths = Object.keys(tsConfig.compilerOptions.paths);

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
    'prettier',
    'plugin:import/typescript',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  rules: {
    'import/no-unresolved': [
      'error',
      {
        ignore: tsPaths,
      },
    ],
    '@typescript-eslint/lines-between-class-members': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'object-curly-newline': 'off',
    'arrow-body-style': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'import/no-extraneous-dependencies': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'no-empty-pattern': 'off',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-useless-computed-key': 'off',
    'no-plusplus': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'react/button-has-type': 'off',
    'import/no-named-as-default': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
  },
};
