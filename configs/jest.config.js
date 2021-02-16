module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/app/tests/__mocks__/fileMock.js",
    "\\.(css|s[ac]ss)$": "<rootDir>/app/tests/__mocks__/styleMock.js",
    "@pug": "<rootDir>/pug/",
    "@layouts": "<rootDir>/layouts/",
    "@library.blocks": "<rootDir>/components/library.blocks/",
    "@common.blocks": "<rootDir>/components/common.blocks/",
    "@thematic": "<rootDir>/components/thematic/",
    "@experiments": "<rootDir>/components/experimental/",
    "@images": "<rootDir>/assets/pictures/images/",
    "@contents": "<rootDir>/assets/pictures/contents/",
    "@fonts": "<rootDir>/assets/fonts/",
    "@utils": "<rootDir>/utils/",
  },
};
