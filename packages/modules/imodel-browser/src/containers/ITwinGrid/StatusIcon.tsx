/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import CircularProgress from "@mui/material/CircularProgress";
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgItwin from "@stratakit/icons/itwin.svg";
import { Icon } from "@stratakit/mui";
import React from "react";

/** Icon displayed to the left of the title on iTwinTileMUI */
export function StatusIcon({
  status,
  loading,
  selected,
}: {
  status?: "positive" | "warning" | "negative";
  loading?: boolean;
  selected?: boolean;
}) {
  if (loading) {
    return <CircularProgress size={16} sx={{ mr: 0.5, flexShrink: 0 }} />;
  }

  const color =
    status === "positive"
      ? "success.main"
      : status === "warning"
      ? "warning.main"
      : status === "negative"
      ? "error.main"
      : undefined;

  const icon = selected ? svgCheckmark : svgItwin;

  return <Icon href={icon} size="regular" color={color} />;
}
