/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import React from "react";

import { ApiOverrides, IModelFull } from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";

export const useIModelData = (
  projectId: string | undefined,
  assetId: string | undefined,
  accessToken: string | undefined,
  apiOverrides?: ApiOverrides<IModelFull[]>
) => {
  const [iModels, setIModels] = React.useState<IModelFull[]>([]);
  const [status, setStatus] = React.useState<
    "uninitialized" | "fetching" | "complete" | "fetch_error" | "override"
  >("uninitialized");
  React.useEffect(() => {
    if (apiOverrides?.data) {
      setIModels(apiOverrides.data);
      setStatus("override");
      return;
    }
    if (apiOverrides?.data || !accessToken || (!projectId && !assetId)) {
      if (iModels) {
        setIModels([]);
      }
      return;
    }
    setStatus("fetching");
    const url = `${_getAPIServer(apiOverrides)}/imodels/${
      projectId ? `?projectId=${projectId}` : ""
    }${assetId ? `?assetId=${assetId}` : ""}`; //[&$skip][&$top]
    const options: RequestInit = {
      cache: "no-store",
      headers: {
        Authorization: accessToken,
        Prefer: "return=representation",
      },
    };
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setStatus("fetch_error");
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
      })
      .then((result: { iModels: IModelFull[] }) => {
        setStatus("complete");
        setIModels(result.iModels);
      })
      .catch((e) => {
        setStatus("fetch_error");
        console.error(e);
      });
  }, [accessToken, projectId, assetId, apiOverrides?.data, apiOverrides]);
  return { iModels, status };
};
