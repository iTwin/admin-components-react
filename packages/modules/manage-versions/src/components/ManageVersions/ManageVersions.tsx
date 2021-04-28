/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { HorizontalTabs } from "@itwin/itwinui-react";
import React from "react";

import { ChangesetClient } from "../../clients/changesetClient";
import { NamedVersionClient } from "../../clients/namedVersionClient";
import { Changeset } from "../../models/changeset";
import { NamedVersion } from "../../models/namedVersion";
import ChangesTab from "./ChangesTab/ChangesTab";
import { RequestStatus } from "./types";
import VersionsTab from "./VersionsTab/VersionsTab";

export type ManageVersionsProps = {
  /** Access token that requires the `imodels:read` scope. */
  accessToken: string;
  /** Environment: `DEV` or `QA`. Default is production. */
  environment?: string;
  /** Id of iModel. */
  imodelId: string;
};

enum ManageVersionsTabs {
  Version = 0,
  Changes = 1,
}

export const ManageVersions = (props: ManageVersionsProps) => {
  const { accessToken, environment, imodelId } = props;

  const versionClient = React.useMemo(
    () => new NamedVersionClient(accessToken, environment),
    [accessToken, environment]
  );
  const changesetClient = React.useMemo(
    () => new ChangesetClient(accessToken, environment),
    [accessToken, environment]
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
      .catch((e) => {
        setVersionStatus(RequestStatus.Failed);
        console.log(e);
      });
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
        .catch((e) => {
          setChangesetStatus(RequestStatus.Failed);
          console.log(e);
        });
    }
  }, [changesetClient, changesetStatus, currentTab, imodelId]);

  return (
    <div>
      <HorizontalTabs
        labels={["Named Versions", "Changes"]}
        activeIndex={currentTab}
        onTabSelected={(index) => setCurrentTab(index)}
        type="borderless"
      />
      {currentTab === ManageVersionsTabs.Version && (
        <VersionsTab versions={versions ?? []} status={versionStatus} />
      )}
      {currentTab === ManageVersionsTabs.Changes && (
        <ChangesTab changesets={changesets ?? []} status={changesetStatus} />
      )}
    </div>
  );
};
