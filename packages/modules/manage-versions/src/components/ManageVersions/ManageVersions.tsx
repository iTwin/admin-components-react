/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { HorizontalTabs, ThemeProvider } from "@itwin/itwinui-react";
import React from "react";

import { ChangesetClient } from "../../clients/changesetClient";
import { NamedVersionClient } from "../../clients/namedVersionClient";
import { ConfigProvider } from "../../common/configContext";
import {
  Changeset,
  informationPanelDefaultStrings,
  NamedVersion,
  VersionTableData,
} from "../../models";
import ChangesTab from "./ChangesTab/ChangesTab";
import {
  ApiOverrides,
  LogFunc,
  ManageVersionsStringOverrides,
  RequestStatus,
} from "./types";
import VersionsTab from "./VersionsTab/VersionsTab";

export const defaultStrings: ManageVersionsStringOverrides = {
  namedVersions: "Named Versions",
  changes: "Changes",
  name: "Name",
  description: "Description",
  time: "Time",
  changedFiles: "Changed Files",
  createNamedVersion: "Create a Named Version",
  user: "User",
  informationPanel: "Information Panel",
  cancel: "Cancel",
  create: "Create",
  updateNamedVersion: "Update a Named Version",
  update: "Update",
  view: "View",
  messageFailedGetNamedVersions:
    "Could not get Named Versions. Please try again later.",
  messageNoNamedVersions:
    "There are no Named Versions created. To create first go to Changes.",
  messageFailedGetChanges: "Could not get changes. Please try again later.",
  messageNoChanges: "There are no changes synchronized.",
  messageVersionCreated: 'Named Version "{{name}}" was successfully created.',
  messageVersionNameExists: "Named Version with the same name already exists.",
  messageInsufficientPermissionsToCreateVersion:
    "You do not have the required permissions to create a Named Version.",
  messageCouldNotCreateVersion:
    "Could not create a Named Version. Please try again later.",
  messageVersionUpdated: 'Named Version "{{name}}" was successfully updated.',
  messageInsufficientPermissionsToUpdateVersion:
    "You do not have the required permissions to update a Named Version.",
  messageCouldNotUpdateVersion:
    "Could not update a Named Version. Please try again later.",
  messageValueTooLong: "The value exceeds allowed {{length}} characters.",
  informationPanelStringOverrides: informationPanelDefaultStrings,
};

export type ManageVersionsProps = {
  /** Access token that requires the `imodels:modify` scope. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: ApiOverrides;
  /** Id of iModel. */
  imodelId: string;
  /** Strings overrides for localization. */
  stringsOverrides?: ManageVersionsStringOverrides;
  /** Method that logs inner component errors. */
  log?: LogFunc;
  /** Callback when view Named Version is clicked. If not present, then `View` won't be shown. */
  onViewClick?: (version: NamedVersion) => void;
  /** Sets current tab.
   * @default ManageVersionsTabs.Versions
   */
  currentTab?: ManageVersionsTabs;
  /** Callback when tabs are switched. */
  onTabChange?: (tab: ManageVersionsTabs) => void;
};

export enum ManageVersionsTabs {
  Versions = 0,
  Changes = 1,
}

const NAMED_VERSION_TOP = 100;
const CHANGESET_TOP = 100;

const initialChangeset: Changeset = {
  id: "",
  index: 0,
  displayName: "",
  description: "",
  pushDateTime: "",
  synchronizationInfo: { changedFiles: [] },
  _links: {},
  creatorId: "",
  createdBy: "",
  application: { id: "", name: "" },
};

