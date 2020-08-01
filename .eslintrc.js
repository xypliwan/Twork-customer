module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/prettier'
    // '@vue/standard'
    // prettier
  ],
  parserOptions: {
    parser: 'babel-eslint',
    "ecmaVersion": 8
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "eqeqeq": 0,
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": true
    }],
    "no-async-promise-executor": 0,
    "no-useless-escape": 0,
    "no-sparse-arrays": 0,
    "no-self-assign": 0,
    "no-unused-expressions": 0,
    "no-duplicate-imports": 0,
    "no-unreachable": 0,
    "prettier/prettier": "off"
  }
}
