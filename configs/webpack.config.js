/* eslint-disable @typescript-eslint/no-var-requires */
const { HashedModuleIdsPlugin, ProvidePlugin, ContextReplacementPlugin } = require('webpack');
const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DartSASS = require('sass');
const fibers = require('fibers');
const WrapperPlugin = require('wrapper-webpack-plugin');
const DoIUse = require('doiuse');
const PostcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const Autoprefixer = require('autoprefixer');
const PostCSSPresetEnv = require('postcss-preset-env');
const PostCSSNormalize = require('postcss-normalize');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const WebpackImagesResizer = require('webpack-images-resizer');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const PATHS = {
  src_absolute: path.resolve(__dirname, '../app/src/'),
  dist_absolute: path.resolve(__dirname, '../app/dist/'),
};

// FIXME: change it depending on your design template for proper scaling images
const designWidth = 1440;

const redefinitionLevels = [
  'layouts',
  'components/library.blocks',
  'components/common.blocks',
  'components/thematic/main-theme.blocks',
  'components/experimental/experiment-1.blocks',
];
const componentGroups = ['basic', 'containers', 'primitives', 'specific'];

const sharedAliases = {
  '@layouts': path.resolve(PATHS.src_absolute, './layouts/'),
  '@library.blocks': path.resolve(PATHS.src_absolute, './components/library.blocks/'),
  '@common.blocks': path.resolve(PATHS.src_absolute, './components/common.blocks/'),
  '@thematic': path.resolve(PATHS.src_absolute, './components/thematic/'),
  '@experiments': path.resolve(PATHS.src_absolute, './components/experimental/'),
  '@assets': path.resolve(PATHS.src_absolute, './assets/'),
  '@utils': path.resolve(PATHS.src_absolute, './utils/'),
};

/**
 * Useful tool for creating name of files with hash
 * @param { string } name - what should be before hash
 * @param { string } ext - extension of output bundle files such as js/webp/png
 * @returns { string } - hashed name in production mode and nohashed in another case
 */
