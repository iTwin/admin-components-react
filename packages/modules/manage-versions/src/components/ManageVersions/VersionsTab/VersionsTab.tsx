/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./VersionsTab.scss";

import {
  SvgDownload,
  SvgEdit,
  SvgVisibilityHide,
  SvgVisibilityShow,
} from "@itwin/itwinui-icons-react";
import {
  Anchor,
  Flex,
  Table,
  tableFilters,
  Text,
  Tooltip,
  useToaster,
} from "@itwin/itwinui-react";
import {
  ActionType,
  CellProps,
  TableInstance,
  TableState,
} from "@itwin/itwinui-react/react-table";
import React, { useCallback } from "react";

import { ChangesetClient } from "../../../clients/changesetClient";
import { useConfig } from "../../../common/configContext";
import {
  Changeset,
  localeDateWithTimeFormat,
  NamedVersion,
  VersionTableData,
} from "../../../models";
import { ContextMenu, MenuAction } from "../../contextMenu/ContextMenu";
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
  handleHideVersion: (version: NamedVersion) => void;
  showHiddenVersions: boolean;
  onFilterChange: (filters: { id: string; value: any }[]) => void;
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
    handleHideVersion,
    showHiddenVersions,
    onFilterChange,
  } = props;
  const toaster = useToaster();
  const { stringsOverrides, imodelId, enableHideVersions } = useConfig();

  const tableInstance = React.useRef<TableInstance<VersionTableData>>();
  const collapseAllRows = useCallback(() => {
    if (tableInstance.current) {
      tableInstance.current.toggleAllRowsExpanded(false);
    }
  }, []);

  React.useEffect(() => {
    collapseAllRows();
  }, [collapseAllRows, showHiddenVersions]);

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

  const onDownloadClick = useCallback(
    async (changesetIndex: number) => {
      toaster.closeAll();
      try {
        const checkpointInfo = await changesetClient.getChangesetCheckpoint(
          imodelId,
          changesetIndex
        );
        const downloadUrl = checkpointInfo._links.download.href;
        window.open(downloadUrl, "_blank", "noopener,noreferrer");
        toaster.informational(stringsOverrides.messageFileDownloadInProgress, {
          hasCloseButton: true,
          duration: 2000,
        });
      } catch (error) {
        toaster.negative(
          stringsOverrides.messageCouldNotDownloadedFileSuccessfully,
          {
            hasCloseButton: true,
          }
        );
      }
    },
    [
      changesetClient,
      imodelId,
      stringsOverrides.messageCouldNotDownloadedFileSuccessfully,
      stringsOverrides.messageFileDownloadInProgress,
      toaster,
    ]
  );

  const renderDateColumn = React.useMemo(
    () => (row: VersionTableData | Changeset) => {
      if (isNamedVersion(row)) {
        return (
          <Text>
            {localeDateWithTimeFormat(new Date(row.version["createdDateTime"]))}
          </Text>
        );
      } else {
        const content = row["pushDateTime"];
        return content !== "" ? (
          <Text>{localeDateWithTimeFormat(new Date(row["pushDateTime"]))}</Text>
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
          const cellContent = row.version[columnAccessor as keyof NamedVersion];
          return <Text>{cellContent as React.ReactNode}</Text>;
        } else {
          const cellContent = row[columnAccessor as keyof Changeset];
          return cellContent !== "" ? (
            <Text>{cellContent as React.ReactNode}</Text>
          ) : (
            <Text isSkeleton={true}>Loading</Text>
          );
        }
      },
    [renderDateColumn]
  );

  const toggleVersionState = useCallback(
    (version: NamedVersion) => {
      collapseAllRows();
      handleHideVersion(version);
    },
    [handleHideVersion, collapseAllRows]
  );

  const getToolbarActions = useCallback(
    (props: CellProps<VersionTableData>) => {
      const version = props.row.original.version;
      const isHidden = version.state === "hidden";

      const mainToolbarActions: MenuAction[] = [
        {
          title: stringsOverrides.updateNamedVersion,
          label: stringsOverrides.updateNamedVersion,
          icon: <SvgEdit />,
          disabled: false,
          onClick: () => {
            setCurrentVersion(version);
            setIsUpdateVersionModalOpen(true);
          },
        },
        {
          title: stringsOverrides.download,
          label: stringsOverrides.download,
          icon: <SvgDownload />,
          disabled: false,
          onClick: async () => {
            const { changesetIndex } = version;
            await onDownloadClick(changesetIndex);
          },
        },
      ];
      if (enableHideVersions) {
        mainToolbarActions.push({
          title: isHidden ? stringsOverrides.unhide : stringsOverrides.hide,
          label: isHidden ? stringsOverrides.unhide : stringsOverrides.hide,
          icon: isHidden ? <SvgVisibilityShow /> : <SvgVisibilityHide />,
          onClick: () => {
            toggleVersionState(version);
          },
        });
      }
      return mainToolbarActions;
    },
    [
      enableHideVersions,
      onDownloadClick,
      stringsOverrides.download,
      stringsOverrides.hide,
      stringsOverrides.unhide,
      stringsOverrides.updateNamedVersion,
      toggleVersionState,
    ]
  );

  const columns = React.useMemo(() => {
    const tableColumns = [
      {
        Header: "Name",
        columns: [
          {
            id: "HIDDEN",
            width: 80,
            Cell: (props: CellProps<VersionTableData>) => {
              const version = props.row.original;
              return showHiddenVersions &&
                isNamedVersion(version) &&
                version.version?.state === "hidden" ? (
                <Tooltip content={stringsOverrides.hidden}>
                  <Flex>
                    <SvgVisibilityHide data-testid="hidden-version-icon" />
                  </Flex>
                </Tooltip>
              ) : (
                <></>
              );
            },
          },
          {
            id: "name",
            Header: stringsOverrides.name,
            accessor: (row: VersionTableData | Changeset) => {
              return isNamedVersion(row) ? row.version.name : row.displayName;
            },
            Filter: tableFilters.TextFilter(),
            filter: (rows: any[], _id: string, filterValue: string) => {
              // Only filter parent rows (VersionTableData), not subRows (Changesets)
              return rows.filter((row) => {
                if (!isNamedVersion(row.original)) {
                  return true;
                }
                const name = row.original.version.name.toLowerCase();
                return name.includes(filterValue.toLowerCase());
              });
            },
            Cell: (props: CellProps<VersionTableData | Changeset>) => {
              const columnAccessor = isNamedVersion(props.row.original)
                ? "name"
                : "displayName";
              return generateCellContent(props.row.original, columnAccessor);
            },
          },
          {
            id: "description",
            Header: stringsOverrides.description,
            accessor: (row: VersionTableData | Changeset) => {
              return isNamedVersion(row)
                ? row.version.description
                : row.description;
            },
            Filter: tableFilters.TextFilter(),
            filter: (rows: any[], _id: string, filterValue: string) => {
              // Only filter parent rows (VersionTableData), not subRows (Changesets)
              return rows.filter((row) => {
                if (!isNamedVersion(row.original)) {
                  return true;
                }
                const description = (
                  row.original.version.description || ""
                ).toLowerCase();
                return description.includes(filterValue.toLowerCase());
              });
            },
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
                    <ContextMenu menuActions={getToolbarActions(props)} />
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
      tableColumns[0].columns.splice(5, 0, {
        id: "versions-table-view",
        width: 100,
        Cell: (props: CellProps<VersionTableData>) => {
          return isNamedVersion(props.row.original) ? (
            <span
              className="iac-table-view-anchor"
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
    stringsOverrides.hidden,
    stringsOverrides.view,
    onViewClick,
    showHiddenVersions,
    generateCellContent,
    getToolbarActions,
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

  const hiddenColumns = React.useMemo(() => {
    return enableHideVersions ? [] : ["HIDDEN"];
  }, [enableHideVersions]);

  return (
    <>
      <Table<VersionTableData>
        columns={columns}
        data={tableData}
        manualFilters={true}
        onFilter={onFilterChange}
        isLoading={
          status === RequestStatus.InProgress ||
          status === RequestStatus.NotStarted
        }
        bodyProps={{
          className: "iac-versions-table-body",
        }}
        emptyTableContent={emptyTableContent}
        emptyFilteredTableContent={stringsOverrides.messageNoFilterResults}
        onBottomReached={loadMoreVersions}
        className="iac-versions-table"
        onExpand={onExpandRow}
        initialState={{ hiddenColumns }}
        autoResetFilters={false}
        stateReducer={useCallback(
          (
            newState: TableState<VersionTableData>,
            _action: ActionType,
            _prevState: TableState<VersionTableData>,
            instance: TableInstance<VersionTableData> | undefined
          ) => {
            tableInstance.current = instance;
            return { ...newState, hiddenColumns };
          },
          [hiddenColumns]
        )}
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
