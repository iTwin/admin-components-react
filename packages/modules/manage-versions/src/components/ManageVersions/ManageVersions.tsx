/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { HorizontalTabs } from "@itwin/itwinui-react";
import React from "react";

import { ChangesetClient } from "../../clients/changesetClient";
import { NamedVersionClient } from "../../clients/namedVersionClient";
import { Changeset, NamedVersion } from "../../models";
import ChangesTab from "./ChangesTab/ChangesTab";
import { LogFunc, ManageVersionsStringOverrides, RequestStatus } from "./types";
import VersionsTab from "./VersionsTab/VersionsTab";

export const defaultStrings: ManageVersionsStringOverrides = {
  namedVersions: "Named Versions",
  changes: "Changes",
  name: "Name",
  description: "Description",
  time: "Time",
  messageFailedGetNamedVersions:
    "Could not get Named Versions. Please try again later.",
  messageNoNamedVersions:
    "There are no Named Versions created. To create first go to Changes.",
  messageFailedGetChanges: "Could not get changes. Please try again later.",
  messageNoChanges: "There are no changes synchronized.",
};

export type ManageVersionsProps = {
  /** Access token that requires the `imodels:read` scope. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  /** Id of iModel. */
  imodelId: string;
  /** Strings overrides for localization. */
  stringsOverrides?: ManageVersionsStringOverrides;
  /** Method that logs inner component errors. */
  log?: LogFunc;
};

enum ManageVersionsTabs {
  Version = 0,
  Changes = 1,
}

export const ManageVersions = (props: ManageVersionsProps) => {
  const {
    accessToken,
    apiOverrides,
    imodelId,
    stringsOverrides = defaultStrings,
    log,
  } = props;

  const versionClient = React.useMemo(
    () =>
      new NamedVersionClient(
        accessToken,
        apiOverrides?.serverEnvironmentPrefix,
        log
      ),
    [accessToken, apiOverrides?.serverEnvironmentPrefix, log]
  );
  const changesetClient = React.useMemo(
    () =>
      new ChangesetClient(
        accessToken,
        apiOverrides?.serverEnvironmentPrefix,
        log
      ),
    [accessToken, apiOverrides?.serverEnvironmentPrefix, log]
  );

  const [currentTab, setCurrentTab] = React.useState(
    ManageVersionsTabs.Version
  );
  const [versions, setVersions] = React.useState<NamedVersion[]>();
  const [versionStatus, setVersionStatus] = React.useState(
    RequestStatus.NotStarted
  );

  const [changesets, setChangesets] = React.useState<Changeset[]>();
  const [changesetStatus, setChangesetStatus] = React.useState(
    RequestStatus.NotStarted
  );

  React.useEffect(() => {
    versionClient
      .get(imodelId)
      .then((versions) => {
        setVersionStatus(RequestStatus.Finished);
        setVersions(versions);
      })
      .catch(() => setVersionStatus(RequestStatus.Failed));
  }, [imodelId, versionClient]);

  React.useEffect(() => {
    if (
      currentTab === ManageVersionsTabs.Changes &&
      changesetStatus === RequestStatus.NotStarted
    ) {
      changesetClient
        .get(imodelId)
        .then((changesets) => {
          setChangesetStatus(RequestStatus.Finished);
          setChangesets(changesets);
        })
        .catch(() => setChangesetStatus(RequestStatus.Failed));
    }
  }, [changesetClient, changesetStatus, currentTab, imodelId]);

  return (
    <div>
      <HorizontalTabs
        labels={[stringsOverrides.namedVersions, stringsOverrides.changes]}
        activeIndex={currentTab}
        onTabSelected={(index) => setCurrentTab(index)}
        type="borderless"
      />
      {currentTab === ManageVersionsTabs.Version && (
        <VersionsTab
          versions={versions ?? []}
          status={versionStatus}
          stringsOverrides={stringsOverrides}
        />
      )}
      {currentTab === ManageVersionsTabs.Changes && (
        <ChangesTab
          changesets={changesets ?? []}
          status={changesetStatus}
          stringsOverrides={stringsOverrides}
        />
      )}
    </div>
  );
};
