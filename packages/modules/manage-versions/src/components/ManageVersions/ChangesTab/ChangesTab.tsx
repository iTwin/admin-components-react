/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ChangesTab.scss";

import { SvgFlag } from "@itwin/itwinui-icons-react";
import { Table } from "@itwin/itwinui-react";
import React from "react";
import { CellProps } from "react-table";

import { useConfig } from "../../../common/configContext";
import { Changeset, NamedVersion } from "../../../models";
import { CreateVersionModal } from "../../CreateUpdateVersion/CreateVersionModal/CreateVersionModal";
import { RequestStatus } from "../types";

export type ChangesTabProps = {
  changesets: Changeset[];
  status: RequestStatus;
  loadMoreChanges: () => void;
  canCreateVersion: (changesetId: string) => boolean;
  onVersionCreated: () => void;
  latestVersion: NamedVersion | undefined;
};

const ChangesTab = (props: ChangesTabProps) => {
  const {
    changesets,
    status,
    loadMoreChanges,
    canCreateVersion,
    onVersionCreated,
    latestVersion,
  } = props;

  const { stringsOverrides } = useConfig();

  const [
    isCreateVersionModalOpen,
    setIsCreateVersionModalOpen,
  ] = React.useState(false);

  const [currentChangeset, setCurrentChangeset] = React.useState<
    Changeset | undefined
  >(undefined);

  const columns = React.useMemo(() => {
    return [
      {
        Header: "Name",
        columns: [
          {
            id: "INDEX",
            Header: "#",
            accessor: "index",
            width: 90,
          },
          {
            id: "DESCRIPTION",
            Header: stringsOverrides.description,
            accessor: "description",
          },
          {
            id: "PUSH_DATE",
            Header: stringsOverrides.time,
            accessor: "pushDateTime",
            maxWidth: 220,
            Cell: (props: CellProps<Changeset>) => {
              return (
                <span>
                  {new Date(props.row.original.pushDateTime).toLocaleString()}
                </span>
              );
            },
          },
          {
            id: "changes-table-actions",
            width: 62,
            Cell: (props: CellProps<Changeset>) => {
              const changeset = props.data[props.row.index];
              return (
                <>
                  {canCreateVersion(changeset.id) && (
                    <div
                      className="iac-create-version-icon"
                      onClick={() => {
                        setCurrentChangeset(changeset);
                        setIsCreateVersionModalOpen(true);
                      }}
                      title={stringsOverrides.createNamedVersion}
                    >
                      <SvgFlag />
                    </div>
                  )}
                </>
              );
            },
          },
        ],
      },
    ];
  }, [
    canCreateVersion,
    stringsOverrides.createNamedVersion,
    stringsOverrides.description,
    stringsOverrides.time,
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

  return (
    <>
      <Table<Changeset>
        columns={columns}
        data={changesets}
        isLoading={
          status === RequestStatus.InProgress ||
          status === RequestStatus.NotStarted
        }
        emptyTableContent={emptyTableContent}
        onBottomReached={loadMoreChanges}
        className="iac-changes-table"
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
    </>
  );
};

export default ChangesTab;
