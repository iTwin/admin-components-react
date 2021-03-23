/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import React from "react";

import { ApiOverrides } from "../../types";
import { useIModelThumbnail } from "./useIModelThumbnail";

/** Clickable iModel thumbnail, fetched from the servers */
export const IModelThumbnail = (props: {
  iModelId: string;
  onClick?(iModelId: string): void;
  /* Access token that requires the `imodels:read` scope. */
  accessToken?: string;
  /** Object that configures different overrides for the API */
  apiOverrides?: ApiOverrides<string>;
}) => {
  const thumbnail = useIModelThumbnail(
    props.iModelId,
    props.accessToken,
    props.apiOverrides
  );
  return thumbnail ? (
    <img
      className="iui-picture"
      style={{ cursor: props.onClick ? "pointer" : "auto" }}
      id="base64image"
      src={thumbnail ?? ""}
      alt=""
      onClick={() => props.onClick?.(props.iModelId)}
    />
  ) : null;
};