const hashedFileName = (name, ext) => (isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`);

/**
 * loop pages folder and create stuff depending on names of pages.
 */
class ResultOfTemplatesProcessing {
  constructor() {
    const foldersOfPages = fs.readdirSync(path.resolve(PATHS.src_absolute, './pages/'));

    // get all pug templates from each page folder
    const namesOfTemplates = [].concat(
      ...foldersOfPages.map((folder) =>
        fs
          .readdirSync(`${path.resolve(PATHS.src_absolute, './pages/')}\\${folder}\\`)
          .filter((filename) => filename.endsWith(`.pug`))
      )
    );

    this.entries = {};
    this.HTMLWebpackPlugins = [];
    namesOfTemplates.forEach((nameOfTemplate) => {
      const shortNameOfTemplate = nameOfTemplate.replace(/\.pug/, '');

      this.entries[shortNameOfTemplate] = [
        '@babel/polyfill',
        './utils/global/global.decl.ts',
        `./pages/${shortNameOfTemplate}/${shortNameOfTemplate}.ts`,
        './components/thematic/main-theme.blocks/main-theme.scss',
      ];

      this.HTMLWebpackPlugins.push(
        new HTMLWebpackPlugin({
          template: `!!pug-loader!app/src/pages/${shortNameOfTemplate}/${nameOfTemplate}`,
          filename: `./${shortNameOfTemplate}.html`,

          // see ~@layouts/basic/main-layout/main-layout.pug
          inject: false,
          chunks: [shortNameOfTemplate],
        })
      );
    });
  }
}
const resultOfTemplatesProcessing = new ResultOfTemplatesProcessing();

/**
 * Get all inner files in directory
 * @param { string } dir path to dir
 * @param { string[] } excludedExt extensions to exclude
 * @param { string[] } _files private param of files path for recursion
 * @return { string[] } array of files' paths
 */
const getFilesDeep = (dir, excludedExt, _files) => {
  // eslint-disable-next-line no-param-reassign
  _files = _files || [];
  const files = fs.readdirSync(dir);

  files.forEach((val, i) => {
    const name = path.resolve(dir, files[i]);

    if (excludedExt.includes(name.substring(name.lastIndexOf('.') + 1, name.length) || name))
      return;

    if (fs.statSync(name).isDirectory()) {
      getFilesDeep(name, excludedExt, _files);
    } else {
      _files.push(name);
    }
  });

  return _files;
};

/**
 * Map list for append suffix to each element
 * @param { string[] } list absolute paths of images
 * @param { string } suffix suffix of files in list to append
 * @param { string } base - path to base src folder when located folder of images
 * @returns { {src:string,dest:String}[] } WebpackImagesResizer 'list' option
 */
const listOfSourceImagesMapping = (list, suffix, base = PATHS.src_absolute) =>
  list.map((filePath) => {
    const relativeFromDistFullPath = filePath.slice(base.length);
    const [relativeFromDistPath, fileExt] = relativeFromDistFullPath.split('.');

    return {
      src: filePath,
      dest: `${relativeFromDistPath}-${suffix}.${fileExt}`,
    };
  });

let listOfSourceImages320 = getFilesDeep(path.resolve(PATHS.src_absolute, './assets/pictures'), [
  'svg',
]);
const listOfSourceImages640 = listOfSourceImagesMapping(listOfSourceImages320, '640');
const listOfSourceImages960 = listOfSourceImagesMapping(listOfSourceImages320, '960');
const listOfSourceImages1920 = listOfSourceImagesMapping(listOfSourceImages320, '1920');
listOfSourceImages320 = listOfSourceImagesMapping(listOfSourceImages320, '320');

/**
 * HTMLWebpackPlugin - create html of pages with plug in scripts.
 * MiniCssExtractPlugin - extract css into separate files.
 * WrapperPlugin - wrap output css depending on RegExp.
 * ProvidePlugin - Automatically load modules instead of having to import or require them everywhere.
 * CopyWebpackPlugin - copy ico files
 * ImageMinimizerPlugin - Plugin and Loader for webpack to optimize (compress) all images. Make sure ImageMinimizerPlugin place after any plugins that add images or other assets which you want to optimized.
 * WebpackImagesResizer - resizes images.
 * CircularDependencyPlugin - scan bundles to alert about circular dependencies.
 * DuplicatesPlugin - scan bundles to alert about duplicate resources from node_modules.
 * UnusedFilesWebpackPlugin - scan bundles to alert about UnusedFiles.
 * HashedModuleIdsPlugin - replace webpack number links to character links.
 * ContextReplacementPlugin - exclude unused locales from moment.js
 * CleanWebpackPlugin - clean dist folder before each use.
 */
const webpackPlugins = () => {
  const plugins = [
    ...resultOfTemplatesProcessing.HTMLWebpackPlugins,
    new MiniCssExtractPlugin({
      filename: hashedFileName(isDev ? 'styles/[name]/[name]' : 'styles/[id]/style', 'css'),
      ignoreOrder: true,
    }),
    new WrapperPlugin({
      test: /.*thematic.*\.css$/,
      header: '@media print, screen and (color) {',
      footer: '}',
    }),

    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),

    // copy ico
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(PATHS.src_absolute, './assets/ico/'),
          to: path.resolve(PATHS.dist_absolute, './assets/ico/'),
        },
      ],
    }),
  ];

  if (process.env.ImagesResizer === 'true') {
    plugins.push(
      // eslint-disable-next-line lines-around-comment
      // FIXME: this plugin keeps compilation from end, doesn't know why
      new WebpackImagesResizer(listOfSourceImages320, {
        // 4:3 - QVGA
        width: designWidth > 320 ? `${(320 / designWidth) * 100}%` : '100%',
      }),
      new WebpackImagesResizer(listOfSourceImages640, {
        // 16:9 - nHD
        width: designWidth > 640 ? `${(640 / designWidth) * 100}%` : '100%',
      }),
      new WebpackImagesResizer(listOfSourceImages960, {
        // 16:9 - qHD
        width: designWidth > 960 ? `${(960 / designWidth) * 100}%` : '100%',
      }),
      new WebpackImagesResizer(listOfSourceImages1920, {
        // 16:9 - Full HD
        width: designWidth > 1920 ? `${(1920 / designWidth) * 100}%` : '100%',
      })
    );
  }

  plugins.push(
    // eslint-disable-next-line lines-around-comment
    // images are converted to WEBP
    new ImageMinimizerPlugin({
      // Enable file caching and set path to cache directory
      cache: './app/cache/webpack__ImageMinimizerPlugin',

      filename: '[path][name].webp',
      include: /pictures/,
      minimizerOptions: {
        // Lossless optimization with custom option
        plugins: [
          [
            'imagemin-webp',
            {
              /*
               * preset: default //default, photo, picture, drawing, icon and text
               * lossless: true,
               */
              // pre compression with lossless mode on
              nearLossless: 0,
            },
          ],
        ],
      },
    }),

    // original images will compressed lossless
    new ImageMinimizerPlugin({
      // Enable file caching and set path to cache directory
      cache: './app/cache/webpack__ImageMinimizerPlugin',
      include: /pictures/,
      minimizerOptions: {
        // Lossless optimization with custom option
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    })
  );

  if (process.env.MEASURE === 'true') {
    // writes data in stats.json as plain text, shouldn't be in dev mod)
    plugins.push(new DuplicatesPlugin());
  }

  plugins.push(
    new CircularDependencyPlugin(),
    new UnusedFilesWebpackPlugin({
      patterns: ['**/*.scss', '**/*.ts'],
      globOptions: { ignore: ['node_modules/**/*', 'utils/**/*', '**/*.d.ts'] },
    }),
    new HashedModuleIdsPlugin({
      hashFunction: 'md4',
      hashDigest: 'base64',
      hashDigestLength: 8,
    }),
    new ContextReplacementPlugin(/moment[/\\]locale$/, /es-us|ru/),
    new CleanWebpackPlugin()
  );

  return plugins;
};

/**
 * Loaders contraction for templates.
 * @param { string[] } includedFilesExtensions - extensions for including into bundles from components' resources; example: ["scss", "ts"].
 */
const templatesLoaders = (includedFilesExtensions = ['css', 'js', 'scss', 'ts']) => {
  const bemDeclLevels = [];
  redefinitionLevels.forEach((level) => {
    componentGroups.forEach((group) => {
      bemDeclLevels.push(`app/src/${level}/${group}/`);
    });
  });

  return [
    {
      // Adds files of BEM entities to bundle (adds require statements)
      loader: 'bemdecl-to-fs-loader',
      options: {
        levels: bemDeclLevels,
        extensions: includedFilesExtensions,
      },
    },
    {
      // convert HTML to bem DECL format
      loader: 'html2bemdecl-loader',
    },
    {
      // convert template function to html
      loader: './utils/webpack/loaders/pug-loader.ts',
    },
    {
      // convert pug to template function
      loader: 'pug-loader',
    },
  ];
};

/**
 * Loaders contraction that loads autoprefixed normalize css with converting modern CSS into something most browsers can understand.
 * DoIUse - alerts for unsupported css features, depending on browserslist.
 * PostcssFlexbugsFixes - fix some flex bugs in old browsers.
 * @param { object } extra_loader - loader with options for css preprocessor.
 * @returns { object[] }
 */
const cssLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,

        // if hmr does not work, this is a forceful method.
        reloadAll: true,

        // dist/styles/[name]/style.css -> dist/
        publicPath: './../../',
      },
    },
    {
      loader: 'css-loader',
      options: {
        url: (url, resourcePath) => {
          // resourcePath - path to css file

          const isResized =
            url.includes('-320.') ||
            url.includes('-640.') ||
            url.includes('-960.') ||
            url.includes('-1920.');

          // Don't handle resized ` and .webp` urls
          if (isResized || url.includes('.webp')) {
            return false;
          }

          return true;
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            DoIUse({}),
            PostcssFlexbugsFixes(),
            Autoprefixer(),
            PostCSSPresetEnv(),
            PostCSSNormalize(),
          ],
        },
      },
    },
  ];

  if (extraLoader) {
    loaders.push(extraLoader);
  }

  return loaders;
};

/**
 * loads js using babel
 * @param { string } extraPreset - name of loader for js preprocessor
 * @returns { string[] }
 */
const jsLoaders = (extraPreset) => {
  const babelOptions = {
    presets: ['@babel/preset-env'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
    cacheDirectory: './app/cache/webpack__babel',
  };

  if (extraPreset) {
    babelOptions.presets.push(extraPreset);
  }

  return [
    {
      loader: 'babel-loader',
      options: babelOptions,
    },
  ];
};

/**
 * loads assets using file-loader
 * @param { object } extra_loader - loader with options
 * @returns { object[] }
 */
const assetsLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: 'file-loader',
      options: {
        name: '[path]/[name].[ext]',
      },
    },
  ];

  if (extraLoader) {
    loaders.push(extraLoader);
  }

  return loaders;
};

/**
 * Some useful optimizations for bundles by webpack optimization property
 */
const optimization = () => {
  const config = {
    // extract manifest from all entries
    runtimeChunk: { name: 'manifest' },

    // split common imports into separate files
    splitChunks: {
      // == 'initial' && 'async'
      chunks: 'all',
      minChunks: 1,
      cacheGroups: {
        global: {
          test: /.*\\utils\\global\\.*/,
          priority: 7,
          enforce: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,

          // The optimization will prefer the cache group with a higher priority
          priority: 6,

          // always create chunks (ignore: minSize, maxAsyncRequests, ... )
          enforce: true,
        },
        lib: {
          test: /.*\\library.blocks\\.*/,
          priority: 5,
          enforce: true,
        },
        common: {
          test: /.*\\common.blocks\\.*/,
          priority: 4,
          enforce: true,
        },
        thematic: {
          test: /.*\\thematic\\.*\.blocks.*/,
          priority: 3,
          enforce: true,
        },
        experiments: {
          test: /.*\\experimental\\.*\.blocks.*/,
          priority: 2,
          enforce: true,
        },
        css: {
          test: /\.css$/,
          minChunks: 2,
          priority: 1,
          enforce: true,
        },
        js: {
          test: /\.js$/,
          minChunks: 2,
          priority: 1,
          enforce: true,
        },
      },
    },
  };

  if (isProd) {
    // minify css and js
    config.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

/*
 * measures speed of each plugin in bundling
 * writes data in stats.json as plain text, shouldn't be in dev mod
 */
const smp = new SpeedMeasurePlugin({ disable: process.env.MEASURE === 'false' });
module.exports = smp.wrap({
  // The base directory, an absolute path, for resolving entry points and loaders
  context: PATHS.src_absolute,
  mode: 'development',

  // Declarations of used files in bundles
  entry: resultOfTemplatesProcessing.entries,

  // Where to put bundles for every entry point
  output: {
    filename: hashedFileName(isDev ? 'bundles/[name]/[name]' : 'bundles/[id]/script', 'js'),
    path: PATHS.dist_absolute,
  },
  resolve: {
    // You can use it while using import in css and js
    alias: sharedAliases,
    extensions: ['.js', '.json', '.ts'],
  },
  plugins: webpackPlugins(),
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: templatesLoaders(),
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders({
          loader: 'sass-loader',
          options: {
            // Prefer `dart-sass` instead `node-sass`
            implementation: DartSASS,

            /* compilation faster with fiber on */
            sassOptions: {
              fiber: fibers,
            },
          },
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: assetsLoaders(),
      },
      {
        test: /\.(ttf|otf|woff|woff2|eot)$/,
        use: assetsLoaders(),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-typescript'),
      },
    ],
  },

  // show readable file names during development process
  devtool: isDev ? 'source-map' : '',
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,

    // watch html
    watchContentBase: true,
  },
});
