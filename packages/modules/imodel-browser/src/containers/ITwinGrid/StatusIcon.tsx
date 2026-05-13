/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgItwin from "@stratakit/icons/itwin.svg";
import { Icon } from "@stratakit/mui";
import React from "react";

/** Icon displayed to the left of the title on iTwinTileMUI */
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

  const icon = selected ? svgCheckmark : svgItwin;

  return <Icon href={icon} size="regular" color={color} render={undefined} />;
}
