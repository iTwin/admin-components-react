/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgImodel from "@stratakit/icons/imodel.svg";
import { Icon } from "@stratakit/mui";
import React from "react";

/** Status icon displayed to the left of the title on iModelTileMUI */
export function StatusIcon({
  status,

  selected,
}: {
  status?: "positive" | "warning" | "negative";
  selected?: boolean;
}) {
  const color =
    status === "positive"
      ? "success.main"
      : status === "warning"
      ? "warning.main"
      : status === "negative"
      ? "error.main"
      : undefined;

  const icon = selected ? svgCheckmark : svgImodel;

  return <Icon href={icon} size="regular" color={color} />;
}
