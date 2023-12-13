/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./DeleteIModel.scss";

import SvgWarning from "@itwin/itwinui-icons-react/cjs/icons/StatusWarning";
import {
  Button,
  Modal,
  ModalButtonBar,
  ModalContent,
  ProgressRadial,
  ThemeProvider,
  useToaster,
} from "@itwin/itwinui-react";
import React from "react";

export type DeleteIModelProps = {
  /** iModel object to delete. */
  imodel: { name?: string; id: string };
  /** Bearer access token with scope `imodels:modify`. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  /** Callback on closed dialog. */
  onClose?: () => void;
  /** Callback on failed delete. */
  onError?: (error: Error) => void;
  /** Callback on successful delete. */
  onSuccess?: () => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful delete. */
    successMessage?: string;
    /** Displayed after failed delete. */
    errorMessage?: string;
    /** The title of the dialog. */
    title?: string;
    /** Main body message. */
    bodyMessage?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
  };
};

export function DeleteIModel(props: DeleteIModelProps) {
  return (
    <ThemeProvider>
      <ThemeWrappedDeleteIModel {...props} />
    </ThemeProvider>
  );
}

function ThemeWrappedDeleteIModel(props: DeleteIModelProps) {
  const toaster = useToaster();
  const {
    imodel: { id: imodelId, name: imodelName },
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
  } = props;
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteiModel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${
          apiOverrides?.serverEnvironmentPrefix &&
          `${apiOverrides.serverEnvironmentPrefix}-`
        }api.bentley.com/imodels/${imodelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${accessToken}`,
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        setIsLoading(false);
        toaster.positive(
          stringsOverrides?.successMessage ?? "iModel deleted successfully."
        );
        onSuccess?.();
      }
      close();
    } catch (err: any) {
      error(err);
      close();
    }
  };

  const error = (error: Error) => {
    setIsLoading(false);
    toaster.negative(
      stringsOverrides?.errorMessage ??
        "Could not delete an iModel. Please try again later."
    );
    onError?.(error);
  };

  const close = React.useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        style={{ maxWidth: 600 }}
        onClose={close}
        title={
          <div className="iac-delete-title">
            <SvgWarning className="iac-warning-icon" />
            {stringsOverrides?.title ??
              `Delete an iModel ${imodelName && `'${imodelName}'`}`}
          </div>
        }
      >
        <ModalContent className="iac-delete-body-message">
          {stringsOverrides?.bodyMessage ??
            "Deleting this iModel will remove access for all users and all data will no longer be available. Are you sure you want to delete this iModel?"}
        </ModalContent>
        <ModalButtonBar>
          <Button styleType="high-visibility" onClick={deleteiModel}>
            {stringsOverrides?.confirmButton ?? "Yes"}
          </Button>
          <Button onClick={close}>
            {stringsOverrides?.cancelButton ?? "No"}
          </Button>
        </ModalButtonBar>
      </Modal>
      {isLoading && <OverlaySpinner />}
    </>
  );
}

function OverlaySpinner() {
  return (
    <div className="iac-overlay-container">
      <ProgressRadial indeterminate />
    </div>
  );
}
