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
  subRowsLoaded: boolean;
};

const isNamedVersion = (
  obj: VersionTableData | Changeset
): obj is VersionTableData => {
  return "version" in obj;
};

const VersionsTab = (props: VersionsTabProps) => {
  const {
    status,
    onVersionUpdated,
    loadMoreVersions,
    onViewClick,
    tableData,
    subRowsLoaded,
  } = props;

  const { stringsOverrides } = useConfig();

  const [currentVersion, setCurrentVersion] = React.useState<
    NamedVersion | undefined
  >(undefined);
  const [isUpdateVersionModalOpen, setIsUpdateVersionModalOpen] =
    React.useState(false);

  const renderDateColumn = React.useMemo(
    () => (row: VersionTableData | Changeset) => {
      if (isNamedVersion(row)) {
        return (
          <Text>
            {new Date((row.version as any)["createdDateTime"]).toLocaleString()}
          </Text>
        );
      } else if (subRowsLoaded) {
        return (
          <Text>{new Date((row as any)["pushDateTime"]).toLocaleString()}</Text>
        );
      }
      return <Text isSkeleton={true}>Loading Date</Text>;
    },
    [subRowsLoaded]
  );

  const generateCellContent = React.useMemo(
    () => (row: VersionTableData | Changeset, columnAccessor: string) => {
      if (
        columnAccessor === "createdDateTime" ||
        columnAccessor === "pushDateTime"
      ) {
        return renderDateColumn(row);
      }
      if (isNamedVersion(row)) {
        return <Text>{(row.version as any)[columnAccessor]}</Text>;
      } else if (subRowsLoaded) {
        return <Text>{(row as any)[columnAccessor]}</Text>;
      }
      return <Text isSkeleton={true}>Loading {columnAccessor}</Text>;
    },
    [subRowsLoaded]
  );

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
              const columnAccessor = isNamedVersion(props.row.original)
                ? "name"
                : "displayName";
              return generateCellContent(props.row.original, columnAccessor);
            },
          },
          {
            id: "DESCRIPTION",
            Header: stringsOverrides.description,
            accessor: "description",
            Cell: (props: CellProps<VersionTableData | Changeset>) => {
              return generateCellContent(props.row.original, "description");
            },
          },
          {
            id: "CREATOR",
            Header: stringsOverrides.user ?? "User",
            accessor: "createdBy",
            maxWidth: 220,
            Cell: (props: CellProps<VersionTableData | Changeset>) => {
              const createdBy = isNamedVersion(props.row.original)
                ? props.row.original.version.createdBy
                : props.row.original.createdBy;
              return createdBy !== "" ? (
                <Text>{createdBy}</Text>
              ) : (
                <Text isSkeleton={true}>Loading user info</Text>
              );
            },
          },
          {
            id: "CREATED_DATE",
            Header: stringsOverrides.time,
            accessor: "createdDateTime",
            maxWidth: 220,
            Cell: (props: CellProps<VersionTableData | Changeset>) => {
              const columnAccessor = isNamedVersion(props.row.original)
                ? "createdDateTime"
                : "pushDateTime";
              return generateCellContent(props.row.original, columnAccessor);
            },
          },
          {
            id: "versions-table-actions",
            width: 62,
            Cell: (props: CellProps<VersionTableData>) => {
              return (
                <>
                  {isNamedVersion(props.row.original) ? (
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
      tableColumns[0].columns.splice(4, 0, {
        id: "versions-table-view",
        width: 100,
        Cell: (props: CellProps<VersionTableData>) => {
          return isNamedVersion(props.row.original) ? (
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
    stringsOverrides.name,
    stringsOverrides.description,
    stringsOverrides.user,
    stringsOverrides.time,
    stringsOverrides.updateNamedVersion,
    stringsOverrides.view,
    onViewClick,
    generateCellContent,
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
