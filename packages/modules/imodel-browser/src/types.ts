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
  description?: string | null;

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

/** Full representation of a Project */
export interface ProjectFull {
  id: string;
  displayName?: string;
  projectNumber?: string;
  registrationDateTime?: string;
  industry?: string;
  projectType?: string;
  geographicLocation?: string;
  latitude?: string;
  longitude?: string;
  timeZone?: string;
  dataCenterLocation?: string;
  billingCountry?: string;
  status?: "Active" | "Inactive" | "Trial";
  allowExternalTeamMembers?: boolean;
}

/** An object that allow various configuration of the API access */
export interface ApiOverrides<T = never> {
  /** dev- or qa- */
  serverEnvironmentPrefix?: string;
  /** Data as props */
  data?: T;
}

type FilterOptions<T> = string | ((filterable: T) => boolean);

/** String/function that configure IModel filtering behavior. */
export type IModelFilterOptions = FilterOptions<IModelFull>;

/** String/function that configures Project filtering behavior. */
export type ProjectFilterOptions = FilterOptions<ProjectFull>;

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

/** Supported Project sorting types */
export type ProjectSortOptionsKeys =
  | "displayName"
  | "projectNumber"
  | "registrationDateTime"
  | "industry"
  | "projectType"
  | "geographicLocation"
  | "dataCenterLocation"
  | "billingCountry"
  | "status"
  | "allowExternalTeamMembers";

/** Object/function that configure Project sorting behavior. */
export type ProjectSortOptions = SortOptions<
  ProjectFull,
  ProjectSortOptionsKeys
>;
