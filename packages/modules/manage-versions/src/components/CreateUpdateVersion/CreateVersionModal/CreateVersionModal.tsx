/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./CreateVersionModal.scss";

import {
  InputGrid,
  Label,
  ThemeProvider,
  useToaster,
} from "@itwin/itwinui-react";
import React from "react";

import { NamedVersionClient } from "../../../clients/namedVersionClient";
import { useConfig } from "../../../common/configContext";
import {
  ApimCodes,
  ApimError,
  Changeset,
  localeDateWithTimeFormat,
  NamedVersion,
} from "../../../models";
import { VersionModal } from "../VersionModal";

export type CreateVersionModalProps = {
  latestVersion: NamedVersion | undefined;
  changeset: Changeset;
  onClose: () => void;
  onCreate: () => void;
};

export const CreateVersionModal = (props: CreateVersionModalProps) => {
  return (
    <ThemeProvider>
      <ThemeWrappedCreateVersionModal {...props} />
    </ThemeProvider>
  );
};

function ThemeWrappedCreateVersionModal(props: CreateVersionModalProps) {
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
      <InputGrid>
        <Label>Latest included change</Label>
        <div className="iac-additional-info">
          <span>#{changeset.index}</span>
          <span>
            {localeDateWithTimeFormat(new Date(changeset.pushDateTime))}
          </span>
        </div>
      </InputGrid>
      {latestVersion && (
        <InputGrid>
          <Label>Latest Named Version</Label>
          <div className="iac-additional-info">
            <span className="iac-cell-ellipsis">{latestVersion.name}</span>
            <span>
              {localeDateWithTimeFormat(
                new Date(latestVersion.createdDateTime)
              )}
            </span>
          </div>
        </InputGrid>
      )}
    </VersionModal>
  );
}
