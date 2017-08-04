const path = require('path');


module.exports = {
  entry:'./scripts.js',

  output: {
    library: "someLibName",
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};