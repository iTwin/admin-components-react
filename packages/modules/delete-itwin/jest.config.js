/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "Node10",
          types: ["jest", "node"],
        },
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/tests/mocks/styleMock.js",
  },
  testEnvironment: "jsdom",
  verbose: true,
};
