/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import * as React from "react";

type Props = {
  menuItems:
    | ((close: () => void) => React.JSX.Element[])
    | React.JSX.Element[]
    | React.JSX.Element;
  prompt: React.ReactNode;
  "data-testid"?: string;
};

export default function MoreMenu({
  menuItems,
  prompt,
  "data-testid": dataTestId,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const buttonId = React.useId();
  if (!menuItems || (Array.isArray(menuItems) && menuItems.length === 0)) {
    return null;
  }

  return (
    <>
      <IconButton
        id={buttonId}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
        data-testid={dataTestId}
        onClick={(event) => {
          event.stopPropagation();
          console.log("clicked more button", { event });
          setAnchorEl(event.currentTarget);
        }}
        size="small"
      >
        {prompt}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": buttonId,
            dense: true,
          },
        }}
      >
        {typeof menuItems === "function" ? menuItems(handleClose) : menuItems}
      </Menu>
    </>
  );
}
