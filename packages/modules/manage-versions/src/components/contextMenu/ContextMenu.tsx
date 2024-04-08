/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { SvgMore } from "@itwin/itwinui-icons-react";
import { DropdownMenu, IconButton, MenuItem } from "@itwin/itwinui-react";
import React, { useCallback } from "react";

import { useConfig } from "../../common/configContext";

export type MenuAction = {
  icon?: JSX.Element;
  onClick: () => void;
  title: string;
  label: string;
  disabled?: boolean;
};

export interface ContextMenuProps {
  menuActions: MenuAction[];
}

export const ContextMenu = ({ menuActions }: ContextMenuProps) => {
  const { stringsOverrides } = useConfig();

  const menuItems = useCallback(
    (close: () => void) => {
      return menuActions.map((action, index) => (
        <MenuItem
          icon={action.icon}
          key={index}
          onClick={() => {
            close();
            action.onClick();
          }}
          title={action.title}
          disabled={action.disabled}
        >
          {action.label}
        </MenuItem>
      ));
    },
    [menuActions]
  );

  return (
    <DropdownMenu menuItems={menuItems}>
      <IconButton
        onClick={(e) => e.stopPropagation()}
        styleType="borderless"
        size="small"
        role="button"
        label={stringsOverrides.More}
      >
        <SvgMore />
      </IconButton>
    </DropdownMenu>
  );
};
