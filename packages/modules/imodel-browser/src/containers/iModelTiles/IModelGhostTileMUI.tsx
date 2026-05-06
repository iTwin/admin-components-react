/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Card, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import React, { forwardRef } from "react";

/**
 * Representation of a Ghost IModel — V2 (Stratakit/MUI migration target)
 */
export const IModelGhostTileMUI = forwardRef<HTMLDivElement, CardProps>(
  ({ ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="outlined"
        sx={{
          width: "fit-content",
          minWidth: "18rem",
        }}
        {...props}
      >
        {/* TODO: calc thumbnail size */}
        <Skeleton variant="rectangular" sx={{ height: 140 }} />
        <CardHeader
          title={
            <Skeleton variant="text">
              <Typography variant="h5">Skeleton Name</Typography>
            </Skeleton>
          }
        />
        <CardContent>
          <Skeleton variant="text">
            <Typography variant="body2">Skeleton Description</Typography>
          </Skeleton>
        </CardContent>
      </Card>
    );
  }
);
