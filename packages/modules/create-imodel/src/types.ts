/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export interface IModelFull {
  /** "Globally Unique Identifier of the iModel" */
  id: string;

  /** "Display name of the iModel. Corresponds to Name property." */
  displayName?: string;

  /** "Name of the iModel." */
  name?: string;

  /** "Description of the iModel." */
  description?: string | null;

  /** "Enum flag indicating when iModel is ready to be used." */
  state?: "initialized" | "notInitialized";

  /** "Date when the iModel was created." */
  createdDateTime?: string;

  /** "Globally Unique Identifier of the iTwin that iModel belongs to. Only present if iModel belongs to the iTwin." */
  iTwinId?: string;

  /** "Globally Unique Identifier of the asset that iModel belongs to. Only present if iModel belongs to the asset." */
  assetId?: string;
  /** iModel extent. */
  extent?: iModelExtent | null;
}

export type BaseIModel = {
  name: string;
  description?: string;
  thumbnail?: ArrayBuffer;
  extent?: iModelExtent | null;
};

export type iModelExtent = {
  southWest: ExtentPoint;
  northEast: ExtentPoint;
};

export type ExtentPoint = {
  latitude: number;
  longitude: number;
};
