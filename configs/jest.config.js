module.exports = {
  rootDir: "./../app/src/",
  preset: "ts-jest/presets/js-with-ts",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/../coverage",
  transformIgnorePatterns: ["node_modules/(?!(lodash-es|lit-html|@open-wc/lit-helpers))"], // FIXME: should be replaced after ts-jest v27 release(ESM support)
  setupFilesAfterEnv: ["<rootDir>/../../configs/setupEventsToJest.ts"], // https://github.com/kulshekhar/ts-jest/issues/1035#issuecomment-486442977 and https://github.com/jsdom/jsdom/pull/2666#issuecomment-691216178
  coveragePathIgnorePatterns: ["<rootDir>/utils/"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/../tests/__mocks__/fileMock.js",
    "\\.(css|s[ac]ss)$": "<rootDir>/../tests/__mocks__/styleMock.js",
    "@pug(.*)$": "<rootDir>/pug/$1",
    "@layouts(.*)$": "<rootDir>/layouts/$1",
    "@library.blocks(.*)$": "<rootDir>/components/library.blocks/$1",
    "@common.blocks(.*)$": "<rootDir>/components/common.blocks/$1",
    "@thematic(.*)$": "<rootDir>/components/thematic/$1",
    "@experiments(.*)$": "<rootDir>/components/experimental/$1",
    "@images(.*)$": "<rootDir>/assets/pictures/images/$1",
    "@contents(.*)$": "<rootDir>/assets/pictures/contents/$1",
    "@fonts(.*)$": "<rootDir>/assets/fonts/$1",
    "@utils(.*)$": "<rootDir>/utils/$1",
  },
};
