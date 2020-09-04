module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:compat/recommended', 'eslint-config-umi'],
  plugins: ['prettier','react'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  "parserOptions": {
    // 想使用的额外的语言特性:
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      // 启用 JSX
      "jsx": true
    },
  },
  rules: {
    //规定对象属性换行时注意统一代码风格(要么都换行，要么都不换)。第二个参数是一个对象，配置是否允许在一行代码中书写多个属性。
    "object-property-newline": ["error", { "allowMultiplePropertiesPerLine": true }],
    "no-inline-comments": 0,//禁止行内备注
    "spaced-comment": 0,//注释风格,要不要有空格什么的
    "lines-around-comment": 0,//行前/行后备注
    "no-trailing-spaces": 0,  //一行结束后面 空格
    "no-multi-spaces": 1, //多余 空格
    "no-mixed-spaces-and-tabs" : 0, // 混用tab space
    "react/no-access-state-in-setstate": 0,
    "no-plusplus": 0,
    "react/no-array-index-key": 0,
    "prefer-const":0,
    "consistent-return": 0,
    "global-require": 0 ,
    "react/destructuring-assignment": [0,'never',{
      "ignoreClassFields": true
    }],
    'prettier/prettier': ['error',{
        htmlWhitespaceSensitivity: 'ignore',
        singleQuote: true
    }],
    "prefer-destructuring": ["error", {
      "array": false,
      "object": false
    }, {
      "enforceForRenamedProperties": false
    }],
    "camelcase": 0, //强制驼峰法命名
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/no-unresolved': [1, { ignore: ['^@/', '^umi/'] }],
    "no-unused-vars": [1, {
      // 允许声明未使用变量
      "vars": "local",
      // 参数不检查
      "args": "none"
    }],
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**/**.js', '**/**.test.js'],
      },
    ],
    'import/no-cycle': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for":"off",
    'linebreak-style': 0,
  },
  "settings": {
    "import/ignore": [
      "node_modules"
    ]
  }
};
