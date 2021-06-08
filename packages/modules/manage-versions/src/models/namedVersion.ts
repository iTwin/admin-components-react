/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export type NamedVersion = {
  id: string;
  displayName: string;
  name: string;
  description: string;
  createdDateTime: string;
  changesetId: string;
  _links: {
    changeSet: { href: string };
  };
};
