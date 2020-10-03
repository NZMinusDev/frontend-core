/* eslint-disable @typescript-eslint/no-var-requires */
const { HashedModuleIdsPlugin } = require("webpack");
const path = require("path");
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const PugPluginAlias = require("pug-alias");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DartSASS = require("sass");
const fibers = require("fibers");
const WrapperPlugin = require("wrapper-webpack-plugin");
const DoIUse = require("doiuse");
const PostcssFlexbugsFixes = require("postcss-flexbugs-fixes");
const Autoprefixer = require("autoprefixer");
const PostCSSPresetEnv = require("postcss-preset-env");
const PostCSSNormalize = require("postcss-normalize");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");
const { DuplicatesPlugin } = require("inspectpack/plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const PATHS = {
  src_absolute: path.resolve(__dirname, "../app/src/"),
  srcPages_absolute: path.resolve(__dirname, "../app/src/pages/"),
  dist_absolute: path.resolve(__dirname, "../app/dist/"),
};

const redefinitionLevels = [
  "library.blocks",
  "common.blocks",
  "adaptive/small-mobile.blocks",
  "adaptive/large-mobile.blocks",
  "adaptive/tablet.blocks",
  "adaptive/small-desktop.blocks",
  "adaptive/large-desktop.blocks",
  "thematic/main-theme.blocks",
  "experimental/experiment-1.blocks",
];
const componentGroups = ["basic", "containers", "primitives", "specific"];

const sharedAliases = {
  "@pug": path.resolve(PATHS.src_absolute, "./pug/"),
  "@library.blocks": path.resolve(PATHS.src_absolute, "./components/library.blocks/"),
  "@common.blocks": path.resolve(PATHS.src_absolute, "./components/common.blocks/"),
  "@small-mobile.blocks": path.resolve(PATHS.src_absolute, "./components/small-mobile.blocks/"),
  "@large-mobile.blocks": path.resolve(PATHS.src_absolute, "./components/large-mobile.blocks/"),
  "@tablet.blocks": path.resolve(PATHS.src_absolute, "./components/tablet.blocks/"),
  "@small-desktop.blocks": path.resolve(PATHS.src_absolute, "./components/small-desktop.blocks/"),
  "@large-desktop.blocks": path.resolve(PATHS.src_absolute, "./components/large-desktop.blocks/"),
  "@themes": path.resolve(PATHS.src_absolute, "./components/thematic/"),
  "@experiments": path.resolve(PATHS.src_absolute, "./components/experimental/"),
  "@images": path.resolve(PATHS.src_absolute, "./assets/pictures/images/"),
  "@contents": path.resolve(PATHS.src_absolute, "./assets/pictures/contents/"),
  "@fonts": path.resolve(PATHS.src_absolute, "./assets/fonts/"),
  "@utils": path.resolve(PATHS.src_absolute, "./utils/"),
};
// returns a new object with the keys mapped using mapFn(key)
const objectKeyMap = (object, mapFn) =>
  Object.fromEntries(Object.entries(object).map(([key, value]) => [mapFn(key), value]));

/**
 * Useful tool for creating name of files with hash
 * @param {String} name - what should be before hash
 * @param {String} ext - extension of output bundle files such as js/webp/png
 * @returns {String} - hashed name in production mode and nohashed in another case
 */
