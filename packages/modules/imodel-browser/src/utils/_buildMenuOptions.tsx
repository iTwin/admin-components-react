/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MenuItem } from "@itwin/itwinui-react";
import MuiMenuItem from "@mui/material/MenuItem";
import React from "react";

type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuItem>;
type MuiMenuItemProps = React.ComponentPropsWithoutRef<typeof MuiMenuItem>;

export interface ContextMenuBuilderItem<T = any>
  extends Omit<MenuItemProps, "onClick" | "value" | "disabled"> {
  key: string;
  visible?: boolean | ((value: T) => boolean);
  onClick?: ((value?: T, refetchData?: () => void) => void) | undefined;
  disabled?: MenuItemProps["disabled"] | ((value: T) => boolean);
}

/** MUI version of ContextMenuBuilderItem for use with Material-UI MenuItem components.
 * Used by MUI components and passed to the BaseCard.
 */
export interface ContextMenuBuilderItemMUI<T = any>
  extends Omit<
    MuiMenuItemProps,
    "onClick" | "value" | "disabled" | "children"
  > {
  key: string;
  children: React.ReactNode | ((value: T) => React.ReactNode);
  visible?: boolean | ((value: T) => boolean);
  onClick?: ((value?: T, refetchData?: () => void) => void) | undefined;
  disabled?: MuiMenuItemProps["disabled"] | ((value: T) => boolean);
}

/** Build MenuItem array for the value for each provided options
 * @private
 */
export const _buildManagedContextMenuOptions: <T>(
  options: ContextMenuBuilderItem<T>[] | undefined,
  value: T,
  closeMenu?: () => void,
  refetchData?: () => void
) => JSX.Element[] | undefined = (options, value, closeMenu, refetchData) => {
  return options
    ?.filter?.(({ visible }) => {
      return typeof visible === "function" ? visible(value) : visible ?? true;
    })
    .map(({ key, visible, onClick, disabled, ...contextMenuProps }) => {
      return (
        <MenuItem
          {...contextMenuProps}
          disabled={typeof disabled === "function" ? disabled(value) : disabled}
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            closeMenu?.();
            onClick?.(value, refetchData);
          }}
          key={key}
        />
      );
    });
};

/** Build MUI MenuItem array for the given options. Used by MUI components and passed to the BaseCard.
 * @private
 */
export const buildContextMenuItemsMUI = <T,>(
  options: ContextMenuBuilderItemMUI<T>[] | undefined,
  value: T,
  closeMenu?: () => void,
  refetchData?: () => void
): JSX.Element[] | undefined => {
  return options
    ?.filter(({ visible }) =>
      typeof visible === "function" ? visible(value) : visible ?? true
    )
    .map(({ key, onClick, disabled, children, ...muiMenuItemProps }) => (
      <MuiMenuItem
        {...muiMenuItemProps}
        key={key}
        disabled={typeof disabled === "function" ? disabled(value) : disabled}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          closeMenu?.();
          onClick?.(value, refetchData);
        }}
      >
        {typeof children === "function" ? children(value) : children}
      </MuiMenuItem>
    ));
};
