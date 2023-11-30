/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./VersionsTab.scss";

import { SvgEdit } from "@itwin/itwinui-icons-react";
import { IconButton, Table, Text } from "@itwin/itwinui-react";
import React from "react";
import { CellProps } from "react-table";

import { ChangesetClient } from "../../../clients/changesetClient";
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
  changesetClient: ChangesetClient;
  setRelatedChangesets: (versionId: string, changesets: Changeset[]) => void;
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
    changesetClient,
    setRelatedChangesets,
  } = props;

  const { stringsOverrides, imodelId } = useConfig();

  const [currentVersion, setCurrentVersion] = React.useState<
    NamedVersion | undefined
  >(undefined);
  const [isUpdateVersionModalOpen, setIsUpdateVersionModalOpen] =
    React.useState(false);

  async function fetchIncludedChangesets(lastIndex: number) {
    try {
      return await changesetClient.get(imodelId, {
        top: 10,
        lastIndex: lastIndex,
      });
    } catch (error) {
      throw error;
    }
  }

  const renderDateColumn = React.useMemo(
    () => (row: VersionTableData | Changeset) => {
      if (isNamedVersion(row)) {
        return (
          <Text>
            {new Date(row.version["createdDateTime"]).toLocaleString()}
          </Text>
        );
      } else {
        const content = row["pushDateTime"];
        return content !== "" ? (
          <Text>{new Date(row["pushDateTime"]).toLocaleString()}</Text>
        ) : (
          <Text isSkeleton={true}>Loading Date</Text>
        );
      }
    },
    []
  );

  const generateCellContent = React.useMemo(
    () =>
      (
        row: VersionTableData | Changeset,
        columnAccessor: keyof NamedVersion | keyof Changeset
      ) => {
        if (["createdDateTime", "pushDateTime"].includes(columnAccessor)) {
          return renderDateColumn(row);
        }

        if (isNamedVersion(row)) {
          return (
            <Text>{row.version[columnAccessor as keyof NamedVersion]}</Text>
          );
        } else {
          const cellContent = row[columnAccessor as keyof Changeset];
          return cellContent !== "" ? (
            <Text>{cellContent}</Text>
          ) : (
            <Text isSkeleton={true}>Loading</Text>
          );
        }
      },
    [renderDateColumn]
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

  const onExpandRow = (row?: VersionTableData[]) => {
    row?.forEach((r) => {
      if (!r.subRowsLoaded) {
        fetchIncludedChangesets(r.version.changesetIndex)
          .then((changesets) => {
            const relatedChangesets: Changeset[] = [];
            if (changesets !== undefined) {
              for (const change of changesets) {
                if (
                  (change.index === r.version.changesetIndex &&
                    change._links.namedVersion !== null) ||
                  (change.index < r.version.changesetIndex &&
                    change._links.namedVersion === null)
                ) {
                  relatedChangesets.push(change);
                } else if (
                  change.index < r.version.changesetIndex &&
                  change._links.namedVersion !== null
                ) {
                  break;
                }
              }
            }
            setRelatedChangesets(r.version.id ?? "", relatedChangesets);
          })
          .catch(() => {
            console.error("Failed to get Changesets");
          });
      }
    });
  };

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
        onExpand={onExpandRow}
        autoResetExpanded={false}
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
