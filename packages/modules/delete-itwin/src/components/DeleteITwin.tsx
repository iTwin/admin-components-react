/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./DeleteITwin.scss";

import SvgWarning from "@itwin/itwinui-icons-react/cjs/icons/StatusWarning";
import {
  Button,
  Modal,
  ModalButtonBar,
  ProgressRadial,
  ThemeProvider,
  useToaster,
} from "@itwin/itwinui-react";
import React from "react";

export type DeleteITwinProps = {
  /** Name and Id of iTwin object to delete */
  iTwin: { displayName?: string; id: string };
  /** Bearer access token with scope `itwins:modify`. */
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

export const DeleteITwin = (props: DeleteITwinProps) => {
  const toaster = useToaster();
  const {
    iTwin,
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
  } = props;
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${
          apiOverrides?.serverEnvironmentPrefix &&
          `${apiOverrides.serverEnvironmentPrefix}-`
        }api.bentley.com/itwins/${iTwin.id}`,
        { method: "DELETE", headers: { Authorization: `${accessToken}` } }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        setIsLoading(false);
        toaster.positive(
          stringsOverrides?.successMessage ?? "iTwin deleted successfully."
        );
        onSuccess?.();
      }
    } catch (err: any) {
      error(err);
    } finally {
      close();
    }
  };

  const error = (error: Error) => {
    setIsLoading(false);
    toaster.negative(
      stringsOverrides?.errorMessage ??
        "Could not delete an iTwin. Please try again later."
    );
    onError?.(error);
  };

  const close = React.useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <ThemeProvider theme="inherit">
      <Modal
        isOpen={isOpen}
        style={{ maxWidth: 600 }}
        onClose={close}
        title={
          <div className="iac-delete-itwin-dialog-title">
            <SvgWarning className="iac-warning-icon" />
            {stringsOverrides?.title ??
              `Delete an iTwin ${
                iTwin.displayName && `'${iTwin.displayName}'`
              }`}
          </div>
        }
      >
        {stringsOverrides?.bodyMessage ??
          "Deleting this iTwin will remove access for all users and all data will no longer be available. Are you sure you want to delete this iTwin?"}
        <ModalButtonBar>
          <Button styleType="high-visibility" onClick={onDelete}>
            {stringsOverrides?.confirmButton ?? "Yes"}
          </Button>
          <Button onClick={close}>
            {stringsOverrides?.cancelButton ?? "No"}
          </Button>
        </ModalButtonBar>
      </Modal>
      {isLoading && <OverlaySpinner />}
    </ThemeProvider>
  );
};

const OverlaySpinner = () => {
  return (
    <div className="iac-delete-itwin-overlay-container">
      <ProgressRadial indeterminate data-testid="progress-radial" />
    </div>
  );
};
