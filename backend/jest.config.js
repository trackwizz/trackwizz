// eslint-disable-next-line no-undef
module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["./__tests__/setup.ts"],
  coverageReporters: ["json-summary"],
};
