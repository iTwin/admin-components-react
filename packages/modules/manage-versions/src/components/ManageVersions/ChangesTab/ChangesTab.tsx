/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Table } from "@itwin/itwinui-react";
import React from "react";
import { CellProps } from "react-table";

import { Changeset } from "../../../models";
import { ManageVersionsStringOverrides, RequestStatus } from "../types";

export type ChangesTabProps = {
  changesets: Changeset[];
  status: RequestStatus;
  stringsOverrides: ManageVersionsStringOverrides;
};

const ChangesTab = (props: ChangesTabProps) => {
  const { changesets, status, stringsOverrides } = props;

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
        ],
      },
    ];
  }, [stringsOverrides.description, stringsOverrides.time]);

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
    <Table<Changeset>
      columns={columns}
      data={changesets}
      isLoading={
        status === RequestStatus.InProgress ||
        status === RequestStatus.NotStarted
      }
      emptyTableContent={emptyTableContent}
    />
  );
};

export default ChangesTab;
