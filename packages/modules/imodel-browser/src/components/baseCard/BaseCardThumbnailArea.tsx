/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import React from "react";

export interface BaseCardThumbnailAreaProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Shared thumbnail area container used by BaseCard and BaseCardLoading
 * to ensure consistent sizing.
 */
export function BaseCardThumbnailArea({
  children,
  className,
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
      ]}
    >
      {children}
    </Box>
  );
}
