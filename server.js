console.log('starting dev server middleware....');
console.log(process.argv);

// @TODO:
// build it here to serve dist file

const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');

const app = express();

// ------------------------------------------------------------------- helper

const env = process.env.NODE_ENV;
const npm = process.env.npm_lifecycle_event;

// shorthand helpers from cli
const isProd = env == 'production';
const isBuild = npm.includes('build');

// ------------------------------------------------------------------- helper;

if (isProd || isBuild) {
  console.log('>>>>>>>>>>> serving from BUILT/PRODUCTION!');
  app.use(express.static('./tmp'));
} else {
  console.log('>>>>>>>>>>> serving from DEVELOPMENT!');
  const compiler = webpack(webpackConfig);
  const devMiddlewareConf = {
    quiet: false,
    noInfo: false,
    stats: {
      assets: true,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunks: true,
      chunkModules: false,
    },
    publicPath: webpackConfig.output.publicPath,
  };
  app.use(devMiddleware(compiler, devMiddlewareConf));
}

app.listen(3301, (error) => {
  console.log('listening on port 3301...');
});
