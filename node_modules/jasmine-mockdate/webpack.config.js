module.exports = {
  entry: './index',
  output: {
    filename: 'jasmine-mockdate.js',
    library: 'jasmineMockDate',
    libraryTarget: 'umd',
    sourcePrefmx: ''
  },
  externals: {
    'jasmine': {
      root: 'jasmine',
      commonjs2: 'jasmine',
      commonjs: 'jasmine',
      amd: 'jasmine'
    }
  }
};
