module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  globals: {
    // Ramda
    R: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['error', 4, {
      'VariableDeclarator': {
        'var': 1,
        'let': 1,
        'const': 1
      }
    }],
    'semi': 'error',
    'quotes': ['error', 'single'],
    'eqeqeq': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', {'after': true}],
    'space-infix-ops': 'error',
    'array-bracket-newline': ['error', {'multiline': true, 'minItems': 3}],
    'array-element-newline': ['error', {'multiline': true, 'minItems': 3}],
    'object-property-newline': 'error',
    'object-curly-newline': ['error', {
      'multiline': true,
      'minProperties': 3
    }],
    'object-curly-spacing': ['error', 'always'],
    'key-spacing': ['error', {'beforeColon': false}],
    'space-before-function-paren': ['error', 'never'],
    'operator-linebreak': ['error', 'before'],
    'brace-style': 'error',
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/html-closing-bracket-newline': ['error', {'multiline': 'never'}],
    'vue/html-indent': ['error', 4],
    'vue/html-self-closing': 'error',
    'vue/max-attributes-per-line': ['error', {
          'singleline': 2,
          'multiline': {
            'max': 1,
            'allowFirstLine': true
          }
      }],
    'vue/mustache-interpolation-spacing': 'error',
    'vue/name-property-casing': 'error',
    'vue/this-in-template': 'error',
    'vue/singleline-html-element-content-newline': 'error',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
