var loaderUtils = require("loader-utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const _module = _interopRequireDefault(require("module"));

const parentModule = module;

/**
 *
 * @param code - code which pug-loader returns
 * @param loaderContext, see https://webpack.js.org/api/loaders/
 * @returns pug template(locals:object), see https://github.com/pugjs/pug/issues/2604
 */
function exec(code, loaderContext) {
  const { resource, context } = loaderContext;
  const module = new _module.default(resource, parentModule);

  module.paths = _module.default._nodeModulePaths(context);
  module.filename = resource;

  code = code.replace("!../../..", "../../..");

  module._compile(code, resource);

  return module.exports;
}

/**
 * Execute template with locals parameter and return plain html. Locals you can set as loader option inside webpack.config, example:
 * {
 *   loader: "./utils/webpack/loaders/pug-loader.ts",
 *   options: { locals: { test: "test" } }
 * }
 */
module.exports = function (pug) {
  const loaderOptions = loaderUtils.getOptions(this);
  return exec(pug, this)(loaderOptions ? loaderOptions.locals || {} : {});
};
