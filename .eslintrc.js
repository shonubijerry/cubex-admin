module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'plugin:vue/essential',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue',
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-useless-escape': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'lf',
      },
    ],
  },
}
