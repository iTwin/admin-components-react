/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import classNames from "classnames";
import React from "react";
import { useInView } from "react-intersection-observer";

import { useIModelThumbnail } from "../../../containers/iModelThumbnail/useIModelThumbnail";
import { AccessTokenProvider, ApiOverrides, Logger } from "../../../types";
import { defaultLogger } from "../../../utils/_defaultLogger";

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
  /** Callbacks will be used for logging any potentially useful information. Defaults to logging to console if not provided. */
  logger?: Logger;
}

/**
 * iModel thumbnail, fetched from the servers
 *
 * Currently the API will return a placeholder PNG thumbnail when the user has not chosen a custom thumbnail.
 * Unfortunately that means we can not show a nicely-formatted SVG thumbnail for those iModels.
 *
 * @alpha
 */
export const IModelThumbnailMUI = ({
  iModelId,
  accessToken,
  apiOverrides,
  className,
  logger = defaultLogger,
}: IModelThumbnailMUIProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    skip: !!apiOverrides?.data,
  });
  const thumbnail = useIModelThumbnail(
    iModelId,
    inView ? accessToken : undefined,
    apiOverrides,
    logger
  );
  return thumbnail ? (
    <CardMedia
      image={thumbnail}
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={classNames("iac-thumbnail", className)}
      sx={{ height: "100%" }}
    />
  ) : (
    <Skeleton
      variant="rectangular"
      ref={ref}
      aria-hidden="true"
      sx={{ height: "100%", width: "100%", minHeight: 140 }}
    />
  );
};
