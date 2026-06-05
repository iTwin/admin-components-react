/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import { Icon } from "@stratakit/mui";
import React from "react";

/**
 * Status icon displayed to the left of the title on BaseCard components
 *
 * @alpha
 */
export function StatusIcon({
  status,
  href,
}: {
  // TODO: should these line up with Stratakit color names?
  status?: "positive" | "warning" | "negative";
  href?: string;
}) {
  const color =
    status === "positive"
      ? "var(--stratakit-color-icon-positive-base)"
      : status === "warning"
      ? "var(--stratakit-color-icon-attention-base)"
      : status === "negative"
      ? "var(--stratakit-color-icon-critical-base)"
      : undefined;

  return (
    <Box sx={{ color }}>
      <Icon href={href} size="large" />
    </Box>
  );
}