export const ManageVersions = (props: ManageVersionsProps) => {
  const {
    accessToken,
    apiOverrides,
    imodelId,
    stringsOverrides = defaultStrings,
    log,
    onViewClick,
    currentTab = ManageVersionsTabs.Versions,
    onTabChange,
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

  const [_currentTab, setCurrentTab] = React.useState(currentTab);

  const usersRef = React.useRef<{ [key: string]: string } | undefined>(
    undefined
  );
  const shouldPerformVersionMapping = React.useRef<boolean>(false);
  const getUsers = React.useCallback(async () => {
    const users = await changesetClient.getUsers(imodelId);
    const userMapData = users.reduce((acc, user) => {
      const userFullName = [user.givenName, user.surname].filter(Boolean);
      acc[user.id] = userFullName.length
        ? userFullName.join(" ")
        : user.displayName;
      return acc;
    }, {} as { [key: string]: string });
    usersRef.current = userMapData;
  }, []);

  React.useEffect(() => {
    setCurrentTab(currentTab);
  }, [currentTab]);

  const [versions, setVersions] = React.useState<NamedVersion[]>();
  const [versionStatus, setVersionStatus] = React.useState(
    RequestStatus.NotStarted
  );

  const [changesets, setChangesets] = React.useState<Changeset[]>();
  const [changesetStatus, setChangesetStatus] = React.useState(
    RequestStatus.NotStarted
  );

  const [versionsTableData, setVersionsTableData] =
    React.useState<VersionTableData[]>();
  const [subRowsLoaded, setSubRowsLoaded] = React.useState<boolean>(false);

  const changeTab = React.useCallback(
    (tab: ManageVersionsTabs) => {
      setCurrentTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange]
  );

  const getVersions = React.useCallback(
    (skip?: number) => {
      setVersionStatus(RequestStatus.InProgress);
      versionClient
        .get(imodelId, {
          top: NAMED_VERSION_TOP,
          skip,
        })
        .then((newVersions) => {
          setVersions((oldVersions) => [
            ...(oldVersions ?? []),
            ...newVersions,
          ]);
          shouldPerformVersionMapping.current = true;
          setVersionStatus(RequestStatus.Finished);
        })
        .catch(() => setVersionStatus(RequestStatus.Failed));
    },
    [imodelId, versionClient]
  );

  const getMoreVersions = React.useCallback(() => {
    if (versions && versions.length % NAMED_VERSION_TOP !== 0) {
      return;
    }

    getVersions(versions?.length);
  }, [getVersions, versions]);

  const refreshVersions = React.useCallback(() => {
    setVersions(undefined);
    setVersionsTableData(undefined);
    setChangesets(undefined);
    getVersions();
    getChangesets();
  }, [getVersions]);

  const updateNamedVersionsProperties = (versionsToUpdate: NamedVersion[]) => {
    if (!versionsToUpdate.length) {
      return;
    }
    const updatedNamedVersion = versionsToUpdate.map((newVersion) => {
      const creatorId = newVersion._links.creator.href.substring(
        newVersion._links.creator.href.lastIndexOf("/") + 1
      );
      return {
        ...newVersion,
        createdBy: usersRef.current?.[creatorId] ?? "",
      };
    });
    setVersions(updatedNamedVersion);
    return updatedNamedVersion;
  };

  const updateChangesetsProperties = (changesetsToUpdate: Changeset[]) => {
    if (!changesetsToUpdate.length) {
      return;
    }
    const updatedChangeset = changesetsToUpdate.map((changeSet) => ({
      ...changeSet,
      createdBy: usersRef.current?.[changeSet.creatorId] ?? "",
    }));
    setChangesets(updatedChangeset);
    shouldPerformVersionMapping.current = true;
  };

  const mapChangesetsToNamedVersions = React.useCallback(() => {
    const updatedNamedVersion = updateNamedVersionsProperties(versions ?? []);
    // Update versionsTableData
    const tableData = (updatedNamedVersion ?? []).map((version) => {
      const relatedChangesets: Changeset[] = [];
      if (changesets) {
        for (const change of changesets) {
          if (
            (change.index === version.changesetIndex &&
              change._links.namedVersion !== null) ||
            (change.index < version.changesetIndex &&
              change._links.namedVersion === null)
          ) {
            relatedChangesets.push(change);
          } else if (
            change.index < version.changesetIndex &&
            change._links.namedVersion !== null
          ) {
            break;
          }
        }
        setSubRowsLoaded(true);
        return { version: version, subRows: relatedChangesets };
      }
      setSubRowsLoaded(false);
      return { version: version, subRows: [initialChangeset] };
    });

    setVersionsTableData(tableData);
  }, [changesets, versions]);

  React.useEffect(() => {
    const loadUsers = async () => {
      await getUsers();
    };
    if (!usersRef.current) {
      loadUsers()
        .then(() => {
          updateNamedVersionsProperties(versions ?? []);
          updateChangesetsProperties(changesets ?? []);
        })
        .catch(() => {
          console.error("unable to fetch users data");
        });
    }
  }, [changesets, getUsers, versions]);

  const getChangesets = React.useCallback(() => {
    if (changesets && changesets.length % CHANGESET_TOP !== 0) {
      return;
    }

    setChangesetStatus(RequestStatus.InProgress);
    changesetClient
      .get(imodelId, {
        top: CHANGESET_TOP,
        skip: changesets?.length,
      })
      .then((newChangesets) => {
        setChangesets([...(changesets ?? []), ...newChangesets]);
        updateChangesetsProperties(newChangesets);
        setChangesetStatus(RequestStatus.Finished);
      })
      .catch(() => setChangesetStatus(RequestStatus.Failed));
  }, [changesets, changesetClient, imodelId]);

  React.useEffect(() => {
    if (versionStatus === RequestStatus.NotStarted) {
      getVersions();
      getChangesets();
    }
  }, [getChangesets, getVersions, versionStatus]);

  React.useEffect(() => {
    if (shouldPerformVersionMapping.current) {
      mapChangesetsToNamedVersions();
      shouldPerformVersionMapping.current = false;
    }
  }, [shouldPerformVersionMapping.current]);

  React.useEffect(() => {
    if (
      _currentTab === ManageVersionsTabs.Changes &&
      changesetStatus === RequestStatus.NotStarted
    ) {
      getChangesets();
    }
  }, [changesetStatus, _currentTab, getChangesets]);

  const onVersionCreated = React.useCallback(() => {
    changeTab(ManageVersionsTabs.Versions);
    refreshVersions();
    setChangesetStatus(RequestStatus.NotStarted);
  }, [changeTab, refreshVersions]);

  const latestVersion = React.useMemo(
    () =>
      [...(versions ?? [])].sort((v1, v2) =>
        new Date(v1.createdDateTime).valueOf() <
        new Date(v2.createdDateTime).valueOf()
          ? 1
          : -1
      )[0],
    [versions]
  );

  return (
    <ThemeProvider theme="inherit">
      <ConfigProvider
        accessToken={accessToken}
        imodelId={imodelId}
        apiOverrides={apiOverrides}
        stringsOverrides={stringsOverrides}
        log={log}
      >
        <div>
          <HorizontalTabs
            labels={[stringsOverrides.namedVersions, stringsOverrides.changes]}
            activeIndex={_currentTab}
            onTabSelected={(index) => changeTab(index)}
            type="borderless"
          />
          {_currentTab === ManageVersionsTabs.Versions && (
            <VersionsTab
              status={versionStatus}
              onVersionUpdated={refreshVersions}
              loadMoreVersions={getMoreVersions}
              onViewClick={onViewClick}
              tableData={versionsTableData ?? []}
              subRowsLoaded={subRowsLoaded}
            />
          )}
          {_currentTab === ManageVersionsTabs.Changes && (
            <ChangesTab
              changesets={changesets ?? []}
              status={changesetStatus}
              loadMoreChanges={getChangesets}
              onVersionCreated={onVersionCreated}
              latestVersion={latestVersion}
            />
          )}
        </div>
      </ConfigProvider>
    </ThemeProvider>
  );
};
