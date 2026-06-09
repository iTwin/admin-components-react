/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import { Icon } from "@stratakit/mui";
import React from "react";

/**
 * Status icon displayed in the `avatar` slot to the left of the CardHeader on BaseCard components.
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
    <Box
      sx={{ width: "1.5rem", height: "1.5rem", color }}
      role="img"
      aria-label={status ? `${status} status` : undefined}
      aria-hidden={status ? undefined : "true"}
      data-testid="status-icon"
    >
      <Icon href={href} size="large" />
    </Box>
  );
}
