module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins:
  [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '~': './src',
        'resources': './resources',
      }
    }]
  ],
  sourceMaps: true // 어떤파일 , 라인에서 오류가 났는지 확인해주는 옵션
};
