module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'alloy',
    'alloy/vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off'
  },
  globals: {
      // 您的全局变量（设置为 false 表示它不允许被重新赋值）
      // Your global variables (setting to false means it's not allowed to be reassigned)
      //
      // myGlobal: false
  },
  rules: {
      // 自定义您的规则
      // Customize your rules
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
