import { MenuItem } from "@itwin/itwinui-react";
import React from "react";
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuItem>;
export interface ContextMenuBuilderItem<T = any> extends Omit<MenuItemProps, "onClick" | "value" | "disabled"> {
    key: string;
    visible?: boolean | ((value: T) => boolean);
    onClick?: ((value?: T, refetchData?: () => void) => void) | undefined;
    disabled?: MenuItemProps["disabled"] | ((value: T) => boolean);
}
/** Build MenuItem array for the value for each provided options
 * @private
 */
export declare const _buildManagedContextMenuOptions: <T>(options: ContextMenuBuilderItem<T>[] | undefined, value: T, closeMenu?: () => void, refetchData?: () => void) => JSX.Element[] | undefined;
/**
 * Action button definition.
 *
 * Used at the grid level for `actions`. The grid resolves these into {@link ResolvedCardActionItem}
 * before passing them to tiles or table rows.
 * @alpha
 */
export interface CardActionsItemMUI<T = any> {
    key: string;
    label: string | ((value: T) => string);
    onClick?: (value: T, refetchData?: () => void) => void;
    visible?: boolean | ((value: T) => boolean);
    disabled?: boolean | ((value: T) => boolean);
}
/**
 * Resolved version of {@link CardActionsItemMUI} with all functions evaluated and ready to use.
 * @alpha
 */
export interface ResolvedCardActionItem {
    key: string;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}
/**
 * Resolve `CardActionsItemMUI<T>[]` for specific values, e.g. for a given iTwin or iModel, into `ResolvedCardActionItem[]` that can be used by tiles or table rows.
 * @private
 */
export declare const resolveCardActionsItemsMUI: <T>(items: CardActionsItemMUI<T>[], value: T, refetchData?: () => void) => ResolvedCardActionItem[];
/**
 * Returns the primary (first visible) resolved card action, or `undefined` when
 * there are none for use as the primary button or row action.
 */
export declare const getPrimaryCardAction: (actions: ResolvedCardActionItem[] | undefined) => ResolvedCardActionItem | undefined;
/**
 * Definition for the "More Actions" menu items.
 * @alpha
 */
export interface MoreActionsMenuItemMUI<T = any> {
    key: string;
    label: string | ((value: T) => string);
    /** SVG href for a Stratakit Icon rendered before the label. */
    icon?: string;
    visible?: boolean | ((value: T) => boolean);
    onClick?: ((value: T, refetchData?: () => void) => void) | undefined;
    disabled?: boolean | ((value: T) => boolean);
}
/**
 * Resolved version of {@link MoreActionsMenuItemMUI} with all functions evaluated and ready to use.
 * @alpha
 */
export interface ResolvedMoreActionsMenuItem {
    key: string;
    label: string;
    /** SVG href for a Stratakit Icon rendered before the label. */
    icon?: string;
    onClick?: () => void;
    disabled?: boolean;
}
/**
 * Resolve `MoreActionsMenuItemMUI<T>[]` for specific values, e.g. for a given iTwin or iModel.
 * @private
 */
export declare const resolveMoreActionsMenuItemsMUI: <T>(items: MoreActionsMenuItemMUI<T>[], value: T, refetchData?: () => void) => ResolvedMoreActionsMenuItem[];
export {};
