/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Tile } from "@bentley/itwinui-react";
import React from "react";

/**
 * Representation of a Ghost IModel
 */
export const IModelGhostTile = () => {
  return (
    <Tile
      name={
        <span className={"iui-skeleton"} style={{ width: "180px", margin: 0 }}>
          <br />
        </span>
      }
      description={
        <span className={"iui-skeleton"} style={{ width: "100%" }}>
          <br />
          <br />
        </span>
      }
      thumbnail={
        <span
          className={"iui-skeleton"}
          style={{ height: "100%", width: "100%", margin: 0 }}
        ></span>
      }
    />
  );
};
