module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'import',
    'react',
    'babel',
    'prettier',
  ],
  rules: {
    'import/extensions': ['error', 'never', { css: 'always', json: 'always' }],
    'no-console': 'error',
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    'no-restricted-imports': ['warn', 'prop-types'],
    'import/prefer-default-export': 0,
    'react/jsx-uses-vars': 1,
    'react/jsx-uses-react': 1,
    'react/react-in-jsx-scope': 1,
    'object-curly-spacing': ['error', 'always'],
    'react/jsx-curly-brace-presence': [1, 'never'],
    semi: ['error', 'never'],
    'space-before-blocks': 2,
    'max-params': ['error', 4],
    curly: 'error',
  },
  env: {
    browser: true,
    node: true,
  },
}
