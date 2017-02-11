module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  'ecmaVersion': 2017,

  // http://eslint.org/docs/user-guide/configuring#specifying-parser-options
  'ecmaFeatures': {
    'jsx': true,
    'modules': true,
    'decorators': true,
    'experimentalObjectRestSpread': true,
  },
  'env': {
    'node': true,
    'browser': true,
    'es6': true,
    'worker': true,
    'serviceworker': true,
  },
}
