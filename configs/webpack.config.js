/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HTMLWebpackInjector = require("html-webpack-injector");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Autoprefixer = require("autoprefixer");
const PostCSSPresetEnv = require("postcss-preset-env");
const PostCSSNormalize = require("postcss-normalize");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const PATHS = {
  src_absolute: path.resolve(__dirname, "../app/src/"),
  srcPages_absolute: path.resolve(__dirname, "../app/src/pages/"),
  dist_absolute: path.resolve(__dirname, "../app/dist/"),
};

/**
 * Useful tool for creating name of files with hash
 * @param {String} name - what should be before hash
 * @param {String} ext - extension of output bundle files such as js/webp/png
 * @returns {String} - hashed name in production mode and nohashed in another case
 */
const filename = (name, ext) => (isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`); 

/**
 * loop pages folder and create stuff depending on names of pages.
 * @param {String} templateExtension - extension of pages such as html/pug ...
 */
class ResultOfTemplatesProcessing {
  constructor(templateExtension) {
    const foldersOfPages = fs.readdirSync(PATHS.srcPages_absolute);
    // get all pug templates from each page folder
    const namesOfTemplates = [].concat(
      ...foldersOfPages.map((folder) =>
        fs
          .readdirSync(`${PATHS.srcPages_absolute}\\${folder}\\`)
          .filter((filename) => filename.endsWith(`.${templateExtension}`))
      )
    );

    this.entries = {};
    this.HTMLWebpackPlugins = [];
    namesOfTemplates.forEach((nameOfTemplate) => {
      const shortNameOfTemplate = nameOfTemplate.replace(/\.pug/, "");
      // eslint-disable-next-line camelcase
      const shortNameOfTemplate_head = `${shortNameOfTemplate}_head`; // name for <head> injecting by HTMLWebpackInjector

      this.entries[shortNameOfTemplate] = [
        "@babel/polyfill",
        `./pages/${shortNameOfTemplate}/${shortNameOfTemplate}.decl.ts`,
      ];

      // chunk for <head> injecting
      this.entries[shortNameOfTemplate_head] = ["./utils/head-templates/head-template.decl.ts"];

      this.HTMLWebpackPlugins.push(
        new HTMLWebpackPlugin({
          template: `./pages/${shortNameOfTemplate}/${nameOfTemplate}`,
          filename: `./${nameOfTemplate.replace(/\.pug/, filename("","html"))}`,
          favicon: "./assets/images/ico/favicon.ico",
          // eslint-disable-next-line camelcase
          chunks: [shortNameOfTemplate, shortNameOfTemplate_head],
          minify: {
            collapseWhitespace: isProd,
          },
        })
      );
    });
  }
}
const resultOfTemplatesProcessing = new ResultOfTemplatesProcessing("pug");

/**
 * HTMLWebpackPlugin - create html of pages with plug in scripts
 * HTMLWebpackInjector - plugin that simplifies injection of chunks into head and body
 * ImageMinimizerPlugin - Plugin and Loader for webpack to optimize (compress) all images. Make sure ImageMinimizerPlugin place after any plugins that add images or other assets which you want to optimized.
 * CleanWebpackPlugin - clean dist folder before each use
 */
const plugins = () => {
  return [
    ...resultOfTemplatesProcessing.HTMLWebpackPlugins,
    new HTMLWebpackInjector(),
    // images are converted to WEBP
    new ImageMinimizerPlugin({
      cache: "./app/cache/webpack__ImageMinimizerPlugin", // Enable file caching and set path to cache directory
      filename: filename("[path]/[name]/[name]","webp"),
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
      filename: "[path]/[name]/[name].[ext]", //Tip: hashed by assetsLoader (file-loader)
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
    new CleanWebpackPlugin(),
  ];
};

/**
 * Loaders contraction that loads autoprefixed normalize css with converting modern CSS into something most browsers can understand and places it into <style> of html
 * @param {Object} extra_loader - loader with options for css preprocessor
 * @returns {Array<Object>}
 */
const cssLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [Autoprefixer(), PostCSSPresetEnv(), PostCSSNormalize()],
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
  };

  if (extraPreset) {
    babelOptions.presets.push(extraPreset);
  }

  const loaders = [
    {
      loader: "babel-loader",
      options: babelOptions,
    },
  ];

  return loaders;
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
        name: filename("[path]/[name]/[name]","[ext]"),
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
    splitChunks: {
      // split common imports into separate files
      chunks: "all",
    },
  };

  if (isProd) {
    // minify css and js
    config.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

module.exports = {
  // The base directory, an absolute path, for resolving entry points and loaders
  context: PATHS.src_absolute,
  mode: "development",
  // Declarations of used files in bundles
  entry: resultOfTemplatesProcessing.entries,
  // Where to put bundles for every entry point
  output: {
    filename: filename("bundles/[id]/[name]", "js"),
    path: PATHS.dist_absolute,
  },
  resolve: {
    // You can use it while using import in css and js
    alias: {
      "@library.blocks": path.resolve(PATHS.src_absolute, "./components/library.blocks/"),
      "@common.blocks": path.resolve(PATHS.src_absolute, "./components/common.blocks/"),
      "@mobile.blocks": path.resolve(PATHS.src_absolute, "./components/mobile.blocks/"),
      "@tablet.blocks": path.resolve(PATHS.src_absolute, "./components/tablet.blocks/"),
      "@desktop.blocks": path.resolve(PATHS.src_absolute, "./components/desktop.blocks/"),
      "@large-desktop.blocks": path.resolve(
        PATHS.src_absolute,
        "./components/large_desktop.blocks/"
      ),
      "@themes": path.resolve(PATHS.src_absolute, "./components/thematic/"),
      "@experiments": path.resolve(PATHS.src_absolute, "./components/experimental/"),
      "@images": path.resolve(PATHS.src_absolute, "./assets/images/"),
      "@contents": path.resolve(PATHS.src_absolute, "./assets/contents/"),
    },
    extensions: [".js", ".json", ".ts"],
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders({ loader: "sass-loader" }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: assetsLoaders(),
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
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
    watchContentBase: true, // watch html fix
  },
};
