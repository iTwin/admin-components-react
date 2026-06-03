/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import IconButton from "@mui/material/IconButton";
import React from "react";

/**
 * MUI {@link IconButton} with custom styling to allow it to be placed on top of thumbnail images.
 *
 * Used for "favorites" and "more options" on iModel/iTwin tiles and also available to consumers using the thumbnail slots.
 * @alpha
 */
export function ThumbnailIconButton(
  props: React.ComponentProps<typeof IconButton>
) {
  return (
    <IconButton
      {...props}
      size="small"
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.2)",
        color: "rgba(0,0,0, 0.2)",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.4)",
        },
        ...props.sx,
      }}
    >
      {props.children}
    </IconButton>
  );
}
ThumbnailIconButton.displayName = "ThumbnailIconButton";
