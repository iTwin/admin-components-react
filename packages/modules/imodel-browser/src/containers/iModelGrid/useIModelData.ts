/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  ApiOverrides,
  DataStatus,
  IModelFilterOptions,
  IModelFull,
  IModelSortOptions,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useIModelFilter } from "./useIModelFilter";
import { useIModelSort } from "./useIModelSort";

export interface IModelDataHookOptions {
  projectId?: string | undefined;
  assetId?: string | undefined;
  accessToken?: string | undefined;
  filterOptions?: IModelFilterOptions;
  sortOptions?: IModelSortOptions;
  apiOverrides?: ApiOverrides<IModelFull[]>;
}

export const useIModelData = ({
  projectId,
  assetId,
  accessToken,
  filterOptions,
  sortOptions,
  apiOverrides,
}: IModelDataHookOptions) => {
  const [iModels, setIModels] = React.useState<IModelFull[]>([]);
  const [status, setStatus] = React.useState<DataStatus>();
  const filteredIModels = useIModelFilter(iModels, filterOptions);
  const sortedIModels = useIModelSort(filteredIModels, sortOptions);
  React.useEffect(() => {
    if (apiOverrides?.data) {
      setIModels(apiOverrides.data);
      setStatus(DataStatus.Complete);
      return;
    }
    if (!accessToken || (!projectId && !assetId)) {
      setStatus(
        !accessToken ? DataStatus.TokenRequired : DataStatus.ContextRequired
      );
      setIModels([]);
      return;
    }
    setStatus(DataStatus.Fetching);
    const url = `${_getAPIServer(apiOverrides)}/imodels/${
      projectId ? `?projectId=${projectId}` : ""
    }${assetId ? `?assetId=${assetId}` : ""}`; //[&$skip][&$top]
    const options: RequestInit = {
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
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
      })
      .then((result: { iModels: IModelFull[] }) => {
        setStatus(DataStatus.Complete);
        setIModels(result.iModels);
      })
      .catch((e) => {
        setIModels([]);
        setStatus(DataStatus.FetchFailed);
        console.error(e);
      });
  }, [accessToken, projectId, assetId, apiOverrides?.data, apiOverrides]);
  return { iModels: sortedIModels, status };
};
