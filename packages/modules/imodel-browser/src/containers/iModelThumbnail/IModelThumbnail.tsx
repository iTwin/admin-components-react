/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./IModelThumbnail.scss";

import { Body } from "@itwin/itwinui-react";
import classNames from "classnames";
import React from "react";
import { useInView } from "react-intersection-observer";

import { ApiOverrides } from "../../types";
import { useIModelThumbnail } from "./useIModelThumbnail";

export type IModelThumbnailProps = {
  className?: string;
  /** Id of the iModel to fetch thumbnail for */
  iModelId: string;
  /** Triggered on the image click, controls pointer */
  onClick?(iModelId: string): void;
  /* Access token that requires the `imodels:read` scope. */
  accessToken?: string;
  /** Object that configures different overrides for the API
   * @property data thumbnail URL
   * @property serverEnvironmentPrefix Either qa or dev
   */
  apiOverrides?: ApiOverrides<string>;
};

/** Clickable iModel thumbnail, fetched from the servers */
export const IModelThumbnail = ({
  iModelId,
  onClick,
  accessToken,
  apiOverrides,
  className,
}: IModelThumbnailProps) => {
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
    <img
      className={classNames("iac-thumbnail", className)}
      style={{
        cursor: onClick ? "pointer" : "auto",
      }}
      id="base64image"
      src={thumbnail ?? ""}
      alt=""
      onClick={() => onClick?.(iModelId)}
    />
  ) : (
    <Body
      ref={ref}
      isSkeleton={true}
      style={{ height: "100%", width: "100%", margin: 0 }}
    ></Body>
  );
};
