/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Changeset } from "./changeset";

export type NamedVersion = {
  id: string;
  displayName: string;
  name: string;
  description: string;
  createdDateTime: string;
  _links: {
    changeSet: {
      href: string;
    };
    creator: {
      href: string;
    };
  };
  createdBy: string;
  changesetIndex: number;
};

export type VersionTableData = {
  version: NamedVersion;
  subRows: Changeset[];
};
