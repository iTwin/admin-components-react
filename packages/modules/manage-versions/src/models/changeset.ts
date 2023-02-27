/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export type Changeset = {
  id: string;
  displayName: string;
  description: string;
  index: string;
  pushDateTime: string;
  synchronizationInfo: {
    changedFiles: string[];
  };
  _links: {
    namedVersion?: { href: string };
  };
};
