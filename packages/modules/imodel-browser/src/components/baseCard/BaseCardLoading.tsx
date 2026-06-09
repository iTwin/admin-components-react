/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Card, { type CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import React, { forwardRef } from "react";

import { BaseCardThumbnailArea } from "./BaseCardThumbnailArea";

/** @alpha */
export type BaseCardLoadingProps = CardProps;

/** @alpha */
export const BaseCardLoading = forwardRef<HTMLDivElement, CardProps>(
  ({ ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="outlined"
        aria-busy="true"
        aria-label="Loading"
        {...props}
      >
        <BaseCardThumbnailArea>
          <Skeleton
            variant="rectangular"
            sx={{ width: "100%", height: "100%" }}
          />
        </BaseCardThumbnailArea>
        <CardHeader
          title={
            <Skeleton variant="text">
              {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
              <Typography variant="h2" render={<h2 />} />
            </Skeleton>
          }
        />
        <CardContent>
          <Skeleton variant="text">
            <Typography variant="body2" />
          </Skeleton>
        </CardContent>
      </Card>
    );
  }
);
