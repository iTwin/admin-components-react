/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import React from "react";

import { BaseIModel, IModelFull } from "../../types";
import { BaseIModelPage } from "../base-imodel/BaseIModel";

export type CreateIModelProps = {
  /** Bearer access token with scope `imodels:modify`. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  /** Callback on canceled action. */
  onClose?: () => void;
  /** Callback on failed create. */
  onError?: (
    error: { error: { code?: string; message?: string } } | any
  ) => void;
  /** Callback on successful create. */
  onSuccess?: (createdimodel: { iModel: IModelFull }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful create. */
    successMessage?: string;
    /** Displayed after failed create. */
    errorMessage?: string;
    /** Displayed after failed create because of the duplicate name. */
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
  /** ProjectId where to create an iModel. */
  projectId: string;
};

export function CreateIModel(props: CreateIModelProps) {
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
    projectId,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "iModel created successfully.",
    errorMessage: "Could not create an iModel. Please try again later.",
    errorMessageIModelExists:
      "iModel with the same name already exists within the project.",
    ...stringsOverrides,
  };

  const createiModel = async (imodel: {
    name: string;
    description: string;
    thumbnail?: { src?: ArrayBuffer; type: string };
  }) => {
    setIsLoading(true);
    try {
      const imodelsUrl = `https://${
        apiOverrides?.serverEnvironmentPrefix &&
        `${apiOverrides.serverEnvironmentPrefix}-`
      }api.bentley.com/imodels`;
      const response = await fetch(imodelsUrl, {
        method: "POST",
        headers: {
          Authorization: `${accessToken}`,
          Prefer: "return=representation",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          name: imodel.name,
          description: imodel.description,
        }),
      });
      if (!response.ok) {
        let error = new Error();
        const responseBody = await response.json();
        error = { ...error, ...responseBody };
        throw error;
      } else {
        const createdimodel: { iModel: IModelFull } = await response.json();
        if (imodel.thumbnail?.src) {
          await fetch(`${imodelsUrl}/${createdimodel.iModel.id}/thumbnail`, {
            method: "PUT",
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": imodel.thumbnail.type,
            },
            body: imodel.thumbnail.src,
          });
        }
        setIsLoading(false);
        toaster.positive(updatedStrings.successMessage, {
          hasCloseButton: true,
        });
        onSuccess?.(createdimodel);
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
        onActionClick={createiModel}
        onClose={onClose}
      />
    </>
  );
}
