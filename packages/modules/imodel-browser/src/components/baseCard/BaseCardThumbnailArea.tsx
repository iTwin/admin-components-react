/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import React from "react";
import { spreadSx } from "../../utils/spreadSx";

export interface BaseCardThumbnailAreaProps {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * Shared thumbnail area container used by BaseCard and BaseCardLoading
 * to ensure consistent sizing.
 */
export function BaseCardThumbnailArea({
  children,
  className,
  sx,
}: BaseCardThumbnailAreaProps) {
  return (
    <Box
      className={className}
      sx={[
        {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          aspectRatio: "16 / 10",
          overflow: "hidden",
        },
        ...spreadSx(sx),
      ]}
    >
      {children}
    </Box>
  );
}
