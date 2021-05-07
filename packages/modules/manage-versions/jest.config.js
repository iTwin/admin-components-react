/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](?!@bentley/ui).+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|svg?.+)$":
      "<rootDir>/src/tests/mocks/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  verbose: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "test",
    ".d.ts",
    "src/mocks.ts",
  ],
  collectCoverageFrom: ["<rootDir>/src/**"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
};
