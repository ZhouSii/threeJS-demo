module.exports = {
  tabWidth: 2, // tab缩进大小,默认为2
  jsxSingleQuote: true,
  jsxBracketSameLine: true,
  printWidth: 100,
  singleQuote: true, // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
  semi: false, // 使用分号, 默认true
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
  ],
  arrowParens: 'always', // always 总是有括号
  trailingComma: 'none',
}
