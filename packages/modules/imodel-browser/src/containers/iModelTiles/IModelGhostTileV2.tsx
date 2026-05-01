/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Text, ThemeProvider, Tile } from "@itwin/itwinui-react";
import React, { forwardRef } from "react";

interface IModelGhostTileV2Props {
  fullWidth?: boolean;
}

/**
 * Representation of a Ghost IModel — V2 (Stratakit/MUI migration target)
 */
export const IModelGhostTileV2 = forwardRef<
  HTMLDivElement,
  IModelGhostTileV2Props
>(({ fullWidth, ...props }, ref) => {
  return (
    <ThemeProvider ref={ref} theme="inherit" {...props}>
      <Tile.Wrapper style={fullWidth ? { width: "100%" } : undefined}>
        <Tile.ThumbnailArea>
          <Text isSkeleton>Skeleton</Text>
        </Tile.ThumbnailArea>
        <Tile.Name>
          <Text isSkeleton variant="leading">
            Skeleton Name
          </Text>
        </Tile.Name>
        <Tile.ContentArea>
          <Tile.Description>
            <Text isSkeleton variant="title">
              Skeleton Description
            </Text>
          </Tile.Description>
        </Tile.ContentArea>
      </Tile.Wrapper>
    </ThemeProvider>
  );
});
