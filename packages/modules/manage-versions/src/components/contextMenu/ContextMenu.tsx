/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { SvgMore } from "@itwin/itwinui-icons-react";
import { DropdownMenu, IconButton, MenuItem } from "@itwin/itwinui-react";
import React from "react";

export type MenuAction = {
  icon?: JSX.Element;
  onClick: () => void;
  title: string;
  label: string;
  disabled?: boolean;
};

export interface ContextMenuProps {
  menuActions: MenuAction[];
  isMenuOpen: boolean;
  toggleMenu: (rowId: string) => void;
  rowId: string;
  onClose: () => void;
}

export const ContextMenu = ({
  menuActions,
  isMenuOpen,
  toggleMenu,
  rowId,
  onClose,
}: ContextMenuProps) => {
  return (
    <DropdownMenu
      onClickOutside={onClose}
      menuItems={() =>
        menuActions.map((action, index) => (
          <MenuItem
            {...action}
            key={index}
            onClick={() => {
              onClose();
              action.onClick();
            }}
            title={action.title}
            disabled={action.disabled}
          >
            {action.label}
          </MenuItem>
        ))
      }
      className="bnt-named-version-context-menu"
      visible={isMenuOpen}
    >
      <IconButton
        onClick={() => toggleMenu(rowId)}
        styleType="borderless"
        size="small"
        role="button"
        title="More"
      >
        <SvgMore />
      </IconButton>
    </DropdownMenu>
  );
};
