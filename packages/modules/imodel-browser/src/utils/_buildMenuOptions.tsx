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
 * @alpha
 */
export interface ContextMenuBuilderItemMUI<T = any>
  extends Omit<
    MuiMenuItemProps,
    "onClick" | "value" | "disabled" | "children"
  > {
  sourceAppId?: string;
  key: string;
  children: string | ((value: T) => string);
  /** SVG href for a Stratakit Icon rendered before the children. */
  icon?: string;
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

/**
 * Resolve `ContextMenuBuilderItemMUI<T>[]` for a specific value into
 * `MoreMenuItem[]` tuples suitable for the `<MoreMenu>` component.
 * @private
 */
export const resolveContextMenuItemsMUI = <T,>(
  items: ContextMenuBuilderItemMUI<T>[],
  value: T,
  refetchData?: () => void
): import("../components/MoreMenuMUI").MoreMenuItem[] => {
  return items
    .filter(({ visible }) =>
      typeof visible === "function" ? visible(value) : visible ?? true
    )
    .map(({ key, onClick, disabled, icon, children }) => ({
      key,
      label: typeof children === "function" ? children(value) : children,
      icon,
      disabled:
        typeof disabled === "function" ? disabled(value) : disabled ?? false,
      onClick: onClick ? () => onClick(value, refetchData) : undefined,
    }));
};
