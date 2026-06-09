import Box from '@mui/material/Box';
import * as React from 'react';
import React__default, { forwardRef, useState, useCallback, useEffect } from 'react';
import { useInView, InView } from 'react-intersection-observer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { SvgSearch, SvgImodelHollow } from '@itwin/itwinui-icons-react';
import { Text } from '@itwin/itwinui-react';
import svgImodel from '@stratakit/icons/imodel.svg';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import svgMore from '@stratakit/icons/more-vertical.svg';
import { Icon } from '@stratakit/mui';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import pinIcon from '@stratakit/icons/pin.svg';
import classNames from 'classnames';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import svgItwin from '@stratakit/icons/itwin.svg';
import svgSearch from '@stratakit/icons/search.svg';

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Shared thumbnail area container used by BaseCard and BaseCardLoading
 * to ensure consistent sizing.
 */
function BaseCardThumbnailArea({ children, className, }) {
    return (React__default.createElement(Box, { className: className, sx: [
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                aspectRatio: "16 / 10",
                overflow: "hidden",
            },
        ] }, children));
}

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @alpha */
const BaseCardLoading = forwardRef(({ ...props }, ref) => {
    return (React__default.createElement(Card, { ref: ref, variant: "outlined", "aria-busy": "true", "aria-label": "Loading", ...props },
        React__default.createElement(BaseCardThumbnailArea, null,
            React__default.createElement(Skeleton, { variant: "rectangular", sx: { width: "100%", height: "100%" } })),
        React__default.createElement(CardHeader, { title: React__default.createElement(Skeleton, { variant: "text" },
                React__default.createElement(Typography, { variant: "h2", render: React__default.createElement("h2", null) })) }),
        React__default.createElement(CardContent, null,
            React__default.createElement(Skeleton, { variant: "text" },
                React__default.createElement(Typography, { variant: "body2" })))));
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".iac-no-results-container{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;margin:1em}.iac-no-results-container .iac-no-results{display:flex;flex-direction:column;align-items:center;gap:var(--iui-size-2xs)}.iac-no-results-container .iac-no-results>svg{height:var(--iui-size-2xl);width:var(--iui-size-2xl);fill:var(--iui-color-icon-muted);margin-bottom:var(--iui-size-2xs)}";
styleInject(css_248z$1);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Pre-formatted empty result page */
const NoResults = ({ text, subtext, isSearchResult = false, }) => {
    return (React__default.createElement("div", { className: "iac-no-results-container" },
        React__default.createElement("div", { className: "iac-no-results" },
            isSearchResult ? React__default.createElement(SvgSearch, null) : React__default.createElement(SvgImodelHollow, null),
            React__default.createElement(Text, { variant: "leading" }, text),
            subtext && React__default.createElement(Text, null, subtext))));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Build APIM server url out of overrides
 * @private
 */
const _getAPIServer = (serverEnvironmentPrefix) => `https://${serverEnvironmentPrefix ? `${serverEnvironmentPrefix}-` : ""}api.bentley.com`;
/**
 * Merge 2 objects without overriding keys with undefined or null values.
 * @param defaults Complete string object
 * @param overrides Potentially incomplete string object
 * @returns
 */
const _mergeStrings = (defaults, overrides) => !overrides
    ? { ...defaults }
    : Object.keys(overrides).reduce((red, val) => {
        if ((overrides[val] ?? red[val]) !== red[val]) {
            red[val] = overrides[val];
        }
        return red;
    }, { ...defaults });

async function addIModelToRecents(options) {
    const { iModelId, accessToken, serverEnvironmentPrefix } = options;
    try {
        if (!accessToken) {
            return;
        }
        const token = typeof accessToken === "function" ? await accessToken() : accessToken;
        const url = `${_getAPIServer(serverEnvironmentPrefix)}/imodels/recents/${encodeURIComponent(iModelId)}`;
        // fire-and-forget POST to record recents; swallow errors so UI isn't disrupted
        void fetch(url, {
            method: "POST",
            headers: {
                authorization: token,
                Accept: "application/vnd.bentley.itwin-platform.v2+json",
            },
        });
    }
    catch (e) {
        // keep parity with previous behavior where errors were swallowed
        // Log for diagnostics
        // eslint-disable-next-line no-console
        console.error("Failed to add iModel to recents", e);
    }
}
async function removeIModelFromRecents(options) {
    const { iModelId, accessToken, serverEnvironmentPrefix } = options;
    try {
        if (!accessToken) {
            return;
        }
        const token = typeof accessToken === "function" ? await accessToken() : accessToken;
        const url = `${_getAPIServer(serverEnvironmentPrefix)}/imodels/recents/${encodeURIComponent(iModelId)}`;
        await fetch(url, {
            method: "DELETE",
            headers: {
                authorization: token,
                Accept: "application/vnd.bentley.itwin-platform.v2+json",
            },
        });
    }
    catch (e) {
        // keep parity with previous behavior where errors were swallowed
        // Log for diagnostics
        // eslint-disable-next-line no-console
        console.error("Failed to remove iModel from recents", e);
    }
}
async function getIModelFavorites(options) {
    const { iTwinId, accessToken, serverEnvironmentPrefix, abortSignal } = options;
    const token = typeof accessToken === "function" ? await accessToken() : accessToken;
    const url = `${_getAPIServer(serverEnvironmentPrefix)}/imodels/favorites?iTwinId=${iTwinId}`;
    const result = await fetch(url, {
        headers: {
            authorization: token,
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
        signal: abortSignal,
    });
    if (abortSignal?.aborted) {
        throw new Error("The fetch request was aborted by the cleanup function.");
    }
    if (!result) {
        throw new Error(`Failed to fetch iModels favorites from ${url}.\nNo response.`);
    }
    if (result.status !== 200) {
        throw new Error(`Failed to fetch iModels favorites from ${url}.\nStatus: ${result.status}`);
    }
    const response = await result.json();
    return response.iModels;
}
async function addIModelToFavorites(options) {
    const { iModelId, accessToken, serverEnvironmentPrefix } = options;
    const token = typeof accessToken === "function" ? await accessToken() : accessToken;
    const url = `${_getAPIServer(serverEnvironmentPrefix)}/imodels/favorites/${iModelId}`;
    const result = await fetch(url, {
        method: "PUT",
        headers: {
            authorization: token,
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
    });
    if (!result || (result.status !== 200 && result.status !== 204)) {
        throw new Error(`Failed to add iModel ${iModelId} to favorites`);
    }
}
async function removeIModelFromFavorites(options) {
    const { iModelId, accessToken, serverEnvironmentPrefix } = options;
    const token = typeof accessToken === "function" ? await accessToken() : accessToken;
    const url = `${_getAPIServer(serverEnvironmentPrefix)}/imodels/favorites/${iModelId}`;
    const result = await fetch(url, {
        method: "DELETE",
        headers: {
            authorization: token,
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
    });
    if (!result || (result.status !== 200 && result.status !== 204)) {
        throw new Error(`Failed to remove iModel ${iModelId} from favorites`);
    }
}

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Custom hook to manage iModel favorites.
 * @param iTwinId - The ID of the iTwin for which to fetch favorites.
 * @param accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param serverEnvironmentPrefix - Optional server environment prefix.
 * @param disabled - Optional flag to disable fetching of the favorites in the hook.
 * @returns An object containing:
 * - {Set<string>} iModelFavorites - A set of iModel IDs that are marked as favorites.
 * - {function} addIModelToFavorites - A function to add an iModel to favorites.
 * - {function} removeIModelFromFavorites - A function to remove an iModel from favorites.
 */
const useIModelFavorites = (iTwinId, accessToken, serverEnvironmentPrefix, disabled) => {
    const [iModelFavorites, setIModelFavorites] = useState(new Set());
    /**
     * Adds an iModel to the favorites.
     * @param {string} iModelId - The ID of the iModel to add to favorites.
     * @returns {Promise<void>}
     */
    const addIModelToFavorites$1 = useCallback(async (iModelId) => {
        if (!accessToken || !iModelId || iModelId === "") {
            return;
        }
        try {
            await addIModelToFavorites({
                iModelId,
                accessToken,
                serverEnvironmentPrefix,
            });
            setIModelFavorites((prev) => new Set([...prev, iModelId]));
        }
        catch (error) {
            console.error(error);
        }
    }, [accessToken, serverEnvironmentPrefix]);
    /**
     * Removes an iModel from the favorites.
     * @param {string} iModelId - The ID of the iModel to remove from favorites.
     * @returns {Promise<void>}
     */
    const removeIModelFromFavorites$1 = useCallback(async (iModelId) => {
        if (!accessToken || !iModelId || iModelId === "") {
            return;
        }
        try {
            await removeIModelFromFavorites({
                iModelId,
                accessToken,
                serverEnvironmentPrefix,
            });
            setIModelFavorites((prev) => {
                const newFavorites = new Set(prev);
                newFavorites.delete(iModelId);
                return newFavorites;
            });
        }
        catch (error) {
            console.error(error);
        }
    }, [accessToken, serverEnvironmentPrefix]);
    useEffect(() => {
        const controller = new AbortController();
        /**
         * Fetches iTwin favorites and updates the state.
         * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
         */
        const fetchIModelFavorites = async (abortSignal) => {
            try {
                if (disabled || !iTwinId || !accessToken) {
                    setIModelFavorites(new Set());
                    return;
                }
                const favorites = await getIModelFavorites({
                    iTwinId,
                    accessToken,
                    serverEnvironmentPrefix,
                    abortSignal,
                });
                setIModelFavorites(new Set(favorites.map((favorite) => favorite.id)));
            }
            catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }
                console.error(error);
            }
        };
        void fetchIModelFavorites(controller.signal);
        return () => {
            controller.abort();
        };
    }, [disabled, iTwinId, accessToken, serverEnvironmentPrefix]);
    return {
        iModelFavorites,
        addIModelToFavorites: addIModelToFavorites$1,
        removeIModelFromFavorites: removeIModelFromFavorites$1,
    };
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const IModelFavoritesContext = React__default.createContext(undefined);
const IModelFavoritesProvider = ({ iTwinId, accessToken, serverEnvironmentPrefix, children, disabled, }) => {
    const { iModelFavorites, addIModelToFavorites, removeIModelFromFavorites } = useIModelFavorites(iTwinId, accessToken, serverEnvironmentPrefix === "dev" || serverEnvironmentPrefix === "qa"
        ? serverEnvironmentPrefix
        : undefined, disabled);
    const value = React__default.useMemo(() => ({
        favorites: iModelFavorites,
        add: addIModelToFavorites,
        remove: removeIModelFromFavorites,
    }), [iModelFavorites, addIModelToFavorites, removeIModelFromFavorites]);
    return (React__default.createElement(IModelFavoritesContext.Provider, { value: value }, children));
};
const useIModelFavoritesContext = () => {
    const ctx = React__default.useContext(IModelFavoritesContext);
    if (!ctx) {
        console.warn("useIModelFavoritesContext must be used within IModelFavoritesProvider");
    }
    return ctx;
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
var DataStatus;
(function (DataStatus) {
    DataStatus["Fetching"] = "fetching";
    DataStatus["Complete"] = "complete";
    DataStatus["FetchFailed"] = "error_fetchFailed";
    DataStatus["TokenRequired"] = "error_tokenRequired";
    DataStatus["ContextRequired"] = "error_contextRequired";
})(DataStatus || (DataStatus = {}));
/* Supported IModel cell columns */
var IModelCellColumn;
(function (IModelCellColumn) {
    IModelCellColumn["Favorite"] = "Favorite";
    IModelCellColumn["Name"] = "name";
    IModelCellColumn["Description"] = "description";
    IModelCellColumn["LastModified"] = "lastChangesetPushDateTime";
    /** @deprecated Since 4.1.0. Use `LastModified` instead. */
    IModelCellColumn["CreatedDateTime"] = "createdDateTime";
    IModelCellColumn["Options"] = "options";
})(IModelCellColumn || (IModelCellColumn = {}));
/* Supported ITwin cell columns */
var ITwinCellColumn;
(function (ITwinCellColumn) {
    ITwinCellColumn["Favorite"] = "Favorite";
    ITwinCellColumn["Number"] = "ITwinNumber";
    ITwinCellColumn["Name"] = "ITwinName";
    ITwinCellColumn["LastModified"] = "LastModified";
    ITwinCellColumn["Options"] = "options";
})(ITwinCellColumn || (ITwinCellColumn = {}));

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Resolve `ActionsBuilderItemMUI<T>[]` for a specific entity into
 * `BaseCardActionItem[]` suitable for `<BaseCard>`.
 * @private
 */
const resolveActionItemsMUI = (items, value, refetchData) => {
    return items
        .filter(({ visible }) => typeof visible === "function" ? visible(value) : visible ?? true)
        .map(({ key, label, onClick, disabled }) => ({
        key,
        label: typeof label === "function" ? label(value) : label,
        onClick: onClick ? () => onClick(value, refetchData) : undefined,
        disabled: typeof disabled === "function" ? disabled(value) : disabled ?? false,
    }));
};
/**
 * Resolve `MoreActionsMenuBuilderItemMUI<T>[]` for a specific value into
 * `MoreMenuItem[]` tuples suitable for the `<MoreMenu>` component.
 * @private
 */
const resolveContextMenuItemsMUI = (items, value, refetchData) => {
    return items
        .filter(({ visible }) => typeof visible === "function" ? visible(value) : visible ?? true)
        .map(({ key, onClick, disabled, icon, label }) => ({
        key,
        label: typeof label === "function" ? label(value) : label,
        icon,
        disabled: typeof disabled === "function" ? disabled(value) : disabled ?? false,
        onClick: onClick ? () => onClick(value, refetchData) : undefined,
    }));
};

/** Flatten an optional SxProps value into spreadable array elements. */
const spreadSx = (sx) => Array.isArray(sx) ? sx : sx ? [sx] : [];

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * More menu component for MUI.
 *
 * Renders an icon-button trigger and a dropdown menu of items.
 * Supports imperative `openAtPosition` via ref for right-click context menus.
 *
 * @alpha
 */
const MoreMenuMUI = React.forwardRef(({ items, prompt, label, tabIndex }, ref) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [contextMenuPosition, setContextMenuPosition] = React.useState(null);
    const menuOpen = anchorEl !== null || contextMenuPosition !== null;
    const handleClose = React.useCallback(() => {
        setAnchorEl(null);
        setContextMenuPosition(null);
    }, []);
    React.useImperativeHandle(ref, () => ({
        openAtPosition: (position) => {
            setAnchorEl(null);
            setContextMenuPosition(position);
        },
    }), []);
    const buttonId = React.useId();
    if (items.length === 0) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(IconButton, { id: buttonId, "aria-haspopup": "true", "aria-expanded": menuOpen ? "true" : "false", "aria-label": label, tabIndex: tabIndex, onClick: (event) => {
                // Prevent the click from bubbling to an ancestor handler
                // (e.g. DataGrid row click / card action) when opening the menu.
                event.stopPropagation();
                setContextMenuPosition(null);
                setAnchorEl(event.currentTarget);
            }, size: "small", "data-testid": "more-options-button" }, prompt),
        React.createElement(Menu, { anchorReference: anchorEl ? "anchorEl" : "anchorPosition", anchorEl: anchorEl, anchorPosition: contextMenuPosition
                ? {
                    top: contextMenuPosition.mouseY,
                    left: contextMenuPosition.mouseX,
                }
                : undefined, open: menuOpen, onClose: handleClose, transformOrigin: { horizontal: "right", vertical: "top" }, anchorOrigin: { horizontal: "right", vertical: "bottom" }, slotProps: {
                list: {
                    "aria-labelledby": buttonId,
                    dense: true,
                },
            }, "data-testid": "more-options-menu" }, items.map(({ key, label: itemLabel, icon, onClick, disabled }) => (React.createElement(MenuItem, { key: key, disabled: disabled, onClick: () => {
                onClick?.();
                handleClose();
            } },
            icon && (React.createElement(ListItemIcon, null,
                React.createElement(Icon, { href: icon }))),
            React.createElement(ListItemText, null, itemLabel)))))));
});
MoreMenuMUI.displayName = "MoreMenu";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Status icon displayed in the `avatar` slot to the left of the CardHeader on BaseCard components.
 *
 * @alpha
 */
function StatusIcon({ status, href, }) {
    const color = status === "positive"
        ? "var(--stratakit-color-icon-positive-base)"
        : status === "warning"
            ? "var(--stratakit-color-icon-attention-base)"
            : status === "negative"
                ? "var(--stratakit-color-icon-critical-base)"
                : undefined;
    return (React__default.createElement(Box, { sx: { width: "1.5rem", height: "1.5rem", color }, role: "img", "aria-label": status ? `${status} status` : undefined, "aria-hidden": status ? undefined : "true", "data-testid": "status-icon" },
        React__default.createElement(Icon, { href: href, size: "large" })));
}

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const baseCardSx = {
    overflow: "hidden",
    minWidth: "18rem",
    minHeight: "15rem",
    display: "flex",
    flexDirection: "column",
};
/**
 * Base card component built on MUI Card.
 *
 * Base card is very customizable. As such, it isn't recommended to use BaseCard directly since
 * design discipline will go out the window.  Prefer to build specific card components for your use case on top of BaseCard.
 *
 * @alpha
 */
const BaseCard = React__default.forwardRef(({ thumbnail, thumbnailTopLeft, thumbnailTopRight, thumbnailBottomRight, thumbnailBottomLeft, title, statusIconHref, description, subheader, thumbnailAlt, actions, moreActions, loading, disabled: cardDisabled, status, stringsOverrides, className, sx, ...rest }, ref) => {
    const titleId = React__default.useId();
    const thumbnailNode = typeof thumbnail === "string" ? (React__default.createElement(CardMedia, { image: thumbnail, role: "img", "aria-label": thumbnailAlt ?? "", sx: { height: "100%", backgroundSize: "cover" } })) : (thumbnail);
    const moreMenuRef = React__default.useRef(null);
    const handleContextMenu = React__default.useCallback((event) => {
        if (!moreActions?.length) {
            return;
        }
        event.preventDefault();
        moreMenuRef.current?.openAtPosition({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    }, [moreActions]);
    const hasContextMenu = !!moreActions?.length;
    const visibleActions = actions?.filter(({ visible }) => visible ?? true);
    const singleAction = visibleActions?.length === 1 ? visibleActions[0] : undefined;
    const multipleActions = visibleActions && visibleActions.length > 1 ? visibleActions : undefined;
    if (loading) {
        return (React__default.createElement(BaseCardLoading, { className: className, sx: { ...baseCardSx, ...spreadSx(sx) } }));
    }
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(Card, { ref: ref, variant: "outlined", ...rest, className: className, "aria-labelledby": titleId, ...(cardDisabled ? { inert: "" } : {}), onContextMenu: !cardDisabled && hasContextMenu ? handleContextMenu : undefined, sx: [
                {
                    ...baseCardSx,
                    cursor: cardDisabled ? "not-allowed" : "default",
                },
                ...spreadSx(sx),
            ] },
            React__default.createElement(BaseCardThumbnailArea, null,
                thumbnailTopLeft && (React__default.createElement(Box, { sx: { position: "absolute", top: 8, left: 8, zIndex: 1 } }, thumbnailTopLeft)),
                thumbnailTopRight && (React__default.createElement(Box, { sx: {
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        display: "flex",
                        gap: "4px",
                    } }, thumbnailTopRight)),
                thumbnailNode,
                thumbnailBottomLeft && (React__default.createElement(Box, { sx: { position: "absolute", bottom: 8, left: 8, zIndex: 1 } }, thumbnailBottomLeft)),
                thumbnailBottomRight && (React__default.createElement(Box, { sx: { position: "absolute", bottom: 8, right: 8, zIndex: 1 } }, thumbnailBottomRight))),
            React__default.createElement(Divider, { role: "presentation", sx: {
                    borderColor: status === "positive"
                        ? "var(--stratakit-color-border-positive-base)"
                        : status === "warning"
                            ? "var(--stratakit-color-border-attention-base)"
                            : status === "negative"
                                ? "var(--stratakit-color-border-critical-base)"
                                : undefined,
                } }),
            React__default.createElement(CardHeader, { avatar: statusIconHref ? (React__default.createElement(StatusIcon, { href: statusIconHref, status: status })) : undefined, title: singleAction ? (React__default.createElement(CardActionArea, { onClick: !cardDisabled && !singleAction.disabled
                        ? singleAction.onClick
                        : undefined, disabled: cardDisabled ? true : singleAction.disabled }, title)) : (title), action: hasContextMenu && !cardDisabled ? (React__default.createElement(MoreMenuMUI, { ref: moreMenuRef, items: moreActions, label: stringsOverrides?.moreOptions ?? "More options", prompt: React__default.createElement(Icon, { href: svgMore }), "data-testid": "show-context-menu-button" })) : undefined, subheader: subheader, sx: [{ alignItems: "flex-start" }], slotProps: {
                    title: {
                        component: "h2",
                        id: titleId,
                        sx: [
                            {
                                flex: 1,
                                minWidth: 0,
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            },
                        ],
                    },
                    subheader: {
                        component: "h3",
                    },
                } }),
            description ? (React__default.createElement(CardContent, { "data-testid": "card-description" },
                React__default.createElement(Typography, { variant: "body2", color: "textSecondary" }, description))) : (React__default.createElement(CardContent, { sx: { pt: 0 } })),
            multipleActions && (React__default.createElement(CardActions, null, multipleActions.map(({ key, label, onClick, disabled }) => (React__default.createElement(Button, { key: key, onClick: onClick, disabled: cardDisabled ? true : disabled }, label))))))));
});
BaseCard.displayName = "BaseCard";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const activeBgColor = "var(--stratakit-color-bg-positive-muted)";
const mutedBgColor = "var(--stratakit-color-bg-neutral-muted)";
/**
 * Icon button intended for overlaying on top of a thumbnail image
 * (e.g. favorites, more-options menu).
 * @alpha
 */
function ThumbnailIconButton(props) {
    const { sx, icon, muted, onClick, ...rest } = props;
    const bgcolor = muted ? mutedBgColor : activeBgColor;
    return (React__default.createElement(IconButton, { ...rest, onClick: (event) => {
            event.stopPropagation();
            onClick?.(event);
        }, size: "small", sx: [
            {
                bgcolor,
                "&:hover": {
                    bgcolor: activeBgColor,
                },
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ] },
        React__default.createElement(Icon, { href: icon })));
}
ThumbnailIconButton.displayName = "ThumbnailIconButton";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Reusable favorite icon button for Tile and Table components.
 *
 * Hidden (`opacity: 0`) when not favorited — the parent is responsible for
 * revealing it on hover / focus-within by targeting the `.favoriteIcon` class.
 * Always visible when favorited.
 */
const FavoriteIconMUI = ({ isFavorite, onAddToFavorites, onRemoveFromFavorites, addLabel, removeLabel, disabled, className = "", transparent, tabIndex, }) => {
    return (React__default.createElement(ThumbnailIconButton, { "aria-label": isFavorite ? removeLabel : addLabel, "aria-pressed": isFavorite, tabIndex: tabIndex, onClick: async () => {
            isFavorite ? await onRemoveFromFavorites() : await onAddToFavorites();
        }, className: `favoriteIcon${isFavorite ? " isFavorite" : ""}${className ? " " + className : ""}`, disabled: disabled, muted: !isFavorite, icon: pinIcon, sx: {
            ...(!isFavorite && { opacity: 0 }),
            ...(transparent && {
                bgcolor: "transparent",
                "&:hover": { bgcolor: "transparent" },
            }),
        } }));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Convert buffer response to URL format: data:image/png;base64 */
function convertArrayBufferToUrlBase64PNG(buffer) {
    const byteArray = new Uint8Array(buffer);
    if (!byteArray || byteArray.length === 0) {
        throw new Error("Expected an image to be returned from the query");
    }
    const base64Data = btoa(byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), ""));
    return `data:image/png;base64,${base64Data}`;
}
/** Use cached thumbnail or upload thumbnail from server */
const useIModelThumbnail = (iModelId, accessToken, apiOverrides) => {
    const [thumbnail, setThumbnail] = useState();
    useEffect(() => {
        if (apiOverrides?.data) {
            setThumbnail(apiOverrides.data);
            return;
        }
        const abortController = new AbortController();
        if (!thumbnail && accessToken && iModelId) {
            const makeFetchRequest = async () => {
                const options = {
                    signal: abortController.signal,
                    headers: {
                        Authorization: typeof accessToken === "function"
                            ? await accessToken()
                            : accessToken,
                        Accept: "application/vnd.bentley.itwin-platform.v2+json",
                        Prefer: "return=representation",
                    },
                };
                const response = await fetch(`${_getAPIServer(apiOverrides?.serverEnvironmentPrefix)}/imodels/${iModelId}/thumbnail`, options);
                const thumbnail = response.ok
                    ? await response.arrayBuffer().then(convertArrayBufferToUrlBase64PNG)
                    : response.status === 404
                        ? svgImodel
                        : await response.text().then((errorText) => {
                            throw new Error(errorText);
                        });
                setThumbnail(thumbnail);
            };
            makeFetchRequest().catch((e) => {
                if (e.name === "AbortError") {
                    // Aborting because unmounting is not an error, swallow.
                    return;
                }
                console.error("Thumbnail download error", "Thumbnail Fetch", {
                    iModelId,
                    e,
                });
            });
        }
        return () => {
            abortController.abort();
        };
    }, [
        accessToken,
        iModelId,
        thumbnail,
        apiOverrides?.data,
        apiOverrides?.serverEnvironmentPrefix,
    ]);
    return thumbnail;
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Clickable iModel thumbnail, fetched from the servers — MUI (Stratakit/MUI migration target)
 * @alpha
 */
const IModelThumbnailMUI = ({ iModelId, accessToken, apiOverrides, className, }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        skip: !!apiOverrides?.data,
    });
    const thumbnail = useIModelThumbnail(iModelId, inView ? accessToken : undefined, apiOverrides);
    return thumbnail ? (React__default.createElement(CardMedia, { image: thumbnail, ref: ref, role: "presentation", "aria-hidden": "true", className: classNames("iac-thumbnail", className), sx: { height: "100%" } })) : (React__default.createElement(Skeleton, { variant: "rectangular", ref: ref, "aria-hidden": "true", sx: { height: "100%", width: "100%", minHeight: 140 } }));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 * @alpha
 */
const IModelTileMUI = ({ iModel, moreActions: moreActionItems, accessToken, apiOverrides, stringsOverrides, refetchIModels, hideFavoriteIcon, loading, disabled, status, thumbnail, thumbnailTopLeft, thumbnailBottomLeft, getBadge, badge, title, description, subheader, actions, className, ...rest }) => {
    const favoritesContext = React__default.useContext(IModelFavoritesContext);
    const strings = _mergeStrings({
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        moreOptions: "More options",
    }, stringsOverrides);
    const moreActions = React__default.useMemo(() => moreActionItems
        ?.filter(({ visible }) => typeof visible === "function" ? visible(iModel) : visible ?? true)
        .map(({ key, label, icon, onClick, disabled }) => ({
        key,
        label: typeof label === "function" ? label(iModel) : label,
        icon,
        onClick: onClick ? () => onClick(iModel, refetchIModels) : undefined,
        disabled: typeof disabled === "function" ? disabled(iModel) : disabled,
    })), [moreActionItems, iModel, refetchIModels]);
    const thumbnailApiOverride = apiOverrides || iModel.thumbnail
        ? { ...(apiOverrides ?? {}), data: iModel.thumbnail }
        : undefined;
    const isFavorite = favoritesContext?.favorites.has(iModel.id) ?? false;
    const favoriteIcon = !hideFavoriteIcon && favoritesContext ? (React__default.createElement(FavoriteIconMUI, { isFavorite: isFavorite, onAddToFavorites: () => favoritesContext.add(iModel.id), onRemoveFromFavorites: () => favoritesContext.remove(iModel.id), addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, disabled: disabled })) : undefined;
    if (badge && getBadge) {
        console.warn("Both badge and getBadge props were provided to IModelTileMUI. The getBadge function will take precedence over the badge prop.");
    }
    return (React__default.createElement(BaseCard, { className: className, sx: {
            "&:hover .favoriteIcon, &:focus-within .favoriteIcon": {
                opacity: 1,
            },
        }, disabled: disabled, loading: loading, thumbnail: thumbnail ?? (React__default.createElement(IModelThumbnailMUI, { iModelId: iModel.id, accessToken: accessToken, apiOverrides: thumbnailApiOverride })), thumbnailTopLeft: thumbnailTopLeft, thumbnailTopRight: favoriteIcon, thumbnailBottomLeft: thumbnailBottomLeft, thumbnailBottomRight: getBadge?.(iModel) ?? badge, title: title ?? iModel.displayName ?? "", actions: actions, moreActions: moreActions, status: status, statusIconHref: svgImodel, description: description ?? iModel.description ?? "", subheader: subheader, stringsOverrides: stringsOverrides, "data-testid": `imodel-tile-${iModel.id}`, ...rest }));
};

/**
 * Client-side sort applied to the MUI iModel grid for tile view when the
 * request type is "recents" or "favorites" — the server does not honor sort
 * options for those request types, so we sort on the client.
 */
const clientSideIModelSort = (iModels, { viewMode, requestType, sort }) => {
    if (viewMode !== "tile")
        return iModels;
    if (requestType !== "recents" && requestType !== "favorites")
        return iModels;
    const sortValue = (iModel) => {
        const currValue = sort.sortType === "name"
            ? iModel.displayName ?? iModel.name ?? ""
            : iModel[sort.sortType] ?? "";
        return currValue.toLocaleLowerCase();
    };
    return [...iModels].sort((a, b) => {
        const aValue = sortValue(a);
        const bValue = sortValue(b);
        return sort.descending
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
    });
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// TODO: investigate infinite scroll as an alternative to built-in pagination
// MUI X DataGrid Pro supports onRowsScrollEnd, but the free version does not.
/**
 * Table view for iModels using MUI X DataGrid (Community edition).
 */
const IModelTableMUI = ({ iModels, moreActions, actions, strings, refetchIModels, tableOverrides: { columnOverrides = {}, hideColumns = [] } = {}, isLoading, fetchMore, }) => {
    const favoritesContext = useIModelFavoritesContext();
    const columns = React__default.useMemo(() => {
        const cols = [
            !hideColumns.includes(IModelCellColumn.Favorite) && {
                field: "id",
                headerName: strings.tableColumnFavorites,
                sortable: false,
                width: 70,
                disableColumnMenu: true,
                renderCell: (params) => {
                    const isFavorite = favoritesContext?.favorites.has(params.value);
                    return (React__default.createElement(FavoriteIconMUI, { isFavorite: !!isFavorite, addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, onAddToFavorites: () => favoritesContext?.add?.(params.value), onRemoveFromFavorites: () => favoritesContext?.remove?.(params.value), transparent: true, tabIndex: params.tabIndex }));
                },
                ...columnOverrides[IModelCellColumn.Favorite],
            },
            !hideColumns.includes(IModelCellColumn.Name) && {
                field: "name",
                headerName: strings.tableColumnName,
                flex: 1,
                minWidth: 200,
                disableColumnMenu: true,
                ...columnOverrides[IModelCellColumn.Name],
            },
            !hideColumns.includes(IModelCellColumn.Description) && {
                field: "description",
                headerName: strings.tableColumnDescription,
                flex: 1,
                minWidth: 200,
                sortable: false,
                disableColumnMenu: true,
                ...columnOverrides[IModelCellColumn.Description],
            },
            !hideColumns.includes(IModelCellColumn.LastModified) &&
                !hideColumns.includes(IModelCellColumn.CreatedDateTime) && {
                field: "lastChangesetPushDateTime",
                headerName: strings.tableColumnLastModified,
                width: 200,
                valueGetter: (value, row) => row.lastChangesetPushDateTime ?? row.createdDateTime ?? "",
                valueFormatter: (value) => {
                    if (!value) {
                        return "";
                    }
                    return new Date(value).toLocaleDateString();
                },
                disableColumnMenu: true,
                ...columnOverrides[IModelCellColumn.LastModified],
            },
            !hideColumns.includes(IModelCellColumn.Options) && {
                field: "actions",
                headerName: "",
                sortable: false,
                width: 50,
                disableColumnMenu: true,
                renderCell: (params) => {
                    if (!moreActions || moreActions.length === 0) {
                        return null;
                    }
                    const items = resolveContextMenuItemsMUI(moreActions, params.row, refetchIModels);
                    return (React__default.createElement(MoreMenuMUI, { items: items, label: strings.moreOptions, prompt: React__default.createElement(Icon, { href: svgMore }), tabIndex: params.tabIndex }));
                },
                ...columnOverrides[IModelCellColumn.Options],
            },
        ];
        return cols.filter(Boolean);
    }, [
        strings,
        favoritesContext,
        columnOverrides,
        hideColumns,
        moreActions,
        refetchIModels,
    ]);
    return (React__default.createElement(DataGrid, { rows: iModels, columns: columns, loading: isLoading, onRowClick: actions ? (params) => actions(params.row)[0]?.onClick?.() : undefined, onCellKeyDown: actions
            ? (params, event) => {
                if ((event.key === "Enter" || event.key === " ") &&
                    params.field !== "id" &&
                    params.field !== "actions") {
                    event.preventDefault();
                    actions(params.row)[0]?.onClick?.();
                }
            }
            : undefined, disableRowSelectionOnClick: true, disableMultipleRowSelection: true, disableColumnSelector: true, disableColumnFilter: true, initialState: {
            pagination: { paginationModel: { pageSize: 25 } },
        }, pageSizeOptions: [25, 50, 100], localeText: {
            noRowsLabel: strings.noRowsLabel,
            noResultsOverlayLabel: strings.noResultsOverlayLabel,
            footerRowSelected: strings.footerRowSelected,
            footerTotalVisibleRows: strings.footerTotalVisibleRows,
            paginationRowsPerPage: strings.paginationRowsPerPage,
        }, sx: {
            // prevent individual cells from showing focus outlines
            "& .MuiDataGrid-cell:focus": {
                outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
            },
            // reveal unfavorited icon on row hover or keyboard focus
            "& .MuiDataGrid-row:hover .favoriteIcon, & .MuiDataGrid-row:focus-within .favoriteIcon": {
                opacity: 1,
            },
            ...(actions && {
                "& .MuiDataGrid-row": {
                    cursor: "pointer",
                },
            }),
        } }));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Runtime check that we are not fed invalid sort type */
function isSupportedSortType(sortType) {
    return (!!sortType &&
        [
            "displayName",
            "name",
            "description",
            "initialized",
            "createdDateTime",
        ].includes(sortType));
}
const sortEitherEmptyValues = (a, b) => (!a && !b ? 0 : !a ? 1 : -1);
const sortBooleanOrEqualValues = (a, b) => (a === b ? 0 : a ? -1 : 1);
const sortStringValues = (a, b) => a.localeCompare(b);
const useIModelSort = (iModels, options, 
// needed to account for limitation of react hooks
enableSort = true) => {
    const sortType = typeof options !== "function" ? options?.sortType : undefined;
    const descending = typeof options !== "function" ? options?.descending ?? false : undefined;
    const sortFn = typeof options === "function" ? options : undefined;
    return React__default.useMemo(() => {
        if (!enableSort) {
            return iModels;
        }
        if (sortFn) {
            return [...iModels].sort(sortFn);
        }
        if (!isSupportedSortType(sortType)) {
            return iModels;
        }
        const sorted = [...iModels].sort((iModelA, iModelB) => {
            const a = iModelA[sortType];
            const b = iModelB[sortType];
            if (typeof a === "boolean" || typeof b === "boolean" || a === b) {
                return sortBooleanOrEqualValues(a, b);
            }
            if (!a || !b) {
                return sortEitherEmptyValues(a, b);
            }
            // Look this file history on gitHub for dateTimeStringValuesSorting on "createdDateTime"
            return sortStringValues(a, b);
        });
        return descending ? sorted.reverse() : sorted;
    }, [enableSort, sortFn, sortType, iModels, descending]);
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const DEFAULT_PAGE_SIZE = 100;
const useIModelData = ({ requestType = "", iTwinId, accessToken, sortOptions, apiOverrides, searchText, pageSize = DEFAULT_PAGE_SIZE, maxCount, dataMode, onLoadMore, onRefetch, }) => {
    const [needsUpdate, setNeedsUpdate] = React__default.useState(true);
    const [iModels, setIModels] = React__default.useState([]);
    const [status, setStatus] = React__default.useState();
    const [page, setPage] = React__default.useState(0);
    const [morePagesAvailable, setMorePagesAvailable] = React__default.useState(true);
    const [abortController, setAbortController] = React__default.useState(undefined);
    const sortType = sortOptions && ["name", "createdDateTime"].includes(sortOptions.sortType)
        ? sortOptions.sortType
        : undefined; //Only available sort-by API at the moment.
    const [previousSortOptions, setPreviousSortOptions] = React__default.useState(sortOptions && { ...sortOptions });
    const sortDescending = sortOptions?.descending;
    const sortedIModels = useIModelSort(iModels, sortOptions, requestType !== "recents");
    // For recents and favorites, apply client-side filtering based on searchText
    const filteredIModels = React__default.useMemo(() => {
        if (!searchText?.trim() ||
            (requestType !== "recents" && requestType !== "favorites")) {
            return sortedIModels;
        }
        const lowerSearchText = searchText.toLowerCase();
        return sortedIModels.filter((iModel) => (iModel.name?.toLowerCase().includes(lowerSearchText) ?? false) ||
            (iModel.description?.toLowerCase().includes(lowerSearchText) ?? false));
    }, [sortedIModels, searchText, requestType]);
    const sortChanged = sortOptions?.descending !== previousSortOptions?.descending ||
        sortOptions?.sortType !== previousSortOptions?.sortType;
    if (sortChanged) {
        setPreviousSortOptions(sortOptions);
    }
    // cleanup the abort controller when unmounting
    useEffect(() => () => abortController?.abort(), [abortController]);
    const reset = React__default.useCallback(() => {
        if (dataMode === "external") {
            return;
        }
        setStatus(DataStatus.Fetching);
        setIModels([]);
        setPage(0);
        setMorePagesAvailable(true);
        setNeedsUpdate(true);
    }, [dataMode]);
    const fetchMore = React__default.useCallback(() => {
        if (dataMode === "external") {
            return;
        }
        if (needsUpdate ||
            status === DataStatus.Fetching ||
            status === DataStatus.TokenRequired ||
            status === DataStatus.ContextRequired ||
            !morePagesAvailable) {
            return;
        }
        setPage((page) => page + 1);
        setNeedsUpdate(true);
    }, [dataMode, needsUpdate, status, morePagesAvailable]);
    React__default.useEffect(() => {
        if (dataMode === "external") {
            return;
        }
        // start from scratch when any external state changes
        if (requestType !== "recents" && requestType !== "favorites") {
            reset();
        }
    }, [
        dataMode,
        iTwinId,
        accessToken,
        sortOptions?.descending,
        sortOptions?.sortType,
        apiOverrides?.data,
        apiOverrides?.serverEnvironmentPrefix,
        searchText,
        pageSize,
        maxCount,
        requestType,
        reset,
    ]);
    React__default.useEffect(() => {
        if (dataMode === "external") {
            return;
        }
        // start from scratch when any external state changes
        if (requestType === "recents" || requestType === "favorites") {
            reset();
        }
    }, [
        dataMode,
        iTwinId,
        accessToken,
        sortOptions?.descending,
        sortOptions?.sortType,
        apiOverrides?.data,
        apiOverrides?.serverEnvironmentPrefix,
        pageSize,
        maxCount,
        requestType,
        reset,
    ]);
    // Main function
    React__default.useEffect(() => {
        if (dataMode === "external" || !needsUpdate) {
            return;
        }
        setNeedsUpdate(false);
        abortController?.abort();
        setAbortController(undefined);
        if (!accessToken || !iTwinId) {
            setStatus(!accessToken ? DataStatus.TokenRequired : DataStatus.ContextRequired);
            setIModels([]);
            return;
        }
        // If sort changes but we already have all the data, let client side sorting do its job
        if (sortChanged && !morePagesAvailable) {
            setStatus(DataStatus.Complete);
            return;
        }
        // Otherwise, fetch from server
        setStatus(DataStatus.Fetching);
        const { abortController: newAbortController, fetchIModels } = createFetchIModelsFn(iTwinId, accessToken, sortType, sortDescending ?? false, page, searchText, pageSize, maxCount, apiOverrides?.serverEnvironmentPrefix, requestType);
        setAbortController(newAbortController);
        fetchIModels()
            .then(({ iModels, morePagesAvailable }) => {
            setMorePagesAvailable(morePagesAvailable);
            setIModels((prev) => page === 0 ? [...iModels] : [...prev, ...iModels]);
            setStatus(DataStatus.Complete);
        })
            .catch((e) => {
            if (e.name === "AbortError") {
                // Aborting because unmounting is not an error, swallow.
                return;
            }
            setIModels([]);
            setMorePagesAvailable(false);
            setStatus(DataStatus.FetchFailed);
            console.error(e);
        });
    }, [
        dataMode,
        abortController,
        accessToken,
        apiOverrides?.data,
        apiOverrides?.serverEnvironmentPrefix,
        iModels,
        iTwinId,
        maxCount,
        pageSize,
        morePagesAvailable,
        needsUpdate,
        page,
        requestType,
        searchText,
        sortChanged,
        sortDescending,
        sortType,
    ]);
    if (dataMode === "external") {
        return {
            iModels: apiOverrides?.data ?? [],
            status: apiOverrides?.isLoading
                ? DataStatus.Fetching
                : DataStatus.Complete,
            fetchMore: apiOverrides?.hasMoreData && !apiOverrides.isLoading
                ? onLoadMore
                : undefined,
            refetchIModels: onRefetch ??
                (() => {
                    // No-op in external mode - consumer handles refetch
                }),
        };
    }
    return {
        iModels: filteredIModels,
        status,
        fetchMore: morePagesAvailable ? fetchMore : undefined,
        refetchIModels: reset,
    };
};
const createFetchIModelsFn = (iTwinId, accessToken, sortType, sortDescending, page, searchText, pageSize = DEFAULT_PAGE_SIZE, maxCount, serverEnvironmentPrefix, requestType = "") => {
    const selection = `?iTwinId=${encodeURIComponent(iTwinId)}`;
    const sorting = sortType
        ? `&$orderBy=${encodeURIComponent(sortType)} ${sortDescending ? "desc" : "asc"}`
        : "";
    const skip = page * pageSize;
    if (maxCount !== undefined && skip >= maxCount) {
        const abortController = new AbortController();
        return {
            abortController,
            fetchIModels: async () => ({
                iModels: [],
                morePagesAvailable: false,
            }),
        };
    }
    const endpoint = ["favorites", "recents"].includes(requestType)
        ? requestType
        : "";
    const top = maxCount ? Math.min(pageSize, maxCount - skip) : pageSize;
    const paging = `&$skip=${skip}&$top=${top}`;
    // Only apply server-side search for non-recents and non-favorites requests
    const searching = searchText?.trim() && !["favorites", "recents"].includes(requestType)
        ? `&$search=${encodeURIComponent(searchText)}`
        : "";
    const abortController = new AbortController();
    const url = `${_getAPIServer(serverEnvironmentPrefix)}/imodels/${endpoint}${selection}${sorting}${paging}${searching}`;
    const doFetchRequest = async () => {
        const options = {
            signal: abortController.signal,
            headers: {
                Authorization: typeof accessToken === "function" ? await accessToken() : accessToken,
                Prefer: "return=representation",
                Accept: "application/vnd.bentley.itwin-platform.v2+json",
            },
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const result = await response.json();
        const totalLocalIModels = page * pageSize + result.iModels.length;
        return {
            iModels: result.iModels,
            morePagesAvailable: !(totalLocalIModels === maxCount || result.iModels.length < top),
        };
    };
    return {
        abortController,
        fetchIModels: doFetchRequest,
    };
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Component to display a grid or table of iModels within a given iTwin.
 *
 * This is the Stratakit/MUI version of the IModelGrid. It is still under active development and may have breaking changes.
 *
 * Feedback is most welcome.
 * @alpha
 */
const IModelGridMUI = (props) => {
    return (React__default.createElement(IModelFavoritesProvider, { iTwinId: props.iTwinId, accessToken: props.accessToken, serverEnvironmentPrefix: props.apiOverrides?.serverEnvironmentPrefix, disabled: props.tileOverrides?.hideFavoriteIcon },
        React__default.createElement(IModelGridInternal, { ...props })));
};
const IModelGridInternal = ({ accessToken, apiOverrides, moreActions, removeFromRecentsIcon, actions, iTwinId, sortOptions = { sortType: "name", descending: false }, requestType, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, emptyStateComponent, searchText, viewMode, pageSize, maxCount, tableOverrides, className, onLoadMore, onRefetch, dataMode = "internal", disableAddToRecents = false, }) => {
    const [sort, setSort] = React__default.useState(sortOptions);
    React__default.useEffect(() => {
        setSort(viewMode === "cells"
            ? {
                sortType: "name",
                descending: false,
            }
            : {
                sortType: sortOptions.sortType,
                descending: sortOptions.descending,
            });
    }, [sortOptions.descending, sortOptions.sortType, viewMode]);
    const strings = _mergeStrings({
        tableColumnFavorites: "",
        tableColumnName: "Name",
        tableColumnDescription: "Description",
        tableColumnLastModified: "Last Modified",
        tableLoadingData: "Loading...",
        noIModelSearch: "No results found",
        noIModelSearchSubtext: "Try adjusting your search by using fewer or more general terms.",
        noIModels: requestType === "recents"
            ? "There are no recent iModels."
            : requestType === "favorites"
                ? "There are no favorite iModels."
                : "There are no iModels in this iTwin.",
        noContext: "No context provided",
        noAuthentication: "No access token provided",
        error: "An error occurred",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        removeFromRecents: "Remove from recents",
        moreOptions: "More options",
        noRowsLabel: "No rows",
        noResultsOverlayLabel: "No results found.",
        paginationRowsPerPage: "Rows per page:",
        footerRowSelected: (count) => count !== 1
            ? `${count.toLocaleString()} rows selected`
            : `${count.toLocaleString()} row selected`,
        footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,
    }, stringsOverrides);
    const enhancedMoreActions = React__default.useMemo(() => {
        // Add "Remove from recents" action when viewing recents
        if (requestType === "recents") {
            const action = removeFromRecentsAction(strings, accessToken, apiOverrides, removeFromRecentsIcon);
            return moreActions ? [action, ...moreActions] : [action];
        }
        return moreActions;
    }, [
        requestType,
        moreActions,
        strings,
        removeFromRecentsIcon,
        accessToken,
        apiOverrides,
    ]);
    const { iModels: fetchediModels, status: fetchStatus, fetchMore, refetchIModels, } = useIModelData({
        requestType,
        accessToken,
        apiOverrides,
        iTwinId,
        sortOptions: sort,
        searchText,
        maxCount,
        pageSize,
        viewMode,
        dataMode,
        onLoadMore,
        onRefetch,
    });
    const iModels = React__default.useMemo(() => {
        const processed = postProcessCallback?.([...fetchediModels], fetchStatus, searchText) ??
            fetchediModels;
        return clientSideIModelSort(processed, { viewMode, requestType, sort });
    }, [
        postProcessCallback,
        fetchediModels,
        fetchStatus,
        searchText,
        viewMode,
        requestType,
        sort,
    ]);
    React__default.useEffect(() => {
        if (iModels.length < (pageSize ?? DEFAULT_PAGE_SIZE) &&
            fetchMore &&
            fetchStatus !== DataStatus.Fetching) {
            fetchMore();
        }
    }, [iModels.length, pageSize, fetchMore, fetchStatus]);
    const iModelClickAndAddToRecents = async (iModel, clickFn) => {
        if (!accessToken || disableAddToRecents) {
            clickFn();
            return;
        }
        void addIModelToRecents({
            iModelId: iModel.id,
            accessToken,
            serverEnvironmentPrefix: apiOverrides?.serverEnvironmentPrefix,
        }).catch((e) => {
            // swallow errors to avoid disrupting the UI
            console.error("Failed to add iModel to recents", e);
        });
        clickFn();
    };
    const noResultsText = {
        [DataStatus.Fetching]: "",
        [DataStatus.Complete]: strings.noIModels,
        [DataStatus.FetchFailed]: strings.error,
        [DataStatus.TokenRequired]: strings.noAuthentication,
        [DataStatus.ContextRequired]: strings.noContext,
    }[fetchStatus ?? DataStatus.Fetching];
    const tileApiOverrides = apiOverrides
        ? { serverEnvironmentPrefix: apiOverrides.serverEnvironmentPrefix }
        : undefined;
    const resolveActions = React__default.useCallback((iModel) => {
        if (!actions?.length) {
            return [];
        }
        const resolved = resolveActionItemsMUI(actions, iModel);
        if (!resolved.length) {
            return resolved;
        }
        const [first, ...rest] = resolved;
        return [
            {
                ...first,
                onClick: first.onClick
                    ? () => iModelClickAndAddToRecents(iModel, first.onClick)
                    : undefined,
            },
            ...rest,
        ];
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, disableAddToRecents, apiOverrides?.serverEnvironmentPrefix]);
    const renderIModelGridStructure = () => {
        return (React__default.createElement(React__default.Fragment, null, viewMode !== "cells" ? (React__default.createElement(Box, { component: "ul", sx: {
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
                listStyle: "none",
                p: 0,
                m: 0,
            }, className: className, "data-testid": "itwin-grid" },
            iModels?.map((iModel) => (React__default.createElement("li", { key: iModel.id },
                React__default.createElement(IModelHookedTile, { iModel: iModel, moreActions: enhancedMoreActions, accessToken: accessToken, apiOverrides: tileApiOverrides, useTileState: useIndividualState, refetchIModels: refetchIModels, stringsOverrides: stringsOverrides, ...tileOverrides, actions: resolveActions(iModel) })))),
            fetchMore ? (React__default.createElement("li", null,
                React__default.createElement(InView, { onChange: (inView) => {
                        inView &&
                            fetchStatus !== DataStatus.Fetching &&
                            fetchMore();
                    } }, ({ ref }) => {
                    return React__default.createElement(BaseCardLoading, { ref: ref });
                }))) : null,
            fetchStatus === DataStatus.Fetching && (React__default.createElement(React__default.Fragment, null,
                React__default.createElement("li", null,
                    React__default.createElement(BaseCardLoading, null)),
                React__default.createElement("li", null,
                    React__default.createElement(BaseCardLoading, null)))))) : (React__default.createElement(IModelTableMUI, { iModels: iModels, moreActions: enhancedMoreActions, actions: actions ? resolveActions : undefined, strings: strings, refetchIModels: refetchIModels, tableOverrides: tableOverrides, isLoading: fetchStatus === DataStatus.Fetching, fetchMore: fetchMore, "data-testid": "itwin-table" }))));
    };
    const renderComponent = () => {
        if (!searchText &&
            iModels.length === 0 &&
            noResultsText === strings.noIModels &&
            emptyStateComponent) {
            return React__default.createElement(React__default.Fragment, null, emptyStateComponent);
        }
        if (!searchText && iModels.length === 0 && noResultsText) {
            return React__default.createElement(NoResults, { text: noResultsText });
        }
        if (searchText &&
            iModels.length === 0 &&
            fetchStatus !== DataStatus.Fetching) {
            return (React__default.createElement(NoResults, { text: strings.noIModelSearch, subtext: strings.noIModelSearchSubtext, isSearchResult: true }));
        }
        return renderIModelGridStructure();
    };
    return renderComponent();
};
const noOp$1 = () => ({});
const IModelHookedTile = (props) => {
    const { useTileState = noOp$1, ...iModelTileProps } = props;
    const hookIdentity = React__default.useRef(useTileState);
    if (hookIdentity.current !== useTileState) {
        throw new Error("Even when used in a prop, useIndividualState identity must remain stable as it is used as a hook.");
    }
    const tileState = useTileState(props.iModel, iModelTileProps);
    return React__default.createElement(IModelTileMUI, { ...iModelTileProps, ...tileState });
};
function removeFromRecentsAction(strings, accessToken, apiOverrides, removeFromRecentsIcon) {
    return {
        key: "remove-from-recents",
        icon: removeFromRecentsIcon,
        label: strings?.removeFromRecents ?? "Remove from recents",
        onClick: async (iModel, refetchData) => {
            if (!iModel || !accessToken) {
                return;
            }
            await removeIModelFromRecents({
                iModelId: iModel.id,
                accessToken,
                serverEnvironmentPrefix: apiOverrides?.serverEnvironmentPrefix,
            });
            refetchData?.();
        },
    };
}

var css_248z = ".iac-iTwinCell{display:flex;flex-direction:column;justify-content:center;overflow:hidden}.iac-iTwinCell>*{overflow:hidden;text-overflow:ellipsis;max-width:100%}.row-cursor div[role=row]{cursor:pointer}";
styleInject(css_248z);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// TODO: investigate infinite scroll as an alternative to built-in pagination
// MUI X DataGrid Pro supports onRowsScrollEnd, but the free version does not.
/**
 * Table view for iTwins using MUI X DataGrid (Community edition).
 */
const ITwinTableMUI = ({ iTwins, moreActions, actions, strings, iTwinFavorites, addITwinToFavorites, removeITwinFromFavorites, refetchITwins, tableOverrides: { columnOverrides = {}, hideColumns = [] } = {}, isLoading, fetchMore, }) => {
    const columns = React__default.useMemo(() => {
        const cols = [
            !hideColumns.includes(ITwinCellColumn.Favorite) && {
                field: "id",
                headerName: strings.tableColumnFavorites,
                sortable: false,
                width: 70,
                disableColumnMenu: true,
                renderCell: (params) => {
                    const isFavorite = iTwinFavorites.has(params.value);
                    return (React__default.createElement(FavoriteIconMUI, { isFavorite: isFavorite, addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, onAddToFavorites: () => addITwinToFavorites(params.value), onRemoveFromFavorites: () => removeITwinFromFavorites(params.value), transparent: true, tabIndex: params.tabIndex }));
                },
                ...columnOverrides[ITwinCellColumn.Favorite],
            },
            !hideColumns.includes(ITwinCellColumn.Number) && {
                field: "number",
                headerName: strings.tableColumnName,
                flex: 1,
                minWidth: 200,
                disableColumnMenu: true,
                ...columnOverrides[ITwinCellColumn.Number],
            },
            !hideColumns.includes(ITwinCellColumn.Name) && {
                field: "displayName",
                headerName: strings.tableColumnDescription,
                flex: 1,
                minWidth: 200,
                disableColumnMenu: true,
                ...columnOverrides[ITwinCellColumn.Name],
            },
            !hideColumns.includes(ITwinCellColumn.LastModified) && {
                field: "lastModifiedDateTime",
                headerName: strings.tableColumnLastModified,
                width: 200,
                disableColumnMenu: true,
                valueFormatter: (value) => {
                    if (!value) {
                        return "";
                    }
                    return new Date(value).toLocaleDateString();
                },
                ...columnOverrides[ITwinCellColumn.LastModified],
            },
            !hideColumns.includes(ITwinCellColumn.Options) && {
                field: "actions",
                headerName: "",
                sortable: false,
                width: 65,
                disableColumnMenu: true,
                renderCell: (params) => {
                    if (!moreActions || moreActions.length === 0) {
                        return null;
                    }
                    const items = resolveContextMenuItemsMUI(moreActions, params.row, refetchITwins);
                    return (React__default.createElement(MoreMenuMUI, { items: items, prompt: React__default.createElement(Icon, { href: svgMore }), label: strings.moreOptions, tabIndex: params.tabIndex }));
                },
                ...columnOverrides[ITwinCellColumn.Options],
            },
        ];
        return cols.filter(Boolean);
    }, [
        strings,
        iTwinFavorites,
        addITwinToFavorites,
        removeITwinFromFavorites,
        columnOverrides,
        hideColumns,
        moreActions,
        refetchITwins,
    ]);
    return (React__default.createElement(DataGrid, { rows: iTwins, columns: columns, loading: isLoading, onRowClick: actions ? (params) => actions(params.row)[0]?.onClick?.() : undefined, onCellKeyDown: actions
            ? (params, event) => {
                if ((event.key === "Enter" || event.key === " ") &&
                    params.field !== "id" &&
                    params.field !== "actions") {
                    event.preventDefault();
                    actions(params.row)[0]?.onClick?.();
                }
            }
            : undefined, disableRowSelectionOnClick: true, disableMultipleRowSelection: true, disableColumnSelector: true, disableColumnFilter: true, initialState: {
            pagination: { paginationModel: { pageSize: 25 } },
        }, pageSizeOptions: [25, 50, 100], localeText: {
            noRowsLabel: strings.noRowsLabel,
            noResultsOverlayLabel: strings.noResultsOverlayLabel,
            footerRowSelected: strings.footerRowSelected,
            footerTotalVisibleRows: strings.footerTotalVisibleRows,
            paginationRowsPerPage: strings.paginationRowsPerPage,
        }, sx: {
            // prevent individual cells from showing focus outlines
            "& .MuiDataGrid-cell:focus": {
                outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
            },
            // reveal unfavorited icon on row hover or keyboard focus
            "& .MuiDataGrid-row:hover .favoriteIcon, & .MuiDataGrid-row:focus-within .favoriteIcon": {
                opacity: 1,
            },
            ...(actions && {
                "& .MuiDataGrid-row": {
                    cursor: "pointer",
                },
            }),
        } }));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Theme-aware SVG icon thumbnail for use inside BaseCard.
 *
 * Unlike photo thumbnails which fill the container with `objectFit: cover`,
 * this component renders the SVG at a contained size and adjusts its
 * brightness for light/dark mode via a CSS filter.
 *
 * @alpha
 */
const SvgThumbnail = React__default.forwardRef(({ src, sx: sxOverride }, ref) => {
    return (React__default.createElement(CardMedia, { image: src, ref: ref, role: "presentation", "aria-hidden": "true", sx: [
            (theme) => ({
                objectFit: "contain",
                width: "40%",
                height: "40%",
                filter: "invert(80%)",
                ...theme.applyStyles("dark", {
                    filter: "invert(30%)",
                }),
            }),
            ...(Array.isArray(sxOverride)
                ? sxOverride
                : sxOverride
                    ? [sxOverride]
                    : []),
        ] }));
});
SvgThumbnail.displayName = "SvgThumbnail";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Representation of an iTwin — V2 (Stratakit/MUI)
 * @alpha
 */
const ITwinTileMUI = ({ iTwin, moreActions: moreActionItems, stringsOverrides, isFavorite, addToFavorites, removeFromFavorites, refetchITwins, hideFavoriteIcon, loading, disabled, status, thumbnail, getBadge, title, description, actions, className, ...rest }) => {
    const strings = _mergeStrings({
        trialBadge: "Trial",
        inactiveBadge: "Inactive",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
    }, stringsOverrides);
    const moreActions = React__default.useMemo(() => moreActionItems
        ?.filter(({ visible }) => typeof visible === "function" ? visible(iTwin) : visible ?? true)
        .map(({ key, label, icon, onClick, disabled }) => ({
        key,
        label: typeof label === "function" ? label(iTwin) : label,
        icon,
        onClick: onClick ? () => onClick(iTwin, refetchITwins) : undefined,
        disabled: typeof disabled === "function" ? disabled(iTwin) : disabled,
    })), [moreActionItems, iTwin, refetchITwins]);
    const favoriteIcon = !hideFavoriteIcon &&
        isFavorite !== undefined &&
        addToFavorites &&
        removeFromFavorites ? (React__default.createElement(FavoriteIconMUI, { isFavorite: isFavorite, onAddToFavorites: () => addToFavorites(iTwin.id), onRemoveFromFavorites: () => removeFromFavorites(iTwin.id), addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, disabled: disabled })) : undefined;
    const additionalDescription = iTwin.lastModifiedDateTime
        ? new Date(iTwin.lastModifiedDateTime).toDateString()
        : undefined;
    return (React__default.createElement(BaseCard, { className: className, sx: {
            "&:hover .favoriteIcon, &:focus-within .favoriteIcon": {
                opacity: 1,
            },
        }, disabled: disabled, loading: loading, thumbnail: thumbnail ?? React__default.createElement(DefaultThumbnail, null), thumbnailTopRight: favoriteIcon, thumbnailBottomRight: getBadge?.(iTwin) ?? (React__default.createElement(StatusBadge, { status: iTwin.status, strings: strings })), title: title ?? iTwin.displayName ?? "", actions: actions, moreActions: moreActions, status: status, statusIconHref: svgItwin, description: description ?? iTwin.number ?? "", subheader: additionalDescription, "data-testid": `itwin-tile-${iTwin.id}`, stringsOverrides: stringsOverrides, ...rest }));
};
function DefaultThumbnail() {
    return React__default.createElement(SvgThumbnail, { src: `${svgItwin}#icon-large` });
}
function StatusBadge({ status, strings, }) {
    if (!status || status.toLocaleLowerCase() === "active") {
        return null;
    }
    return (React__default.createElement(Chip, { size: "small", label: status.toLocaleLowerCase() === "inactive"
            ? strings.inactiveBadge
            : strings.trialBadge }));
}

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const useITwinFilter = (iTwins, options) => {
    const filter = options?.toLocaleLowerCase() ?? "";
    return React__default.useMemo(() => !filter
        ? iTwins
        : iTwins.filter((iTwin) => (iTwin.displayName?.toLocaleLowerCase() ?? "").includes(filter) ||
            (iTwin.number?.toLocaleLowerCase() ?? "").includes(filter)), [filter, iTwins]);
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const PAGE_SIZE = 100;
const useITwinData = ({ requestType = "", iTwinSubClass = "Project", accessToken, apiOverrides, filterOptions, orderbyOptions, shouldRefetchFavorites, resetShouldRefetchFavorites, }) => {
    const data = apiOverrides?.data;
    const serverEnvironmentPrefix = apiOverrides?.serverEnvironmentPrefix;
    const [projects, setProjects] = React__default.useState([]);
    const [status, setStatus] = React__default.useState();
    const filteredProjects = useITwinFilter(projects, filterOptions);
    const [page, setPage] = React__default.useState(0);
    const [morePages, setMorePages] = React__default.useState(true);
    const refetchData = React__default.useCallback(() => {
        setStatus(DataStatus.Fetching);
        setProjects([]);
        setPage(0);
        setMorePages(true);
    }, []);
    const fetchMore = React__default.useCallback(() => {
        setPage((page) => page + 1);
    }, []);
    const morePagesRef = React__default.useRef(morePages);
    morePagesRef.current = morePages;
    React__default.useEffect(() => {
        // If filter changes but we already have all the data for favorites or recents,
        // let client side filtering do its job, otherwise, refetch from scratch.
        // Use ref so "morePages" changes itself does not trigger the effect.
        if (morePagesRef.current ||
            !["favorites", "recents"].includes(requestType)) {
            refetchData();
        }
    }, [filterOptions, requestType, refetchData]);
    React__default.useEffect(() => {
        // If any of the dependencies change, always restart the fetch from scratch.
        refetchData();
    }, [
        accessToken,
        requestType,
        iTwinSubClass,
        orderbyOptions,
        data,
        serverEnvironmentPrefix,
        refetchData,
    ]);
    React__default.useEffect(() => {
        if (!morePages) {
            return;
        }
        if (data) {
            setProjects(data);
            setStatus(DataStatus.Complete);
            setMorePages(false);
            return;
        }
        if (!accessToken) {
            setStatus(DataStatus.TokenRequired);
            setProjects([]);
            return;
        }
        if (page === 0) {
            setStatus(DataStatus.Fetching);
        }
        const abortController = new AbortController();
        const endpoint = ["favorites", "recents"].includes(requestType)
            ? requestType
            : "";
        const resolvedITwinSubClass = iTwinSubClass === "All" ? "" : iTwinSubClass;
        const subClass = `?subClass=${resolvedITwinSubClass}`;
        const paging = `&$skip=${page * PAGE_SIZE}&$top=${PAGE_SIZE}`;
        const search = ["favorites", "recents"].includes(requestType) || !filterOptions
            ? ""
            : `&$search=${encodeURIComponent(String(filterOptions).trim())}`;
        const orderby = ["favorites", "recents"].includes(requestType) || !orderbyOptions
            ? ""
            : `&$orderby=${encodeURIComponent(String(orderbyOptions).trim())}`;
        const url = `${_getAPIServer(serverEnvironmentPrefix)}/itwins/${endpoint}${subClass}${paging}${search}${orderby}`;
        const makeFetchRequest = async () => {
            const options = {
                signal: abortController.signal,
                headers: {
                    "Cache-Control": requestType === "favorites" && shouldRefetchFavorites
                        ? "no-cache"
                        : "",
                    Authorization: typeof accessToken === "function"
                        ? await accessToken()
                        : accessToken,
                    Accept: "application/vnd.bentley.itwin-platform.v1+json",
                    Prefer: "return=representation",
                },
            };
            const response = await fetch(url, options);
            const result = response.ok
                ? await response.json()
                : await response.text().then((errorText) => {
                    throw new Error(errorText);
                });
            setStatus(DataStatus.Complete);
            requestType === "favorites" && resetShouldRefetchFavorites?.();
            if (result.iTwins.length !== PAGE_SIZE) {
                setMorePages(false);
            }
            setProjects((projects) => page === 0 ? result.iTwins : [...projects, ...result.iTwins]);
        };
        makeFetchRequest().catch((e) => {
            if (e.name === "AbortError") {
                // Aborting because unmounting is not an error, swallow.
                return;
            }
            setProjects([]);
            setStatus(DataStatus.FetchFailed);
            console.error(e);
        });
        return () => {
            abortController.abort();
        };
    }, [
        accessToken,
        requestType,
        data,
        serverEnvironmentPrefix,
        filterOptions,
        orderbyOptions,
        page,
        morePages,
        iTwinSubClass,
        shouldRefetchFavorites,
        resetShouldRefetchFavorites,
    ]);
    return {
        iTwins: filteredProjects,
        status,
        fetchMore: morePages ? fetchMore : undefined,
        refetchITwins: refetchData,
    };
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const HOOK_ABORT_ERROR = "The fetch request was aborted by the cleanup function.";
/**
 * Custom hook to manage iTwin favorites.
 * @param accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param serverEnvironmentPrefix Optional server environment prefix to target different environments. Can be "dev", "qa", or "" (empty string for production)
 * @returns {object} An object containing:
 * - {Set<string>} iTwinFavorites - A set of iTwin IDs that are marked as favorites.
 * - {function} addITwinToFavorites - A function to add an iTwin to favorites.
 * - {function} removeITwinFromFavorites - A function to remove an iTwin from favorites.
 * - {boolean} shouldRefetchFavorites - A boolean indicating whether to refetch favorites when switching to the favorites tab.
 * - {function} resetShouldRefetchFavorites - A function to reset shouldRefetchFavorites back to false.
 */
const useITwinFavorites = (accessToken, serverEnvironmentPrefix) => {
    const [iTwinFavorites, setITwinFavorites] = useState(new Set());
    const [shouldRefetchFavorites, setShouldRefetchFavorites] = useState(false);
    /**
     * Adds an iTwin to the favorites.
     * @param {string} iTwinId - The ID of the iTwin to add to favorites.
     * @returns {Promise<void>}
     */
    const addITwinToFavorites = useCallback(async (iTwinId) => {
        if (!accessToken || !iTwinId || iTwinId === "") {
            return;
        }
        const url = `${_getAPIServer(serverEnvironmentPrefix)}/itwins/favorites/${iTwinId}`;
        try {
            const result = await fetch(url, {
                method: "POST",
                headers: {
                    authorization: typeof accessToken === "function"
                        ? await accessToken()
                        : accessToken,
                    Accept: "application/vnd.bentley.itwin-platform.v1+json",
                },
            });
            if (!result || (result.status !== 200 && result.status !== 204)) {
                throw new Error(`Failed to add iTwin ${iTwinId} to favorites`);
            }
            setITwinFavorites((prev) => new Set([...prev, iTwinId]));
            setShouldRefetchFavorites(true);
        }
        catch (error) {
            console.error(error);
        }
    }, [accessToken, serverEnvironmentPrefix]);
    /**
     * Removes an iTwin from the favorites.
     * @param {string} iTwinId - The ID of the iTwin to remove from favorites.
     * @returns {Promise<void>}
     */
    const removeITwinFromFavorites = useCallback(async (iTwinId) => {
        if (!accessToken || !iTwinId || iTwinId === "") {
            return;
        }
        const url = `${_getAPIServer(serverEnvironmentPrefix)}/itwins/favorites/${iTwinId}`;
        try {
            const result = await fetch(url, {
                method: "DELETE",
                headers: {
                    authorization: typeof accessToken === "function"
                        ? await accessToken()
                        : accessToken,
                    Accept: "application/vnd.bentley.itwin-platform.v1+json",
                },
            });
            if (!result || (result.status !== 200 && result.status !== 204)) {
                throw new Error(`Failed to remove iTwin ${iTwinId} to favorites`);
            }
            setITwinFavorites((prev) => {
                const newFavorites = new Set(prev);
                newFavorites.delete(iTwinId);
                return newFavorites;
            });
            setShouldRefetchFavorites(true);
        }
        catch (error) {
            console.error(error);
        }
    }, [accessToken, serverEnvironmentPrefix]);
    /**
     * Fetches iTwin favorites from the API.
     * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
     * @returns {Promise<ITwinFavorites[]>} - A promise that resolves to an array of iTwin favorites.
     * @throws {Error} - Throws an error if the fetch request fails.
     */
    const getITwinFavorites = useCallback(async (abortSignal) => {
        if (!accessToken) {
            return [];
        }
        const url = `${_getAPIServer(serverEnvironmentPrefix)}/itwins/favorites?subClass=Project`;
        const result = await fetch(url, {
            headers: {
                "Cache-Control": shouldRefetchFavorites ? "no-cache" : "",
                authorization: typeof accessToken === "function"
                    ? await accessToken()
                    : accessToken,
                Accept: "application/vnd.bentley.itwin-platform.v1+json",
            },
            signal: abortSignal,
        });
        if (abortSignal?.aborted) {
            throw new Error(HOOK_ABORT_ERROR);
        }
        if (!result) {
            throw new Error(`Failed to fetch iTwin favorites from ${url}.\nNo response.`);
        }
        if (result.status !== 200) {
            throw new Error(`Failed to fetch iTwin favorites from ${url}.\nStatus: ${result.status}`);
        }
        const response = await result.json();
        return response.iTwins;
    }, [accessToken, serverEnvironmentPrefix, shouldRefetchFavorites]);
    const resetShouldRefetchFavorites = useCallback(() => {
        setShouldRefetchFavorites(false);
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        /**
         * Fetches iTwin favorites and updates the state.
         * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
         */
        const fetchITwinFavorites = async (abortSignal) => {
            try {
                const favorites = await getITwinFavorites(abortSignal);
                setITwinFavorites(new Set(favorites.map((favorite) => favorite.id)));
            }
            catch (error) {
                if (error === HOOK_ABORT_ERROR ||
                    (error instanceof Error && error.name === "AbortError")) {
                    return;
                }
                console.error(error);
            }
        };
        void fetchITwinFavorites(controller.signal);
        return () => {
            controller.abort();
        };
    }, [getITwinFavorites]);
    return {
        iTwinFavorites,
        addITwinToFavorites,
        removeITwinFromFavorites,
        shouldRefetchFavorites,
        resetShouldRefetchFavorites,
    };
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Component that will allow displaying a grid of iTwins, given a requestType
 * @alpha
 */
const ITwinGridMUI = ({ accessToken, apiOverrides, filterOptions, orderbyOptions, actions, moreActions, requestType, iTwinSubClass, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, viewMode, tableOverrides, className, }) => {
    const { iTwinFavorites, addITwinToFavorites, removeITwinFromFavorites, shouldRefetchFavorites, resetShouldRefetchFavorites, } = useITwinFavorites(accessToken, apiOverrides?.serverEnvironmentPrefix);
    const strings = _mergeStrings({
        tableColumnFavorites: "",
        tableColumnName: "iTwin Number",
        tableColumnDescription: "iTwin Name",
        tableColumnLastModified: "Last Modified",
        tableLoadingData: "Loading...",
        trialBadge: "Trial",
        inactiveBadge: "Inactive",
        noITwins: requestType === "recents"
            ? "No recent iTwins."
            : requestType === "favorites"
                ? "No favorite iTwins."
                : "No iTwin found.",
        noAuthentication: "No access token provided",
        error: "An error occurred",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        moreOptions: "More options",
        noRowsLabel: "No rows",
        noResultsOverlayLabel: "No results found.",
        paginationRowsPerPage: "Rows per page:",
        footerRowSelected: (count) => count !== 1
            ? `${count.toLocaleString()} rows selected`
            : `${count.toLocaleString()} row selected`,
        footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,
    }, stringsOverrides);
    const { iTwins: fetchedItwins, status: fetchStatus, fetchMore, refetchITwins, } = useITwinData({
        requestType,
        iTwinSubClass,
        accessToken,
        apiOverrides,
        filterOptions,
        orderbyOptions,
        shouldRefetchFavorites,
        resetShouldRefetchFavorites,
    });
    const iTwins = React__default.useMemo(() => postProcessCallback?.([...fetchedItwins], fetchStatus) ?? fetchedItwins, [postProcessCallback, fetchedItwins, fetchStatus]);
    const noResultsText = {
        [DataStatus.Fetching]: "",
        [DataStatus.Complete]: strings.noITwins,
        [DataStatus.FetchFailed]: strings.error,
        [DataStatus.TokenRequired]: strings.noAuthentication,
        [DataStatus.ContextRequired]: "",
    }[fetchStatus ?? DataStatus.Fetching];
    return viewMode !== "cells" ? (iTwins.length === 0 && noResultsText ? (React__default.createElement(NoResults, { text: noResultsText })) : (React__default.createElement(Box, { component: "ul", sx: {
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
            listStyle: "none",
            p: 0,
            m: 0,
        }, className: className }, fetchStatus === DataStatus.Fetching ? (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("li", null,
            React__default.createElement(BaseCardLoading, null)),
        React__default.createElement("li", null,
            React__default.createElement(BaseCardLoading, null)),
        React__default.createElement("li", null,
            React__default.createElement(BaseCardLoading, null)))) : (React__default.createElement(React__default.Fragment, null,
        iTwins?.map((iTwin) => (React__default.createElement("li", { key: iTwin.id },
            React__default.createElement(ITwinHookedTile, { gridProps: {
                    accessToken,
                    apiOverrides,
                    filterOptions,
                    actions,
                    requestType,
                    stringsOverrides,
                    tileOverrides,
                    useIndividualState,
                }, iTwin: iTwin, moreActions: moreActions, actions: actions ? resolveActionItemsMUI(actions, iTwin) : undefined, useTileState: useIndividualState, isFavorite: iTwinFavorites.has(iTwin.id), addToFavorites: addITwinToFavorites, removeFromFavorites: removeITwinFromFavorites, refetchITwins: refetchITwins, stringsOverrides: stringsOverrides, thumbnail: iTwin.image, ...tileOverrides })))),
        fetchMore ? (React__default.createElement(React__default.Fragment, null,
            React__default.createElement("li", null,
                React__default.createElement(InView, { onChange: (inView) => {
                        inView && fetchMore();
                    } },
                    React__default.createElement(BaseCardLoading, null))),
            React__default.createElement("li", null,
                React__default.createElement(BaseCardLoading, null)),
            React__default.createElement("li", null,
                React__default.createElement(BaseCardLoading, null)))) : null))))) : (React__default.createElement(ITwinTableMUI, { iTwins: iTwins, moreActions: moreActions, actions: actions
            ? (iTwin) => resolveActionItemsMUI(actions, iTwin)
            : undefined, strings: strings, iTwinFavorites: iTwinFavorites, addITwinToFavorites: addITwinToFavorites, removeITwinFromFavorites: removeITwinFromFavorites, refetchITwins: refetchITwins, tableOverrides: tableOverrides, isLoading: fetchStatus === DataStatus.Fetching, fetchMore: fetchMore }));
};
const noOp = () => ({});
const ITwinHookedTile = (props) => {
    const { useTileState = noOp, ...iTwinTileProps } = props;
    const hookIdentity = React__default.useRef(useTileState);
    if (hookIdentity.current !== useTileState) {
        throw new Error("Even when used in a prop, useIndividualState identity must remain stable as it is used as a hook.");
    }
    const tileState = useTileState(props.iTwin, iTwinTileProps);
    // gridProps aren't used by ITwinTileMUI but are passed to useIndividualState
    const { gridProps, ...tileProps } = props;
    return React__default.createElement(ITwinTileMUI, { ...tileProps, ...tileState });
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Pre-formatted empty result page (MUI version)
 * @alpha
 */
const NoResultsMUI = ({ text, subtext, isSearchResult = false, }) => {
    return (React__default.createElement(Box, { "data-testid": "no-results", sx: {
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
        } },
        React__default.createElement(Box, { sx: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
            } },
            React__default.createElement(Icon, { href: isSearchResult ? svgSearch : svgImodel, size: "large", style: {
                    width: "5rem",
                    height: "5rem",
                    color: "var(--stratakit-color-text-muted)",
                } }),
            React__default.createElement(Typography, { variant: "h6", render: React__default.createElement("h2", null) }, text),
            subtext && React__default.createElement(Typography, { variant: "body1" }, subtext))));
};

export { DataStatus, IModelCellColumn, BaseCardLoading as IModelGhostTile, IModelGridMUI as IModelGrid, IModelThumbnailMUI as IModelThumbnail, IModelTileMUI as IModelTile, ITwinCellColumn, ITwinGridMUI as ITwinGrid, ITwinTileMUI as ITwinTile, NoResultsMUI as NoResults, SvgThumbnail, ThumbnailIconButton };
