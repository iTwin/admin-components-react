/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Full representation of the iModel. */
export interface IModelFull {
  /** "Globally Unique Identifier of the iModel" */
  id: string;

  /** "Display name of the iModel. Corresponds to Name property." */
  displayName?: string;

  /** "Name of the iModel." */
  name?: string;

  /** "Description of the iModel." */
  description?: string;

  /** "Boolean flag indicating when iModel is ready to be used." */
  initialized?: boolean;

  /** "Date when the iModel was created." */
  createdDateTime?: string;

  /** "Globally Unique Identifier of the project that iModel belongs to. Only present if iModel belongs to the project." */
  projectId?: string;

  /** "Globally Unique Identifier of the asset that iModel belongs to. Only present if iModel belongs to the asset." */
  assetId?: string;

  /** Thumbnail for the iModel */
  thumbnail?: string;
}

/** An object that allow various configuration of the API access */
export interface ApiOverrides<T = never> {
  /** dev- or qa- */
  serverEnvironmentPrefix?: string;
  /** Data as props */
  data?: T;
}

export enum DataStatus {
  Fetching = "fetching",
  Complete = "complete",
  FetchFailed = "error_fetchFailed",
  TokenRequired = "error_tokenRequired",
  ContextRequired = "error_contextRequired",
}

type SortOptions<T, K extends keyof T> =
  | { sortType: K; descending: boolean }
  | ((a: T, b: T) => number);

/** Supported IModel sorting types */
export type IModelSortOptionsKeys =
  | "displayName"
  | "name"
  | "description"
  | "initialized"
  | "createdDateTime";

/** Object/function that configure IModel sorting behavior. */
export type IModelSortOptions = SortOptions<IModelFull, IModelSortOptionsKeys>;
