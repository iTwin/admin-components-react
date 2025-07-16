/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Changeset } from "./changeset";

export type NamedVersionBackend = {
  id: string;
  displayName: string;
  name: string;
  description: string;
  createdDateTime: string;
  state: string;
  _links: {
    changeSet: {
      href: string;
    };
    creator: {
      href: string;
    };
  };
  changesetIndex: number;
};

export type NamedVersion = NamedVersionBackend & {
  createdBy: string;
};

export type VersionTableData = {
  version: NamedVersion;
  subRows: Changeset[];
  subRowsLoaded: boolean;
};
