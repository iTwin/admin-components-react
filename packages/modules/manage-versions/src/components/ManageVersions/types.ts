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
  /** Error message when failed to fetch Named Versions. Default `Could not get Named Versions. Please try again later.`. */
  messageFailedGetNamedVersions: string;
  /** Message when there are no Named Versions. Default `There are no Named Versions created. To create first go to Changes.`. */
  messageNoNamedVersions: string;
  /** Error message when failed to fetch changes. Default `Could not get changes. Please try again later.`. */
  messageFailedGetChanges: string;
  /** Message when there are no changes. Default `There are no changes synchronized.`. */
  messageNoChanges: string;
};
