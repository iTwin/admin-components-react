/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./CreateVersionModal.scss";

import { useToaster } from "@itwin/itwinui-react";
import React from "react";

import { NamedVersionClient } from "../../../clients/namedVersionClient";
import { useConfig } from "../../../common/configContext";
import { ApimCodes, ApimError, Changeset, NamedVersion } from "../../../models";
import { VersionModal } from "../VersionModal";

export type CreateVersionModalProps = {
  latestVersion: NamedVersion | undefined;
  changeset: Changeset;
  onClose: () => void;
  onCreate: () => void;
};

export const CreateVersionModal = (props: CreateVersionModalProps) => {
  const toaster = useToaster();
  const { latestVersion, changeset, onClose, onCreate } = props;

  const { accessToken, imodelId, apiOverrides, stringsOverrides, log } =
    useConfig();

  const [isLoading, setIsLoading] = React.useState(false);

  const versionClient = React.useMemo(
    () =>
      new NamedVersionClient(
        accessToken,
        apiOverrides?.serverEnvironmentPrefix,
        log
      ),
    [accessToken, apiOverrides?.serverEnvironmentPrefix, log]
  );

  const getErrorMessage = (code: ApimCodes | undefined) => {
    switch (code) {
      case "NamedVersionExists":
        return stringsOverrides.messageVersionNameExists;
      case "InsufficientPermissions":
        return stringsOverrides.messageInsufficientPermissionsToCreateVersion;
      default:
        return stringsOverrides.messageCouldNotCreateVersion;
    }
  };

  const onCreateClick = (name: string, description: string) => {
    setIsLoading(true);
    toaster.closeAll();
    versionClient
      .create(imodelId, { name, description, changeSetId: changeset.id })
      .then(() => {
        setIsLoading(false);
        onCreate();
        toaster.positive(
          stringsOverrides.messageVersionCreated.replace("{{name}}", name),
          {
            hasCloseButton: true,
          }
        );
      })
      .catch((e: ApimError) => {
        setIsLoading(false);
        toaster.negative(getErrorMessage(e.code), {
          hasCloseButton: true,
        });
      });
  };

  return (
    <VersionModal
      title={stringsOverrides.createNamedVersion}
      actionName={stringsOverrides.create}
      isLoading={isLoading}
      onClose={onClose}
      onActionClick={onCreateClick}
    >
      <div className="iui-input-container">
        <div className="iui-label">Latest included change</div>
        <div className="iac-additional-info">
          <span>#{changeset.index}</span>
          <span>{new Date(changeset.pushDateTime).toLocaleString()}</span>
        </div>
      </div>
      {latestVersion && (
        <div className="iui-input-container">
          <div className="iui-label">Latest Named Version</div>
          <div className="iac-additional-info">
            <span className="iac-cell-ellipsis">{latestVersion.name}</span>
            <span>
              {new Date(latestVersion.createdDateTime).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </VersionModal>
  );
};
