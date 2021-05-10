/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import React from "react";

import { BaseIModel, IModelFull } from "../../types";
import { BaseIModelPage } from "../base-imodel/BaseIModel";

export type UpdateIModelProps = {
  /** Bearer access token with scope `imodels:modify`. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  /** Callback on canceled action. */
  onClose?: () => void;
  /** Callback on failed update. */
  onError?: (
    error: { error: { code?: string; message?: string } } | any
  ) => void;
  /** Callback on successful update. */
  onSuccess?: (updatedIModel: { iModel: IModelFull }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful update. */
    successMessage?: string;
    /** Displayed after failed update. */
    errorMessage?: string;
    /** Displayed after failed update because of the duplicate name. */
    errorMessageIModelExists?: string;
    /** The title of the page. */
    titleString?: string;
    /** iModel name property. */
    nameString?: string;
    /** iModel description property. */
    descriptionString?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
    /** Error message when name is too long. */
    nameTooLong?: string;
    /** Error message when description is too long. */
    descriptionTooLong?: string;
  };
  /** iModel id to update. */
  imodelId: string;
  /** Initial iModel data. */
  initialIModel: BaseIModel;
};

export function UpdateIModel(props: UpdateIModelProps) {
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
    imodelId,
    initialIModel,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "iModel updated successfully.",
    errorMessage: "Could not update an iModel. Please try again later.",
    errorMessageIModelExists:
      "iModel with the same name already exists within the project.",
    titleString: "Update an iModel",
    confirmButton: "Update",
    ...stringsOverrides,
  };

  const updateiModel = async (imodel: BaseIModel) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${
          apiOverrides?.serverEnvironmentPrefix &&
          `${apiOverrides.serverEnvironmentPrefix}-`
        }api.bentley.com/imodels/${imodelId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `${accessToken}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            iModel: {
              name: imodel.name,
              description: imodel.description,
            },
          }),
        }
      );
      if (!response.ok) {
        let error = new Error();
        const responseBody = await response.json();
        error = { ...error, ...responseBody };
        throw error;
      } else {
        const updatedimodel = await response.json();
        setIsLoading(false);
        toaster.positive(updatedStrings.successMessage, {
          hasCloseButton: true,
        });
        onSuccess?.(updatedimodel);
      }
    } catch (err) {
      error(err);
    }
  };

  const error = (
    error: { error: { code?: string; message?: string } } | any
  ) => {
    setIsLoading(false);
    const errorString =
      error?.error?.code === "iModelExists"
        ? updatedStrings.errorMessageIModelExists
        : updatedStrings.errorMessage;
    toaster.negative(errorString, { hasCloseButton: true });
    onError?.(error);
  };

  return (
    <>
      <BaseIModelPage
        stringsOverrides={updatedStrings}
        isLoading={isLoading}
        onActionClick={updateiModel}
        onClose={onClose}
        initialIModel={initialIModel}
      />
    </>
  );
}
