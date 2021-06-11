/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./VersionsTab.scss";

import { SvgEdit } from "@itwin/itwinui-icons-react";
import { Table } from "@itwin/itwinui-react";
import React from "react";
import { CellProps } from "react-table";

import { useConfig } from "../../../common/configContext";
import { NamedVersion } from "../../../models";
import { UpdateVersionModal } from "../../CreateUpdateVersion/UpdateVersionModal/UpdateVersionModal";
import { RequestStatus } from "../types";

export type VersionsTabProps = {
  versions: NamedVersion[];
  status: RequestStatus;
  onVersionUpdated: () => void;
  loadMoreVersions: () => void;
};

const VersionsTab = (props: VersionsTabProps) => {
  const { versions, status, onVersionUpdated, loadMoreVersions } = props;

  const { stringsOverrides } = useConfig();

  const [currentVersion, setCurrentVersion] = React.useState<
    NamedVersion | undefined
  >(undefined);
  const [
    isUpdateVersionModalOpen,
    setIsUpdateVersionModalOpen,
  ] = React.useState(false);

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
          {
            id: "versions-table-actions",
            width: 62,
            Cell: (props: CellProps<NamedVersion>) => {
              return (
                <>
                  <div
                    className="iac-update-version-icon"
                    onClick={() => {
                      setCurrentVersion(props.row.original);
                      setIsUpdateVersionModalOpen(true);
                    }}
                    title={stringsOverrides.updateNamedVersion}
                  >
                    <SvgEdit />
                  </div>
                </>
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
    stringsOverrides.updateNamedVersion,
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
      <Table<NamedVersion>
        columns={columns}
        data={versions}
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
