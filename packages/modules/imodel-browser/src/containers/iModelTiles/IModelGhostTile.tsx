/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ThemeProvider, Tile } from "@itwin/itwinui-react";
import React, { forwardRef } from "react";

/**
 * Representation of a Ghost IModel
 */
export const IModelGhostTile = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <ThemeProvider ref={ref} theme="inherit" {...props}>
      <Tile.Wrapper>
        <Tile.Name
          className={"iui-skeleton"}
          style={{ width: "180px", margin: 0 }}
        >
          <br />
        </Tile.Name>
        <Tile.Description className={"iui-skeleton"} style={{ width: "100%" }}>
          <br />
          <br />
        </Tile.Description>
        <Tile.ThumbnailArea>
          <Tile.ThumbnailPicture
            className={"iui-skeleton"}
            style={{ height: "100%", width: "100%", margin: 0 }}
          />
        </Tile.ThumbnailArea>
      </Tile.Wrapper>
    </ThemeProvider>
  );
});
