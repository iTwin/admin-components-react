/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import classNames from "classnames";
import React from "react";
import { useInView } from "react-intersection-observer";

import { AccessTokenProvider, ApiOverrides } from "../../types";
import { useIModelThumbnail } from "./useIModelThumbnail";

/** @alpha */
export interface IModelThumbnailMUIProps {
  className?: string;
  /** Id of the iModel to fetch thumbnail for */
  iModelId: string;
  /* Access token that requires the `imodels:read` scope. */
  accessToken?: AccessTokenProvider;
  /** Object that configures different overrides for the API
   * @property data thumbnail URL
   * @property serverEnvironmentPrefix Either qa or dev
   */
  apiOverrides?: ApiOverrides<string>;
}

/**
 * Clickable iModel thumbnail, fetched from the servers — MUI (Stratakit/MUI migration target)
 * @alpha
 */
export const IModelThumbnailMUI = ({
  iModelId,
  accessToken,
  apiOverrides,
  className,
}: IModelThumbnailMUIProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    skip: !!apiOverrides?.data,
  });
  const thumbnail = useIModelThumbnail(
    iModelId,
    inView ? accessToken : undefined,
    apiOverrides
  );
  return thumbnail ? (
    <CardMedia
      image={thumbnail}
      ref={ref}
      className={classNames("iac-thumbnail", className)}
      sx={{ height: "100%" }}
    />
  ) : (
    <Skeleton
      variant="rectangular"
      ref={ref}
      sx={{ height: "100%", width: "100%", minHeight: 140 }}
    />
  );
};
