/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MenuItem } from "@itwin/itwinui-react";
import React from "react";

import type { BaseCardActionItem } from "../components/baseCard/BaseCard";
import type { MoreMenuItem } from "../components/MoreMenuMUI";

type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuItem>;

export interface ContextMenuBuilderItem<T = any>
  extends Omit<MenuItemProps, "onClick" | "value" | "disabled"> {
  key: string;
  visible?: boolean | ((value: T) => boolean);
  onClick?: ((value?: T, refetchData?: () => void) => void) | undefined;
  disabled?: MenuItemProps["disabled"] | ((value: T) => boolean);
}

/**
 * MUI version of {@link ContextMenuBuilderItem}. Builds the "More Actions" menu items.
 * @alpha
 */
export interface MoreActionsMenuBuilderItemMUI<T = any> {
  sourceAppId?: string;
  key: string;
  label: string | ((value: T) => string);
  /** SVG href for a Stratakit Icon rendered before the label. */
  icon?: string;
  visible?: boolean | ((value: T) => boolean);
  onClick?: ((value: T, refetchData?: () => void) => void) | undefined;
  disabled?: boolean | ((value: T) => boolean);
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
 * Action button definition.
 *
 * Used at the grid level for `actions`. The grid resolves these into
 * `BaseCardActionItem[]` before passing them to tiles or table rows.
 * @alpha
 */
export interface ActionsBuilderItemMUI<T = any> {
  key: string;
  label: string | ((value: T) => string);
  onClick?: (value: T, refetchData?: () => void) => void;
  visible?: boolean | ((value: T) => boolean);
  disabled?: boolean | ((value: T) => boolean);
}

/**
 * Resolve `ActionsBuilderItemMUI<T>[]` for a specific entity into
 * `BaseCardActionItem[]` suitable for `<BaseCard>`.
 * @private
 */
export const resolveActionItemsMUI = <T,>(
  items: ActionsBuilderItemMUI<T>[],
  value: T,
  refetchData?: () => void
): BaseCardActionItem[] => {
  return items
    .filter(({ visible }) =>
      typeof visible === "function" ? visible(value) : visible ?? true
    )
    .map(({ key, label, onClick, disabled }) => ({
      key,
      label: typeof label === "function" ? label(value) : label,
      onClick: onClick ? () => onClick(value, refetchData) : undefined,
      disabled:
        typeof disabled === "function" ? disabled(value) : disabled ?? false,
    }));
};

/**
 * Resolve `MoreActionsMenuBuilderItemMUI<T>[]` for a specific value into
 * `MoreMenuItem[]` tuples suitable for the `<MoreMenu>` component.
 * @private
 */
export const resolveContextMenuItemsMUI = <T,>(
  items: MoreActionsMenuBuilderItemMUI<T>[],
  value: T,
  refetchData?: () => void
): MoreMenuItem[] => {
  return items
    .filter(({ visible }) =>
      typeof visible === "function" ? visible(value) : visible ?? true
    )
    .map(({ key, onClick, disabled, icon, label }) => ({
      key,
      label: typeof label === "function" ? label(value) : label,
      icon,
      disabled:
        typeof disabled === "function" ? disabled(value) : disabled ?? false,
      onClick: onClick ? () => onClick(value, refetchData) : undefined,
    }));
};