const hashedFileName = (name, ext) => (isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`);

/**
 * loop pages folder and create stuff depending on names of pages.
 */
class ResultOfTemplatesProcessing {
  constructor() {
    const foldersOfPages = fs.readdirSync(PATHS.srcPages_absolute);
    // get all pug templates from each page folder
    const namesOfTemplates = [].concat(
      ...foldersOfPages.map((folder) =>
        fs
          .readdirSync(`${PATHS.srcPages_absolute}\\${folder}\\`)
          .filter((filename) => filename.endsWith(`.pug`))
      )
    );

    this.entries = {};
    this.HTMLWebpackPlugins = [];
    namesOfTemplates.forEach((nameOfTemplate) => {
      const shortNameOfTemplate = nameOfTemplate.replace(/\.pug/, "");

      this.entries[shortNameOfTemplate] = [
        "@babel/polyfill",
        `./pages/${shortNameOfTemplate}/${shortNameOfTemplate}.ts`,
        "./utils/normalizeCSS/normalize.css",
      ];

      this.HTMLWebpackPlugins.push(
        new HTMLWebpackPlugin({
          template: `!!pug-loader!app/src/pages/${shortNameOfTemplate}/${nameOfTemplate}`,
          filename: `./${nameOfTemplate.replace(/\.pug/, ".html")}`,
          favicon: "./assets/pictures/images/ico/favicon.ico",
          chunks: [shortNameOfTemplate],
          // Tip: for 'defer' use pay attention on elements which can be non-working while res loading.
          scriptLoading: "defer",
        })
      );
    });
  }
}
const resultOfTemplatesProcessing = new ResultOfTemplatesProcessing();

/**
 * HTMLWebpackPlugin - create html of pages with plug in scripts.
 * ScriptExtHtmlWebpackPlugin - adds to <script> tag attributes depending on RegExp.
 * MiniCssExtractPlugin - extract css into separate files.
 * WrapperPlugin - wrap output css depending on RegExp.
 * ImageMinimizerPlugin - Plugin and Loader for webpack to optimize (compress) all images. Make sure ImageMinimizerPlugin place after any plugins that add images or other assets which you want to optimized.
 * CircularDependencyPlugin - scan bundles to alert about circular dependencies.
 * DuplicatesPlugin - scan bundles to alert about duplicate resources from node_modules.
 * UnusedFilesWebpackPlugin - scan bundles to alert about UnusedFiles.
 * HashedModuleIdsPlugin - replace webpack number links to character links.
 * CleanWebpackPlugin - clean dist folder before each use.
 */
const webpackPlugins = () => {
  const plugins = [
    ...resultOfTemplatesProcessing.HTMLWebpackPlugins,
    // FIXME: customize it depending on the project. Tip: pay attention to scriptLoading and inject attributes in HTMLWebpackPlugin
    // https://github.com/numical/script-ext-html-webpack-plugin
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "sync",
    }),
    new MiniCssExtractPlugin({
      filename: hashedFileName("styles/[id]/[name]", "css"),
    }),
    new WrapperPlugin({
      test: /.*small-mobile.*\.css$/,
      header: "@media (max-width: 599.98px) {",
      footer: "}",
    }),
    new WrapperPlugin({
      test: /.*large-mobile.*\.css$/,
      header: "@media (min-width: 600px) {",
      footer: "}",
    }),
    new WrapperPlugin({
      test: /.*tablet.*\.css$/,
      header: "@media (min-width: 768px) {",
      footer: "}",
    }),
    new WrapperPlugin({
      test: /.*small-desktop.*\.css$/,
      header: "@media (min-width: 992px) {",
      footer: "}",
    }),
    new WrapperPlugin({
      test: /.*large-desktop.*\.css$/,
      header: "@media (min-width: 1200px) {",
      footer: "}",
    }),
    new WrapperPlugin({
      test: /.*themes.*\.css$/,
      header: "@media (color) {",
      footer: "}",
    }),
  ];

  if (isProd) {
    plugins.push(
      // images are converted to WEBP
      new ImageMinimizerPlugin({
        cache: "./app/cache/webpack__ImageMinimizerPlugin", // Enable file caching and set path to cache directory
        filename: "[path]/[name].webp", // Tip: hashed by assetsLoader (file-loader)
        keepOriginal: true, // keep compressed image
        minimizerOptions: {
          // Lossless optimization with custom option
          plugins: [
            [
              "imagemin-webp",
              {
                // preset: default //default, photo, picture, drawing, icon and text
                // lossless: true,
                nearLossless: 0, // pre compression with lossless mode on
              },
            ],
          ],
        },
      }),
      // original images will compressed lossless
      new ImageMinimizerPlugin({
        cache: "./app/cache/webpack__ImageMinimizerPlugin", // Enable file caching and set path to cache directory
        filename: "[path]/[name].[ext]", // Tip: hashed by assetsLoader (file-loader)
        minimizerOptions: {
          // Lossless optimization with custom option
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
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
  }

  plugins.push(
    new CircularDependencyPlugin(),
    new DuplicatesPlugin(),
    new UnusedFilesWebpackPlugin({ patterns: ["**/*.scss", "**/*.ts"] }),
    new HashedModuleIdsPlugin({
      hashFunction: "md4",
      hashDigest: "base64",
      hashDigestLength: 8,
    }),
    new CleanWebpackPlugin()
  );

  return plugins;
};

/**
 * Loaders contraction for templates.
 * @param {Array<String>} includedFilesExtensions - extensions for including into bundles from components' resources; example: ["scss", "ts"].
 */
const templatesLoaders = (includedFilesExtensions = ["scss", "ts"]) => {
  const bemDeclLevels = [];
  redefinitionLevels.forEach((level) => {
    componentGroups.forEach((group) => {
      bemDeclLevels.push(`app/src/components/${level}/${group}/`);
    });
  });

  return [
    {
      // Adds files of BEM entities to bundle (adds require statements)
      loader: "bemdecl-to-fs-loader",
      options: {
        levels: bemDeclLevels,
        extensions: includedFilesExtensions,
      },
    },
    {
      // convert HTML to bem DECL format
      loader: "html2bemdecl-loader",
    },
    {
      // convert pug to html in runtime
      loader: "pug-plain-loader",
      options: {
        plugins: [
          PugPluginAlias(
            objectKeyMap(sharedAliases, (key) => {
              return `~${key}`;
            })
          ),
        ],
      },
    },
  ];
};

/**
 * Loaders contraction that loads autoprefixed normalize css with converting modern CSS into something most browsers can understand.
 * DoIUse - alerts for unsupported css features, depending on browserslist.
 * PostcssFlexbugsFixes - fix some flex bugs in old browsers.
 * @param {Object} extra_loader - loader with options for css preprocessor.
 * @returns {Array<Object>}
 */
const cssLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        // if hmr does not work, this is a forceful method.
        reloadAll: true,
      },
    },
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
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
 * @param {String} extraPreset - name of loader for js preprocessor
 * @returns {Array<String>}
 */
const jsLoaders = (extraPreset) => {
  const babelOptions = {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-class-properties"],
    cacheDirectory: "./app/cache/webpack__babel",
  };

  if (extraPreset) {
    babelOptions.presets.push(extraPreset);
  }

  return [
    {
      loader: "babel-loader",
      options: babelOptions,
    },
  ];
};

/**
 * loads assets using file-loader
 * @param {Object} extra_loader - loader with options
 * @returns {Array<Object>}
 */
const assetsLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: "file-loader",
      options: {
        name: hashedFileName("[path]/[name]", "[ext]"),
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
    runtimeChunk: { name: "manifest" },
    splitChunks: {
      // split common imports into separate files
      chunks: "all", // == 'initial' && 'async'
      minChunks: 1,
      cacheGroups: {
        normalize: {
          test: /.*\\normalizeCSS\\.*\.css$/,
          minChunks: 1,
          priority: 11,
          enforce: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10, // The optimization will prefer the cache group with a higher priority
          enforce: true, // always create chunks (ignore: minSize, maxAsyncRequests, ... )
        },
        common: {
          test: /.*\\(common.blocks)|(library.blocks)\\.*/,
          priority: 9,
          enforce: true,
        },
        "small-mobile": {
          test: /.*\\adaptive\\small-mobile.blocks\\.*/,
          priority: 8,
          enforce: true,
        },
        "large-mobile": {
          test: /.*\\adaptive\\large-mobile.blocks\\.*/,
          priority: 7,
          enforce: true,
        },
        tablet: {
          test: /.*\\adaptive\\tablet.blocks\\.*/,
          priority: 6,
          enforce: true,
        },
        "small-desktop": {
          test: /.*\\adaptive\\small-desktop.blocks\\.*/,
          priority: 5,
          enforce: true,
        },
        "large-desktop": {
          test: /.*\\adaptive\\large-desktop.blocks\\.*/,
          priority: 4,
          enforce: true,
        },
        themes: {
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

const smp = new SpeedMeasurePlugin(); // measures speed of each plugin in bundling
module.exports = smp.wrap({
  // The base directory, an absolute path, for resolving entry points and loaders
  context: PATHS.src_absolute,
  mode: "development",
  // Declarations of used files in bundles
  entry: resultOfTemplatesProcessing.entries,
  // Where to put bundles for every entry point
  output: {
    filename: hashedFileName("bundles/[id]/[name]", "js"),
    path: PATHS.dist_absolute,
    publicPath: `${PATHS.dist_absolute}/`,
  },
  resolve: {
    // You can use it while using import in css and js
    alias: sharedAliases,
    extensions: [".js", ".json", ".ts"],
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
          loader: "sass-loader",
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
        use: jsLoaders("@babel/preset-typescript"),
      },
    ],
  },
  devtool: isDev ? "source-map" : "", // show readable file names during development process
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
    watchContentBase: true, // watch html
  },
});
