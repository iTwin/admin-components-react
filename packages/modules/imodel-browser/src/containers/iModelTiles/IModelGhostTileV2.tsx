/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
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
    <Card
      ref={ref}
      variant="outlined"
      style={fullWidth ? { width: "100%" } : undefined}
      {...props}
    >
      <Skeleton variant="rectangular" sx={{ height: 140 }} />
      <CardHeader
        title={<Skeleton variant="text" sx={{ fontSize: "1.25rem", width: "60%" }} />}
      />
      <CardContent>
        <Skeleton variant="text" />
        <Skeleton variant="text" sx={{ width: "80%" }} />
      </CardContent>
    </Card>
  );
});
