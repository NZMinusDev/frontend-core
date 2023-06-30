module.exports = {
  rootDir: './../app/src/',
  preset: 'ts-jest/presets/js-with-ts',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/../coverage',

  // FIXME: should be replaced after ts-jest v27 release(ESM support)
  transformIgnorePatterns: ['node_modules/(?!(lodash-es))'],

  // https://github.com/kulshekhar/ts-jest/issues/1035#issuecomment-486442977 and https://github.com/jsdom/jsdom/pull/2666#issuecomment-691216178
  setupFilesAfterEnv: ['<rootDir>/../../configs/setupEventsToJest.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/utils/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/../tests/__mocks__/fileMock.js',
    '\\.(css|s[ac]ss)$': '<rootDir>/../tests/__mocks__/styleMock.js',
    '@layouts(.*)$': '<rootDir>/layouts/$1',
    '@library.blocks(.*)$': '<rootDir>/components/library.blocks/$1',
    '@common.blocks(.*)$': '<rootDir>/components/common.blocks/$1',
    '@thematic(.*)$': '<rootDir>/components/thematic/$1',
    '@experiments(.*)$': '<rootDir>/components/experimental/$1',
    '@assets(.*)$': '<rootDir>/assets/$1',
    '@utils(.*)$': '<rootDir>/utils/$1',
  },
};
