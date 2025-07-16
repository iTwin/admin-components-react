/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export enum RequestStatus {
  NotStarted,
  InProgress,
  Finished,
  Failed,
}

export type ManageVersionsStringOverrides = {
  /** Named Versions tab name. Default `Named Versions`. */
  namedVersions: string;
  /** Changes tab name. Default `Changes`. */
  changes: string;
  /** Table column title for name. Default `Name`. */
  name: string;
  /** Table column title for description. Default `Description`. */
  description: string;
  /** Table column title for time. Default `Time`. */
  time: string;
  /** Table column title for changed files. Default `Changed Files`. */
  changedFiles: string;
  /** Title for Named Version create modal. Default `Create a Named Version` */
  createNamedVersion: string;
  /** Default: `Cancel` */
  cancel: string;
  /** Default: `Create` */
  create: string;
  /** Title for Named Version update modal. Default: `Update a Named Version` */
  updateNamedVersion: string;
  /** Default: `Update` */
  update: string;
  /** Default: `Download` */
  download: string;
  /** Default: `Hide` */
  hide: string;
  /** Default: `Unhide` */
  unhide: string;
  /** Label for Named Version context menu` Default `More` */
  More?: string;
  /** Default: `View` */
  view: string;
  /** Error message when failed to fetch Named Versions. Default `Could not get Named Versions. Please try again later.`. */
  messageFailedGetNamedVersions: string;
  /** Message when there are no Named Versions. Default `There are no Named Versions created. To create first go to Changes.`. */
  messageNoNamedVersions: string;
  /** Error message when failed to fetch changes. Default `Could not get changes. Please try again later.`. */
  messageFailedGetChanges: string;
  /** Message when there are no changes. Default `There are no changes synchronized.`. */
  messageNoChanges: string;
  /** Default `Named Version "{{name}}" was successfully created.` - `{{name}}` - Named Version name. */
  messageVersionCreated: string;
  /** Default `Named Version with the same name already exists.` */
  messageVersionNameExists: string;
  /** Default `You do not have the required permissions to create a Named Version.` */
  messageInsufficientPermissionsToCreateVersion: string;
  /** Default `Could not create a Named Version. Please try again later.` */
  messageCouldNotCreateVersion: string;
  /** Default `Named Version "{{name}}" was successfully updated.` - `{{name}}` - Named Version name */
  messageVersionUpdated: string;
  /** Default `Downloading file...`. */
  messageFileDownloadInProgress?: string;
  /** Default `Unable to download file.`. */
  messageCouldNotDownloadedFileSuccessfully?: string;
  /** Default `You do not have the required permissions to update a Named Version.` */
  messageInsufficientPermissionsToUpdateVersion: string;
  /** Default `Could not update a Named Version. Please try again later.` */
  messageCouldNotUpdateVersion: string;
  /** Default `The value exceeds allowed {{length}} characters.` - `{{length}}` - max length */
  messageValueTooLong: string;
  /** Default: `User` */
  user?: string;
  /** Default: `Information Panel` */
  informationPanel?: string;
  /** string overrides for text within Information panel` */
  informationPanelStringOverrides?: InformationPanelStringOverrides;
  /** Default: `Show hidden Versions` */
  messageShowHiddenVersions: string;
  /** Default: Named Version "{{versionName}}" was successfully hidden.*/
  messageHideVersionSucess: string;
  /** Default: Named Version "{{versionName}}" was successfully unhidden.*/
  messageUnhideVersionSucess: string;
  /** Default: `Could not hide Named Version. Please try again later. */
  messageHideVersionFailed: string;
  /** Default: `Could not unhide Named Version. Please try again later. */
  messageUnhideVersionFailed: string;
  /** Default: `Hidden` */
  hidden: string;
};

export type LogFunc = (
  message: string,
  customProps?: Record<string, any>
) => void;

export type ApiOverrides = { serverEnvironmentPrefix?: "dev" | "qa" | "" };

export type InformationPanelStringOverrides = {
  /** title. Default `Change #`. */
  title: string;
  /** Label for property createdBy. Default `Created By`. */
  createdBy: string;
  /** Label for property pushDateTime. Default `Date Created`. */
  createdDate: string;
  /** Label for property application name. Default `Application`. */
  application: string;
  /** Label for connection attributes. Default `Connection Attributes`. */
  connectionAttributes: string;
  /** Label for property changedFiles. Default `Changed Files`. */
  changedFiles: string;
  /** Default text for no-value. Default `N/A`. */
  noValue: string;
};
