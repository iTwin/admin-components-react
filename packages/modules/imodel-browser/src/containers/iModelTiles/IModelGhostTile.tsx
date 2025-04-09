/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Text, ThemeProvider, Tile } from "@itwin/itwinui-react";
import React, { forwardRef } from "react";

/**
 * Representation of a Ghost IModel
 */
export const IModelGhostTile = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <ThemeProvider ref={ref} theme="inherit" {...props}>
      <Tile.Wrapper>
        <Tile.Name style={{ width: "180px", margin: 0 }}>
          <br />
        </Tile.Name>
        <Tile.Description style={{ width: "100%" }}>
          <Text isSkeleton />
          <br />
          <br />
        </Tile.Description>
        <Tile.ThumbnailArea>
          <Tile.ThumbnailPicture
            style={{ height: "100%", width: "100%", margin: 0 }}
          />
          <Text isSkeleton />
        </Tile.ThumbnailArea>
      </Tile.Wrapper>
    </ThemeProvider>
  );
});
