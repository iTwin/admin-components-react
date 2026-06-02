/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import svgImodel from "@stratakit/icons/imodel.svg";
import svgSearch from "@stratakit/icons/search.svg";
import { Icon } from "@stratakit/mui";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import styles from "./NoResultsMUI.module.scss";

/** @alpha */
export interface NoResultsMUIProps {
  /** Displayed text */
  text: string;
  subtext?: string;
  isSearchResult?: boolean;
}

/**
 * Pre-formatted empty result page (MUI version)
 * @alpha
 */
export const NoResultsMUI = ({
  text,
  subtext,
  isSearchResult = false,
}: NoResultsMUIProps) => {
  return (
    <Box
      data-testid="no-results"
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        m: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Icon
          href={isSearchResult ? svgSearch : svgImodel}
          size="large"
          color="textSecondary"
          className={styles.muiIcon}
        />
        <Typography variant="h6">{text}</Typography>
        {subtext && <Typography variant="body1">{subtext}</Typography>}
      </Box>
    </Box>
  );
};
