/* eslint-disable @typescript-eslint/no-var-requires */
const { HashedModuleIdsPlugin, ProvidePlugin, ContextReplacementPlugin } = require("webpack");
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
const WebpackImagesResizer = require("webpack-images-resizer");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");
const { DuplicatesPlugin } = require("inspectpack/plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const PATHS = {
  src_absolute: path.resolve(__dirname, "../app/src/"),
  srcPages_absolute: path.resolve(__dirname, "../app/src/pages/"),
  srcPictures_absolute: path.resolve(__dirname, "../app/src/assets/pictures/"),
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
const componentGroups = ["basic", "containers", "primitives", "specific", "layouts"];

const sharedAliases = {
  "@pug": path.resolve(PATHS.src_absolute, "./pug/"),
  "@library.blocks": path.resolve(PATHS.src_absolute, "./components/library.blocks/"),
  "@common.blocks": path.resolve(PATHS.src_absolute, "./components/common.blocks/"),
  "@small-mobile.blocks": path.resolve(PATHS.src_absolute, "./components/small-mobile.blocks/"),
  "@large-mobile.blocks": path.resolve(PATHS.src_absolute, "./components/large-mobile.blocks/"),
  "@tablet.blocks": path.resolve(PATHS.src_absolute, "./components/tablet.blocks/"),
  "@small-desktop.blocks": path.resolve(PATHS.src_absolute, "./components/small-desktop.blocks/"),
  "@large-desktop.blocks": path.resolve(PATHS.src_absolute, "./components/large-desktop.blocks/"),
  "@thematic": path.resolve(PATHS.src_absolute, "./components/thematic/"),
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
        "./utils/global/global.decl.ts",
        `./pages/${shortNameOfTemplate}/${shortNameOfTemplate}.ts`,
        "./components/thematic/main-theme.blocks/main-theme.scss",
      ];

      this.HTMLWebpackPlugins.push(
        new HTMLWebpackPlugin({
          template: `!!pug-loader!app/src/pages/${shortNameOfTemplate}/${nameOfTemplate}`,
          filename: `./${nameOfTemplate.replace(/\.pug/, ".html")}`,
          favicon: "./assets/ico/favicon.ico",
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
 * Get all inner files in directory
 * @param {string} dir path to dir
 * @param {Array<string>} _files private param of files path for recursion
 * @return {Array<string>} array of files' paths
 */
const getFilesDeep = (dir, _files) => {
  // eslint-disable-next-line no-param-reassign
  _files = _files || [];
  const files = fs.readdirSync(dir);

  files.forEach((val, i) => {
    const name = path.resolve(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      getFilesDeep(name, _files);
    } else {
      _files.push(name);
    }
  });

  return _files;
};
/**
 * Map list for append suffix to each element
 * @param {Array<string>} list absolute paths of images
 * @param {string} suffix suffix of files in list to append
 * @param {string} base - path to base src folder when located folder of images
 * @returns {Array{src:string,dest:String}} WebpackImagesResizer 'list' option
 */
const listOfSourceImagesMapping = (list, suffix, base = PATHS.src_absolute) => {
  return list.map((filePath) => {
    const relativeFromDistFullPath = filePath.slice(base.length);
    const relativeFromDistPath = relativeFromDistFullPath.split(".")[0];
    const fileExt = relativeFromDistFullPath.split(".")[1];

    return {
      src: filePath,
      dest: `${relativeFromDistPath}-${suffix}.${fileExt}`,
    };
  });
};
let listOfSourceImages320 = getFilesDeep(PATHS.srcPictures_absolute);
const listOfSourceImages640 = listOfSourceImagesMapping(listOfSourceImages320, "640");
const listOfSourceImages960 = listOfSourceImagesMapping(listOfSourceImages320, "960");
const listOfSourceImages1920 = listOfSourceImagesMapping(listOfSourceImages320, "1920");
listOfSourceImages320 = listOfSourceImagesMapping(listOfSourceImages320, "320");
// FIXME: change it depending on your design template for proper scaling images
const designWidth = 1440;
/**
 * HTMLWebpackPlugin - create html of pages with plug in scripts.
 * ScriptExtHtmlWebpackPlugin - adds to <script> tag attributes depending on RegExp.
 * MiniCssExtractPlugin - extract css into separate files.
 * WrapperPlugin - wrap output css depending on RegExp.
 * ProvidePlugin - Automatically load modules instead of having to import or require them everywhere.
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
      header: "@media (min-width: 0px) {",
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
      test: /.*thematic.*\.css$/,
      header: "@media (color) {",
      footer: "}",
    }),
    new ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    // FIXME: this plugin keeps compillation from end, doesn't know why
    new WebpackImagesResizer(listOfSourceImages320, {
      // 4:3 - QVGA
      width: designWidth > 320 ? `${(320 / designWidth) * 100}%` : "100%",
    }),
    new WebpackImagesResizer(listOfSourceImages640, {
      // 16:9 - nHD
      width: designWidth > 640 ? `${(640 / designWidth) * 100}%` : "100%",
    }),
    new WebpackImagesResizer(listOfSourceImages960, {
      // 16:9 - qHD
      width: designWidth > 960 ? `${(960 / designWidth) * 100}%` : "100%",
    }),
    new WebpackImagesResizer(listOfSourceImages1920, {
      // 16:9 - Full HD
      width: designWidth > 1920 ? `${(1920 / designWidth) * 100}%` : "100%",
    }),
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
  ];

  if (isProd) {
    plugins.push(
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
      }),
      new DuplicatesPlugin() // writes data in stats.json as plain text, shouldn't be in dev mod
    );
  }

  plugins.push(
    new CircularDependencyPlugin(),
    new UnusedFilesWebpackPlugin({ patterns: ["**/*.scss", "**/*.ts"] }),
    new HashedModuleIdsPlugin({
      hashFunction: "md4",
      hashDigest: "base64",
      hashDigestLength: 8,
    }),
    new ContextReplacementPlugin(/moment[/\\]locale$/, /es-us|ru/),
    new CleanWebpackPlugin()
  );

  return plugins;
};

/**
 * Loaders contraction for templates.
 * @param {Array<String>} includedFilesExtensions - extensions for including into bundles from components' resources; example: ["scss", "ts"].
 */
const templatesLoaders = (includedFilesExtensions = ["css", "js", "scss", "ts"]) => {
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
        name: "[path]/[name].[ext]",
        publicPath: "./../../", // assets base dir -> css file will use this path in output css as link to asset (redirect from ./styles folder/chunk folder/ to dist folder)
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
        global: {
          test: /.*\\utils\\global\\.*/,
          priority: 12,
          enforce: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 11, // The optimization will prefer the cache group with a higher priority
          enforce: true, // always create chunks (ignore: minSize, maxAsyncRequests, ... )
        },
        lib: {
          test: /.*\\library.blocks\\.*/,
          priority: 10,
          enforce: true,
        },
        common: {
          test: /.*\\common.blocks\\.*/,
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

// measures speed of each plugin in bundling
// writes data in stats.json as plain text, shouldn't be in dev mod
const smp = new SpeedMeasurePlugin({ disable: isDev });
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
