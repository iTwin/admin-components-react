/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./VersionsTab.scss";

import { SvgEdit } from "@itwin/itwinui-icons-react";
import { IconButton, Table, Text } from "@itwin/itwinui-react";
import React from "react";
import { CellProps } from "react-table";

import { useConfig } from "../../../common/configContext";
import { Changeset, NamedVersion, VersionTableData } from "../../../models";
import { UpdateVersionModal } from "../../CreateUpdateVersion/UpdateVersionModal/UpdateVersionModal";
import { RequestStatus } from "../types";

export type VersionsTabProps = {
  status: RequestStatus;
  onVersionUpdated: () => void;
  loadMoreVersions: () => void;
  onViewClick?: (version: NamedVersion) => void;
  tableData: VersionTableData[];
};

const VersionsTab = (props: VersionsTabProps) => {
  const { status, onVersionUpdated, loadMoreVersions, onViewClick, tableData } =
    props;

  const { stringsOverrides } = useConfig();

  const [currentVersion, setCurrentVersion] = React.useState<
    NamedVersion | undefined
  >(undefined);
  const [isUpdateVersionModalOpen, setIsUpdateVersionModalOpen] =
    React.useState(false);

  const columns = React.useMemo(() => {
    const tableColumns = [
      {
        Header: "Name",
        columns: [
          {
            id: "NAME",
            Header: stringsOverrides.name,
            accessor: "name",
            Cell: (props: CellProps<VersionTableData | Changeset>) => {
              return (
                <Text>
                  {"version" in props.row.original
                    ? props.row.original.version.name
                    : props.row.original.displayName}
                </Text>
              );
            },
          },
          {
            id: "DESCRIPTION",
            Header: stringsOverrides.description,
            accessor: "description",
            Cell: (props: CellProps<VersionTableData | Changeset>) => {
              return (
                <Text>
                  {"version" in props.row.original
                    ? props.row.original.version.description
                    : props.row.original.description}
                </Text>
              );
            },
          },
          {
            id: "CREATED_DATE",
            Header: stringsOverrides.time,
            accessor: "createdDateTime",
            maxWidth: 220,
            Cell: (props: CellProps<VersionTableData | Changeset>) => {
              return (
                <span>
                  {new Date(
                    "version" in props.row.original
                      ? props.row.original.version.createdDateTime
                      : props.row.original.pushDateTime
                  ).toLocaleString()}
                </span>
              );
            },
          },
          {
            id: "versions-table-actions",
            width: 62,
            Cell: (props: CellProps<VersionTableData>) => {
              return (
                <>
                  {"version" in props.row.original ? (
                    <IconButton
                      onClick={() => {
                        setCurrentVersion(props.row.original.version);
                        setIsUpdateVersionModalOpen(true);
                      }}
                      title={stringsOverrides.updateNamedVersion}
                      styleType="borderless"
                    >
                      <SvgEdit />
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </>
              );
            },
          },
        ],
      },
    ];
    if (onViewClick) {
      tableColumns[0].columns.splice(3, 0, {
        id: "versions-table-view",
        width: 100,
        Cell: (props: CellProps<VersionTableData>) => {
          return "version" in props.row.original ? (
            <span
              className="iui-anchor"
              onClick={() => onViewClick(props.row.original.version)}
            >
              {stringsOverrides.view}
            </span>
          ) : (
            <></>
          );
        },
      });
    }
    return tableColumns;
  }, [
    onViewClick,
    stringsOverrides.description,
    stringsOverrides.name,
    stringsOverrides.time,
    stringsOverrides.updateNamedVersion,
    stringsOverrides.view,
  ]);

  const emptyTableContent = React.useMemo(() => {
    return status === RequestStatus.Failed
      ? stringsOverrides.messageFailedGetNamedVersions
      : stringsOverrides.messageNoNamedVersions;
  }, [
    status,
    stringsOverrides.messageFailedGetNamedVersions,
    stringsOverrides.messageNoNamedVersions,
  ]);

  return (
    <>
      <Table<VersionTableData>
        columns={columns}
        data={tableData}
        isLoading={
          status === RequestStatus.InProgress ||
          status === RequestStatus.NotStarted
        }
        emptyTableContent={emptyTableContent}
        onBottomReached={loadMoreVersions}
        className="iac-versions-table"
      />
      {isUpdateVersionModalOpen && (
        <UpdateVersionModal
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          version={currentVersion!}
          onUpdate={() => {
            setIsUpdateVersionModalOpen(false);
            onVersionUpdated();
          }}
          onClose={() => setIsUpdateVersionModalOpen(false)}
        />
      )}
    </>
  );
};

export default VersionsTab;
