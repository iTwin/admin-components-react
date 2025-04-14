/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import React from "react";

import { iModelExtent, IModelFull } from "../../types";
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
    /** South West coordinate label. */
    southWestCoordinate?: string;
    /** North East coordinate label. */
    northEastCoordinate?: string;
    /** Latitude label. */
    latitude?: string;
    /** Longitude label. */
    longitude?: string;
  };
  /** iTwinId where to create an iModel. */
  iTwinId: string;
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
  /** Creation Mode of iModel */
  creationMode?: "empty" | "fromiModelVersion" | "fromBaseline";
  /** geographicCoordinateSystem if for CRS is selected on iModel creation*/
  geographicCoordinateSystem?: { horizontalCRSId: string };
  /** Template to create iModel From version*/
  template?: {
    iModelId: string;
    changesetId: string;
  };
  //**Used for describing Baseline File in bytes during iModel creation. */
  baselineFile?: {
    size: number;
  };
  children?: React.ReactNode;
};

export function CreateIModel(props: CreateIModelProps) {
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
    iTwinId,
    extentComponent,
    extent,
    creationMode = "empty",
    geographicCoordinateSystem,
    template,
    baselineFile,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "iModel created successfully.",
    errorMessage: "Could not create an iModel. Please try again later.",
    errorMessageIModelExists:
      "iModel with the same name already exists within the iTwin.",
    ...stringsOverrides,
  };

  const createiModel = async (imodel: {
    name: string;
    description: string;
    thumbnail?: { src?: ArrayBuffer; type: string };
    extent?: iModelExtent | null;
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
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iTwinId,
          name: imodel.name,
          description: imodel.description,
          extent: imodel.extent,
          creationMode,
          geographicCoordinateSystem,
          template,
          baselineFile,
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
        extentComponent={extentComponent}
        extent={extent}
      >
        {props.children}
      </BaseIModelPage>
    </>
  );
}
