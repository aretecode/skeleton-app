const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// our babel loader as a string
const babelLoaderBuilder = require('babel-loader-builder');
const loader = babelLoaderBuilder({
  asObject: true,
  plugins: [
    'babel-plugin-syntax-jsx',
    ['babel-plugin-inferno', { imports: true }],
  ],
});

console.log(loader);

// environment shorthand helpers and logging
const env = process.env.NODE_ENV;
const npm = process.env.npm_lifecycle_event;
console.log('NPM LIFECYCLE EVENT: ', npm);
console.log('NODE_ENV: ', env);

// resolve paths
const src = relativePath => path.resolve(__dirname, relativePath);

// we want to output to the dist file when we build for production
// since the server checks this
// and serves it if it is available
const outputPath = (npm.includes('build')) ? src('./dist/static') : src('./tmp');

// alias all of these
// so we can use relative paths
const alias = {
  magic: src('./src/magic.js'),
};

// for define everywhere
function noop() { /* noop */ }

const config = {
  // is default
  target: 'web',

  // most expensive and best sourcemap
  devtool: '#source-map',

  // src index is where we start
  entry: [
    'babel-polyfill',
    './src',
  ],

  // load all the js files with babel
  // and all the css with style loader
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: 'babel-loader',
        include: src('./src/'),
        exclude: /node_modules/,
        query: loader,
      },
      {
        test: /\.json/,
        loader: 'json-loader',
      },
    ],
  },

  // where our files end up
  output: {
    // files go into here
    path: outputPath,

    // files are accessible relatively with this path
    publicPath: '/',

    // name of file and sourcemap
    filename: 'index.js', // '[file].js'
    sourceMapFilename: '[file].map',
  },
  resolve: {
    alias,
  },
  plugins: [
    // https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
    // ensures build does not halt
    new webpack.NoEmitOnErrorsPlugin(),

    // Generates default index.html based on the template
    // or makes one and imports the entry point
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),

    // `_noop` is available everywhere
    new webpack.DefinePlugin({ _noop: noop }),
  ],
};

// -------------
// BUILD
// -------------
if (npm.includes('build')) {
  // ensure node_env === production in our src
  const prod = new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') });

  // uglify our built file
  const uglify = new webpack.optimize.UglifyJsPlugin({
    report: 'gzip',
    sourceMap: true,
    sourceMaps: true,
    compress: true,
    minimize: true,
    output: {
      comments: false,
      screw_ie8: true,
    },
  });

  // clean the old files from the dist folder
  // add our production plugin first
  // and uglify at the end
  config.plugins.push(prod);
  config.plugins.push(uglify);

  // ignore nodejs stuff
  // should not really be needed
  config.externals = {
    isexe: '{}',
    Buffer: '{}',
    fs: '{}',
    path: '{}',
    tls: '{}',
    net: '{}',
  };

  console.log('is build');
}

console.log(config);

module.exports = config;
