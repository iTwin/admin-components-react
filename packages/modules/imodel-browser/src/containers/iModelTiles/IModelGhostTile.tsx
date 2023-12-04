/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Text, ThemeProvider, Tile } from "@itwin/itwinui-react";
import React from "react";

/**
 * Representation of a Ghost IModel
 */
export const IModelGhostTile = () => {
  return (
    <ThemeProvider theme="inherit">
      <Tile.Wrapper>
        <Tile.ThumbnailArea>
          <Text
            isSkeleton={true}
            style={{
              borderRadius: "0",
            }}
          ></Text>
        </Tile.ThumbnailArea>
        <Tile.Name>
          <Text isSkeleton={true} style={{ width: "180px", margin: 0 }}>
            <br />
          </Text>
        </Tile.Name>
        <Tile.ContentArea>
          <Tile.Description>
            <Text isSkeleton={true} style={{ width: "100%" }}>
              <br />
              <br />
            </Text>
          </Tile.Description>
        </Tile.ContentArea>
      </Tile.Wrapper>
    </ThemeProvider>
  );
};
