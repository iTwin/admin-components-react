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
        bgcolor: "var(--stratakit-color-bg-mono-transparent)",
        backdropFilter: "blur(0.5rem)",
        WebkitBackdropFilter: "blur(0.5rem)",
        mixBlendMode: "exclusion",
        "&:hover": {
          bgcolor: "var(--stratakit-color-bg-mono-transparent)",
        },
        ...props.sx,
      }}
    >
      {props.children}
    </IconButton>
  );
}
ThumbnailIconButton.displayName = "ThumbnailIconButton";
