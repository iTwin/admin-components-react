/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export type RequestOptions = {
  skip?: number;
  top?: number;
  lastIndex?: number;
  afterIndex?: number;
  orderBy?: string;
  $search?: string;
  name?: string;
};
