/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Flex, Tabs, ThemeProvider, ToggleSwitch } from "@itwin/itwinui-react";
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
  download: "Download",
  hide: "Hide",
  unhide: "Unhide",
  More: "More",
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
  messageFileDownloadInProgress: "Downloading file...",
  messageCouldNotDownloadedFileSuccessfully: "Unable to download file.",
  messageInsufficientPermissionsToUpdateVersion:
    "You do not have the required permissions to update a Named Version.",
  messageCouldNotUpdateVersion:
    "Could not update a Named Version. Please try again later.",
  messageValueTooLong: "The value exceeds allowed {{length}} characters.",
  informationPanelStringOverrides: informationPanelDefaultStrings,
  showHiddenVersions: "Show hidden versions",
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

const initializeVersionTableData = (
  versions: NamedVersion[],
  versionTableData?: VersionTableData[],
  reloadSubrows?: boolean
): VersionTableData[] => {
  return (versions ?? []).map((version, index) => {
    const existingData = versionTableData?.[index];
    const defaultSubRows = reloadSubrows
      ? [initialChangeset]
      : existingData?.subRows ?? [initialChangeset];
    const subRowsLoaded = reloadSubrows
      ? false
      : existingData?.subRowsLoaded ?? false;
    return { version, subRows: defaultSubRows, subRowsLoaded };
  });
};

const updateNamedVersionsProperties = (
  versionsToUpdate: NamedVersion[],
  users: { [key: string]: string } | undefined
) => {
  if (!versionsToUpdate.length) {
    return;
  }
  return versionsToUpdate.map((newVersion) => {
    const creatorId = newVersion._links.creator.href.substring(
      newVersion._links.creator.href.lastIndexOf("/") + 1
    );
    return {
      ...newVersion,
      createdBy: users?.[creatorId] ?? "",
    };
  });
};

