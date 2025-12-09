/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ChangesTab.scss";

import {
  SvgInfoCircular,
  SvgNamedVersionAdd,
} from "@itwin/itwinui-icons-react";
import { IconButton, Table, tableFilters, Text } from "@itwin/itwinui-react";
import { CellProps } from "@itwin/itwinui-react/react-table";
import React from "react";

import { useConfig } from "../../../common/configContext";
import {
  Changeset,
  localeDateWithTimeFormat,
  NamedVersion,
} from "../../../models";
import { CreateVersionModal } from "../../CreateUpdateVersion/CreateVersionModal/CreateVersionModal";
import { ChangesetInformationPanel } from "../../InformationPanel/ChangesetInformationPanel";
import { RequestStatus } from "../types";

export type ChangesTabProps = {
  changesets: Changeset[];
  status: RequestStatus;
  loadMoreChanges: () => void;
  onVersionCreated: () => void;
  latestVersion: NamedVersion | undefined;
  onFilterChange: (filters: { id: string; value: any }[]) => void;
  afterIndex?: number;
  lastIndex?: number;
};

const ChangesTab = (props: ChangesTabProps) => {
  const {
    changesets,
    status,
    loadMoreChanges,
    onVersionCreated,
    latestVersion,
    onFilterChange,
    afterIndex,
    lastIndex,
  } = props;

  const { stringsOverrides } = useConfig();

  const [isCreateVersionModalOpen, setIsCreateVersionModalOpen] =
    React.useState(false);

  const [currentChangeset, setCurrentChangeset] = React.useState<
    Changeset | undefined
  >(undefined);

  const [isInfoPanelOpen, setIsInfoPanelOpen] = React.useState(false);

  const canCreateVersion = React.useCallback((changeset: Changeset) => {
    return !changeset._links.namedVersion;
  }, []);

  const handleInfoPanelOpen = (changeSet: Changeset) => {
    setCurrentChangeset(changeSet);
    setIsInfoPanelOpen(true);
  };

  const columns = React.useMemo(() => {
    return [
      {
        Header: "Name",
        columns: [
          {
            id: "index",
            Header: "#",
            accessor: "index",
            width: 90,
            Filter: tableFilters.NumberRangeFilter(),
            filter: "between",
          },
          {
            id: "DESCRIPTION",
            Header: stringsOverrides.description,
            accessor: "description",
          },
          {
            id: "CREATOR",
            Header: stringsOverrides.user ?? "User",
            accessor: "createdBy",
            maxWidth: 220,
            Cell: (props: CellProps<Changeset>) => {
              return props.row.original.createdBy !== "" ? (
                <Text>{props.row.original.createdBy}</Text>
              ) : (
                <Text isSkeleton={true}>Loading user info</Text>
              );
            },
          },
          {
            id: "CHANGED_FILES",
            Header: stringsOverrides.changedFiles,
            Cell: (props: CellProps<Changeset>) => {
              const changedFiles =
                props.row.original.synchronizationInfo?.changedFiles;
              return changedFiles?.length ? changedFiles.join(", ") : "";
            },
          },
          {
            id: "PUSH_DATE",
            Header: stringsOverrides.time,
            accessor: "pushDateTime",
            maxWidth: 220,
            Cell: (props: CellProps<Changeset>) => {
              return (
                <span>
                  {localeDateWithTimeFormat(
                    new Date(props.row.original.pushDateTime)
                  )}
                </span>
              );
            },
          },
          {
            id: "changes-table-actions",
            width: 100,
            cellClassName: "iac-changes-tab-actions",
            Cell: (props: CellProps<Changeset>) => {
              const changeset = props.data[props.row.index];
              const className = canCreateVersion(changeset)
                ? ""
                : "iac-create-version-icon-hidden";
              return (
                <>
                  <IconButton
                    onClick={() => {
                      setCurrentChangeset(changeset);
                      setIsCreateVersionModalOpen(true);
                    }}
                    label={stringsOverrides.createNamedVersion}
                    styleType="borderless"
                    className={className}
                    size="small"
                  >
                    <SvgNamedVersionAdd />
                  </IconButton>
                  <IconButton
                    label={
                      stringsOverrides.informationPanel ?? "Information Panel"
                    }
                    styleType="borderless"
                    onClick={() => handleInfoPanelOpen(changeset)}
                    size="small"
                  >
                    <SvgInfoCircular />
                  </IconButton>
                </>
              );
            },
          },
        ],
      },
    ];
  }, [
    stringsOverrides.description,
    stringsOverrides.user,
    stringsOverrides.changedFiles,
    stringsOverrides.time,
    stringsOverrides.createNamedVersion,
    stringsOverrides.informationPanel,
    canCreateVersion,
  ]);

  const emptyTableContent = React.useMemo(() => {
    return status === RequestStatus.Failed
      ? stringsOverrides.messageFailedGetChanges
      : stringsOverrides.messageNoChanges;
  }, [
    status,
    stringsOverrides.messageFailedGetChanges,
    stringsOverrides.messageNoChanges,
  ]);

  const initialFilters = React.useMemo(() => {
    const filterArray = [];
    if (afterIndex !== undefined || lastIndex !== undefined) {
      const fromValue = afterIndex !== undefined ? afterIndex + 1 : undefined;
      filterArray.push({ id: "index", value: [fromValue, lastIndex] });
    }
    return filterArray;
  }, [afterIndex, lastIndex]);

  return (
    <>
      <Table<Changeset>
        columns={columns}
        data={changesets}
        enableVirtualization={true}
        manualFilters={true}
        onFilter={onFilterChange}
        bodyProps={{
          className: "iac-changes-table-body",
        }}
        isLoading={
          status === RequestStatus.InProgress ||
          status === RequestStatus.NotStarted
        }
        emptyTableContent={emptyTableContent}
        emptyFilteredTableContent={stringsOverrides.messageNoFilterResults}
        onBottomReached={loadMoreChanges}
        className="iac-changes-table"
        initialState={{ filters: initialFilters }}
      />
      {isCreateVersionModalOpen && (
        <CreateVersionModal
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          changeset={currentChangeset!}
          onCreate={() => {
            setIsCreateVersionModalOpen(false);
            onVersionCreated();
          }}
          onClose={() => setIsCreateVersionModalOpen(false)}
          latestVersion={latestVersion}
        />
      )}
      {isInfoPanelOpen && currentChangeset && (
        <ChangesetInformationPanel
          changeset={currentChangeset}
          onClose={() => setIsInfoPanelOpen(false)}
          stringOverrides={stringsOverrides.informationPanelStringOverrides}
        />
      )}
    </>
  );
};

export default ChangesTab;
