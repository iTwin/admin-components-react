/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useToaster } from "@itwin/itwinui-react";
import React from "react";

import { NamedVersionClient } from "../../../clients/namedVersionClient";
import { useConfig } from "../../../common/configContext";
import { ApimCodes, ApimError, NamedVersion } from "../../../models";
import { VersionModal } from "../VersionModal";

export type UpdateVersionModalProps = {
  version: NamedVersion;
  onClose: () => void;
  onUpdate: () => void;
};

export const UpdateVersionModal = (props: UpdateVersionModalProps) => {
  const { version, onClose, onUpdate } = props;

  const toaster = useToaster();

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
        return stringsOverrides.messageInsufficientPermissionsToUpdateVersion;
      default:
        return stringsOverrides.messageCouldNotUpdateVersion;
    }
  };

  const onUpdateClick = (name: string, description: string) => {
    setIsLoading(true);
    toaster.closeAll();
    versionClient
      .update(imodelId, version.id, { name, description })
      .then(() => {
        setIsLoading(false);
        onUpdate();
        toaster.positive(
          stringsOverrides.messageVersionUpdated.replace("{{name}}", name),
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
      title={stringsOverrides.updateNamedVersion}
      actionName={stringsOverrides.update}
      initialVersion={version}
      isLoading={isLoading}
      onClose={onClose}
      onActionClick={onUpdateClick}
    />
  );
};
