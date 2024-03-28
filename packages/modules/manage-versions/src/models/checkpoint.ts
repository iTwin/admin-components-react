/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface Checkpoint {
  changesetIndex: number;
  changesetId: string;
  state: string;
  containerAccessInfo: ContainerAccessInfo;
  _links: {
    download: DownloadLink;
  };
}

export interface ContainerAccessInfo {
  account: string;
  container: string;
  sas: string;
  dbName: string;
}

export interface DownloadLink {
  href: string;
}
