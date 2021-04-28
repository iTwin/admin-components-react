/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Table } from "@itwin/itwinui-react";
import React from "react";
import { CellProps } from "react-table";

import { Changeset } from "../../../models/changeset";
import { RequestStatus } from "../types";

export type ChangesTabProps = {
  changesets: Changeset[];
  status: RequestStatus;
};

const ChangesTab = (props: ChangesTabProps) => {
  const { changesets, status } = props;

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
            Header: "Description",
            accessor: "description",
          },
          {
            id: "PUSH_DATE",
            Header: "Time",
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
  }, []);

  const emptyTableContent = React.useMemo(() => {
    return status === RequestStatus.Failed
      ? "Could not get changes. Please try again later."
      : "There are no changes synchronized.";
  }, [status]);

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
