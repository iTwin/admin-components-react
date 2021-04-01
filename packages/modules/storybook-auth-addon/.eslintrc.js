/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
module.exports = {
  extends: ["../../../common/scripts/.eslintrc.ts.json"],
  parserOptions: {
    project: `${__dirname}/tsconfig.eslint.json`,
  },
};