const updateChangesetsProperties = (
  changesetsToUpdate: Changeset[],
  users: { [key: string]: string } | undefined
) => {
  if (!changesetsToUpdate.length) {
    return;
  }
  return changesetsToUpdate.map((changeSet) => ({
    ...changeSet,
    createdBy: users?.[changeSet.creatorId] ?? "",
  }));
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
  }, [changesetClient, imodelId]);

  React.useEffect(() => {
    setCurrentTab(currentTab);
  }, [currentTab]);

  const [versionsTableData, setVersionsTableData] =
    React.useState<VersionTableData[]>();
  const [versionStatus, setVersionStatus] = React.useState(
    RequestStatus.NotStarted
  );

  const [changesets, setChangesets] = React.useState<Changeset[]>();
  const [changesetStatus, setChangesetStatus] = React.useState(
    RequestStatus.NotStarted
  );

  const changeTab = React.useCallback(
    (tab: ManageVersionsTabs) => {
      setCurrentTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange]
  );

  const getVersions = React.useCallback(
    (skip?: number, reloadSubrows?: boolean) => {
      setVersionStatus(RequestStatus.InProgress);
      versionClient
        .get(imodelId, {
          top: NAMED_VERSION_TOP,
          skip,
        })
        .then((newVersions) => {
          newVersions.sort((v1, v2) => v2.changesetIndex - v1.changesetIndex);
          const updateVersions = updateNamedVersionsProperties(
            newVersions,
            usersRef.current
          );
          setVersionsTableData((oldVersions) => [
            ...initializeVersionTableData(
              updateVersions ?? [],
              oldVersions,
              reloadSubrows
            ),
          ]);
          setVersionStatus(RequestStatus.Finished);
        })
        .catch(() => setVersionStatus(RequestStatus.Failed));
    },
    [imodelId, versionClient]
  );

  const getMoreVersions = React.useCallback(() => {
    if (
      versionsTableData &&
      versionsTableData.length % NAMED_VERSION_TOP !== 0
    ) {
      return;
    }

    getVersions(versionsTableData?.length);
  }, [getVersions, versionsTableData]);

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
        setChangesets([
          ...(changesets ?? []),
          ...(updateChangesetsProperties(newChangesets, usersRef.current) ??
            []),
        ]);
        setChangesetStatus(RequestStatus.Finished);
      })
      .catch(() => setChangesetStatus(RequestStatus.Failed));
  }, [changesets, changesetClient, imodelId]);

  const refreshVersions = React.useCallback(
    (reloadSubrows?: boolean) => {
      getVersions(undefined, reloadSubrows);
    },
    [getVersions]
  );

  React.useEffect(() => {
    const loadUsers = async () => {
      await getUsers();
    };
    if (!usersRef.current) {
      loadUsers()
        .then(() => {
          const updatedVersionsTableData = versionsTableData?.map((td) => {
            const updatedVersion = updateNamedVersionsProperties(
              [td.version],
              usersRef.current
            );
            return {
              ...td,
              version: updatedVersion ? updatedVersion[0] : td.version,
            };
          });
          if (updatedVersionsTableData) {
            setVersionsTableData(updatedVersionsTableData);
          }
          setChangesets((prevChangesets) => [
            ...(updateChangesetsProperties(
              changesets ?? [],
              usersRef.current
            ) ??
              prevChangesets ??
              []),
          ]);
        })
        .catch(() => {
          console.error("Unable to fetch users data");
        });
    }
  }, [changesets, getUsers, versionsTableData]);

  React.useEffect(() => {
    if (
      _currentTab === ManageVersionsTabs.Versions &&
      versionStatus === RequestStatus.NotStarted
    ) {
      getVersions();
    }
  }, [_currentTab, getVersions, versionStatus]);

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
    refreshVersions(true);
    setChangesets(undefined);
    setChangesetStatus(RequestStatus.NotStarted);
  }, [changeTab, refreshVersions]);

  const latestVersion = React.useMemo(
    () =>
      [...(versionsTableData ?? [])].sort((v1, v2) =>
        new Date(v1.version.createdDateTime).valueOf() <
        new Date(v2.version.createdDateTime).valueOf()
          ? 1
          : -1
      )[0],
    [versionsTableData]
  );

  const setRelatedChangesets = (versionId: string, changesets: Changeset[]) => {
    const updateChangesets =
      updateChangesetsProperties(changesets, usersRef.current) ?? [];
    setVersionsTableData((prevVersionsTableData) => {
      const updatedVersions = prevVersionsTableData?.map((version) =>
        version.version.id === versionId
          ? { ...version, subRows: updateChangesets, subRowsLoaded: true }
          : version
      );
      return updatedVersions ?? prevVersionsTableData;
    });
  };

  const [showHiddenVersions, setShowHiddenVersions] =
    React.useState<boolean>(false);

  const handleToggleVersionState = React.useCallback(
    async (version: NamedVersion) => {
      const newState = version.state === "hidden" ? "visible" : "hidden";
      try {
        await versionClient.updateState(imodelId, version.id, newState);
        setVersionsTableData((prevData) =>
          prevData?.map((data) =>
            data.version.id === version.id
              ? { ...data, version: { ...data.version, state: newState } }
              : data
          )
        );
      } catch (error) {
        console.error(`Failed to update version state: ${error}`);
      }
    },
    [versionClient, imodelId]
  );

  const filteredVersionsTableData = React.useMemo(() => {
    if (showHiddenVersions) {
      return (versionsTableData ?? []).filter(
        (data) => data.version.state === "hidden"
      );
    } else {
      return (versionsTableData ?? []).filter(
        (data) => data.version.state !== "hidden"
      );
    }
  }, [versionsTableData, showHiddenVersions]);

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
          <Flex>
            <Tabs
              labels={[
                stringsOverrides.namedVersions,
                stringsOverrides.changes,
              ]}
              activeIndex={_currentTab}
              onTabSelected={(index) => changeTab(index)}
              type="borderless"
              orientation="horizontal"
            />
            <Flex.Spacer />
            {_currentTab === ManageVersionsTabs.Versions && (
              <ToggleSwitch
                size="small"
                label={stringsOverrides.showHiddenVersions}
                checked={showHiddenVersions}
                onChange={() => setShowHiddenVersions(!showHiddenVersions)}
              />
            )}
          </Flex>
          {_currentTab === ManageVersionsTabs.Versions && (
            <VersionsTab
              status={versionStatus}
              onVersionUpdated={refreshVersions}
              loadMoreVersions={getMoreVersions}
              onViewClick={onViewClick}
              tableData={filteredVersionsTableData ?? []}
              changesetClient={changesetClient}
              setRelatedChangesets={setRelatedChangesets}
              handleHideVersion={handleToggleVersionState}
            />
          )}
          {_currentTab === ManageVersionsTabs.Changes && (
            <ChangesTab
              changesets={changesets ?? []}
              status={changesetStatus}
              loadMoreChanges={getChangesets}
              onVersionCreated={onVersionCreated}
              latestVersion={latestVersion?.version}
            />
          )}
        </div>
      </ConfigProvider>
    </ThemeProvider>
  );
};
