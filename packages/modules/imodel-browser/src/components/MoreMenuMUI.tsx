/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { Icon } from "@stratakit/mui";

export interface MoreMenuItem {
  key: string;
  label: string;
  /** SVG href for a Stratakit Icon rendered before the label. */
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface MoreMenuHandle {
  openAtPosition: (position: { mouseX: number; mouseY: number }) => void;
}

interface Props {
  items: MoreMenuItem[];
  prompt: React.ReactNode;
  label: string;
  "data-testid"?: string;
}

/**
 * More menu component for MUI.
 *
 * Renders an icon-button trigger and a dropdown menu of items.
 * Supports imperative `openAtPosition` via ref for right-click context menus.
 *
 * @alpha
 */
const MoreMenuMUI = React.forwardRef<MoreMenuHandle, Props>(
  ({ items, prompt, label, "data-testid": dataTestId }, ref) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [contextMenuPosition, setContextMenuPosition] = React.useState<{
      mouseX: number;
      mouseY: number;
    } | null>(null);

    const menuOpen = anchorEl !== null || contextMenuPosition !== null;

    const handleClose = React.useCallback(() => {
      setAnchorEl(null);
      setContextMenuPosition(null);
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        openAtPosition: (position) => {
          setAnchorEl(null);
          setContextMenuPosition(position);
        },
      }),
      []
    );

    const buttonId = React.useId();

    if (items.length === 0) {
      return null;
    }

    return (
      <>
        <IconButton
          id={buttonId}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : "false"}
          data-testid={dataTestId}
          aria-label={label}
          onClick={(event) => {
            setContextMenuPosition(null);
            setAnchorEl(event.currentTarget);
          }}
          size="small"
        >
          {prompt}
        </IconButton>
        <Menu
          anchorReference={anchorEl ? "anchorEl" : "anchorPosition"}
          anchorEl={anchorEl}
          anchorPosition={
            contextMenuPosition
              ? {
                  top: contextMenuPosition.mouseY,
                  left: contextMenuPosition.mouseX,
                }
              : undefined
          }
          open={menuOpen}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            list: {
              "aria-labelledby": buttonId,
              dense: true,
            },
          }}
        >
          {items.map(({ key, label: itemLabel, icon, onClick, disabled }) => (
            <MenuItem key={key} disabled={disabled} onClick={() => onClick?.()}>
              {icon && (
                <ListItemIcon>
                  <Icon href={icon} />
                </ListItemIcon>
              )}
              <ListItemText>{itemLabel}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
);

MoreMenuMUI.displayName = "MoreMenu";
export default MoreMenuMUI;
