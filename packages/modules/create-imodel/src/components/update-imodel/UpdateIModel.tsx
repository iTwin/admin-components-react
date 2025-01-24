/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useToaster } from "@itwin/itwinui-react";
import React from "react";

import { BaseIModel, iModelExtent, IModelFull } from "../../types";
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
    /** South West coordinate label. */
    southWestCoordinate?: string;
    /** North East coordinate label. */
    northEastCoordinate?: string;
    /** Latitude label. */
    latitude?: string;
    /** Longitude label. */
    longitude?: string;
  };
  /** iModel id to update. */
  imodelId: string;
  /** Initial iModel data. */
  initialIModel: BaseIModel;
  /** Extent component. Recommended to use a map component. If not provided then input fields for extent will be shown.
   * @example
   * <CreateIModel
   *   // ...
   *   extentComponent={
   *     <iframe
   *       title="iModel Extent Map"
   *       src="https://www.google.com/maps/embed"
   *       width="100%"
   *       height="100%"
   *       frameBorder="0"
   *       style={{ border: 0 }}
   *       allowFullScreen={false}
   *     ></iframe>
   *   }
   * />
   */
  extentComponent?: React.ReactNode;
  /** Extent value that should be gotten from the `extentComponent`. */
  extent?: iModelExtent | null;
  children?: React.ReactNode;
};

export function UpdateIModel(props: UpdateIModelProps) {
  const toaster = useToaster();
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
    imodelId,
    initialIModel,
    extentComponent,
    extent,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "iModel updated successfully.",
    errorMessage: "Could not update an iModel. Please try again later.",
    errorMessageIModelExists:
      "iModel with the same name already exists within the iTwin.",
    titleString: "Update an iModel",
    confirmButton: "Update",
    ...stringsOverrides,
  };

  const updateiModel = async (imodel: {
    name: string;
    description: string;
    thumbnail?: { src?: ArrayBuffer; type: string };
    extent?: iModelExtent | null;
  }) => {
    setIsLoading(true);
    try {
      const imodelUrl = `https://${
        apiOverrides?.serverEnvironmentPrefix &&
        `${apiOverrides.serverEnvironmentPrefix}-`
      }api.bentley.com/imodels/${imodelId}`;
      const response = await fetch(imodelUrl, {
        method: "PATCH",
        headers: {
          Authorization: `${accessToken}`,
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: imodel.name,
          description: imodel.description,
          extent: imodel.extent,
        }),
      });
      if (!response.ok) {
        let error = new Error();
        const responseBody = await response.json();
        error = { ...error, ...responseBody };
        throw error;
      } else {
        const updatedimodel = await response.json();
        if (imodel.thumbnail?.src) {
          await fetch(`${imodelUrl}/thumbnail`, {
            method: "PUT",
            headers: {
              Authorization: `${accessToken}`,
              Accept: "application/vnd.bentley.itwin-platform.v2+json",
              "Content-Type": imodel.thumbnail.type,
            },
            body: imodel.thumbnail.src,
          });
        }
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
        extentComponent={extentComponent}
        extent={extent}
      >
        {props.children}
      </BaseIModelPage>
    </>
  );
}
