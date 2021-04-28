/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Table } from "@itwin/itwinui-react";
import React from "react";
import { CellProps } from "react-table";

import { NamedVersion } from "../../../models/namedVersion";
import { ManageVersionsStringOverrides, RequestStatus } from "../types";

export type VersionsTabProps = {
  versions: NamedVersion[];
  status: RequestStatus;
  stringsOverrides: ManageVersionsStringOverrides;
};

const VersionsTab = (props: VersionsTabProps) => {
  const { versions, status, stringsOverrides } = props;

  const columns = React.useMemo(() => {
    return [
      {
        Header: "Name",
        columns: [
          {
            id: "NAME",
            Header: stringsOverrides.name,
            accessor: "name",
          },
          {
            id: "DESCRIPTION",
            Header: stringsOverrides.description,
            accessor: "description",
          },
          {
            id: "CREATED_DATE",
            Header: stringsOverrides.time,
            accessor: "createdDateTime",
            maxWidth: 220,
            Cell: (props: CellProps<NamedVersion>) => {
              return (
                <span>
                  {new Date(
                    props.row.original.createdDateTime
                  ).toLocaleString()}
                </span>
              );
            },
          },
        ],
      },
    ];
  }, [
    stringsOverrides.description,
    stringsOverrides.name,
    stringsOverrides.time,
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
    <Table<NamedVersion>
      columns={columns}
      data={versions}
      isLoading={
        status === RequestStatus.InProgress ||
        status === RequestStatus.NotStarted
      }
      emptyTableContent={emptyTableContent}
    />
  );
};

export default VersionsTab;
