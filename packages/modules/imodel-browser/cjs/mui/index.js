'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Box = require('@mui/material/Box');
var React = require('react');
var reactIntersectionObserver = require('react-intersection-observer');
var Card = require('@mui/material/Card');
var CardContent = require('@mui/material/CardContent');
var CardHeader = require('@mui/material/CardHeader');
var Skeleton = require('@mui/material/Skeleton');
var Typography = require('@mui/material/Typography');
var svgImodel = require('@stratakit/icons/imodel.svg');
var svgSearch = require('@stratakit/icons/search.svg');
var mui = require('@stratakit/mui');
require('@itwin/itwinui-react');
var Button = require('@mui/material/Button');
var CardActionArea = require('@mui/material/CardActionArea');
var CardActions = require('@mui/material/CardActions');
var CardMedia = require('@mui/material/CardMedia');
var Divider = require('@mui/material/Divider');
var svgMore = require('@stratakit/icons/more-vertical.svg');
var IconButton = require('@mui/material/IconButton');
var ListItemIcon = require('@mui/material/ListItemIcon');
var ListItemText = require('@mui/material/ListItemText');
var Menu = require('@mui/material/Menu');
var MenuItem = require('@mui/material/MenuItem');
var pinUnpinSvg = require('@stratakit/icons/pin-unpin.svg');
var pinSvg = require('@stratakit/icons/pin.svg');
var classNames = require('classnames');
var xDataGrid = require('@mui/x-data-grid');
var Chip = require('@mui/material/Chip');
var svgItwin = require('@stratakit/icons/itwin.svg');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var Box__default = /*#__PURE__*/_interopDefaultLegacy(Box);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/_interopNamespace(React);
var Card__default = /*#__PURE__*/_interopDefaultLegacy(Card);
var CardContent__default = /*#__PURE__*/_interopDefaultLegacy(CardContent);
var CardHeader__default = /*#__PURE__*/_interopDefaultLegacy(CardHeader);
var Skeleton__default = /*#__PURE__*/_interopDefaultLegacy(Skeleton);
var Typography__default = /*#__PURE__*/_interopDefaultLegacy(Typography);
var svgImodel__default = /*#__PURE__*/_interopDefaultLegacy(svgImodel);
var svgSearch__default = /*#__PURE__*/_interopDefaultLegacy(svgSearch);
var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
var CardActionArea__default = /*#__PURE__*/_interopDefaultLegacy(CardActionArea);
var CardActions__default = /*#__PURE__*/_interopDefaultLegacy(CardActions);
var CardMedia__default = /*#__PURE__*/_interopDefaultLegacy(CardMedia);
var Divider__default = /*#__PURE__*/_interopDefaultLegacy(Divider);
var svgMore__default = /*#__PURE__*/_interopDefaultLegacy(svgMore);
var IconButton__default = /*#__PURE__*/_interopDefaultLegacy(IconButton);
var ListItemIcon__default = /*#__PURE__*/_interopDefaultLegacy(ListItemIcon);
var ListItemText__default = /*#__PURE__*/_interopDefaultLegacy(ListItemText);
var Menu__default = /*#__PURE__*/_interopDefaultLegacy(Menu);
var MenuItem__default = /*#__PURE__*/_interopDefaultLegacy(MenuItem);
var pinUnpinSvg__default = /*#__PURE__*/_interopDefaultLegacy(pinUnpinSvg);
var pinSvg__default = /*#__PURE__*/_interopDefaultLegacy(pinSvg);
var classNames__default = /*#__PURE__*/_interopDefaultLegacy(classNames);
var Chip__default = /*#__PURE__*/_interopDefaultLegacy(Chip);
var svgItwin__default = /*#__PURE__*/_interopDefaultLegacy(svgItwin);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Shared thumbnail area container used by BaseCard and BaseCardLoading
 * to ensure consistent sizing.
 *
 * @alpha
 */
function BaseCardThumbnailArea({ children, className, }) {
    return (React__default["default"].createElement(Box__default["default"], { className: className, sx: [
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
/**
 * Skeleton loading state for BaseCard.
 *
 * @alpha
 */
const BaseCardLoading = React.forwardRef(({ ...props }, ref) => {
    return (React__default["default"].createElement(Card__default["default"], { ref: ref, variant: "outlined", "aria-busy": "true", "aria-label": "Loading", ...props },
        React__default["default"].createElement(BaseCardThumbnailArea, null,
            React__default["default"].createElement(Skeleton__default["default"], { variant: "rectangular", sx: { width: "100%", height: "100%" } })),
        React__default["default"].createElement(CardHeader__default["default"], { title: React__default["default"].createElement(Skeleton__default["default"], { variant: "text" },
                React__default["default"].createElement(Typography__default["default"], { variant: "h2", render: React__default["default"].createElement("h2", null) })) }),
        React__default["default"].createElement(CardContent__default["default"], null,
            React__default["default"].createElement(Skeleton__default["default"], { variant: "text" },
                React__default["default"].createElement(Typography__default["default"], { variant: "body2" })))));
});

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * No results page for use on iTwinGrid and iModelGrid.
 * @alpha
 */
const NoResultsMUI = ({ text, subtext, isSearchResult = false, }) => {
    return (React__default["default"].createElement(Box__default["default"], { "data-testid": "no-results", sx: {
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
        React__default["default"].createElement(Box__default["default"], { sx: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
            } },
            React__default["default"].createElement(mui.Icon, { href: isSearchResult ? svgSearch__default["default"] : svgImodel__default["default"], size: "large", style: {
                    width: "5rem",
                    height: "5rem",
                    color: "var(--stratakit-color-text-muted)",
                } }),
            React__default["default"].createElement(Typography__default["default"], { variant: "h6", render: React__default["default"].createElement("h2", null) }, text),
            subtext && React__default["default"].createElement(Typography__default["default"], { variant: "body1" }, subtext))));
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
    const [iModelFavorites, setIModelFavorites] = React.useState(new Set());
    /**
     * Adds an iModel to the favorites.
     * @param {string} iModelId - The ID of the iModel to add to favorites.
     * @returns {Promise<void>}
     */
    const addIModelToFavorites$1 = React.useCallback(async (iModelId) => {
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
    const removeIModelFromFavorites$1 = React.useCallback(async (iModelId) => {
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
    React.useEffect(() => {
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
const IModelFavoritesContext = React__default["default"].createContext(undefined);
const IModelFavoritesProvider = ({ iTwinId, accessToken, serverEnvironmentPrefix, children, disabled, }) => {
    const { iModelFavorites, addIModelToFavorites, removeIModelFromFavorites } = useIModelFavorites(iTwinId, accessToken, serverEnvironmentPrefix === "dev" || serverEnvironmentPrefix === "qa"
        ? serverEnvironmentPrefix
        : undefined, disabled);
    const value = React__default["default"].useMemo(() => ({
        favorites: iModelFavorites,
        add: addIModelToFavorites,
        remove: removeIModelFromFavorites,
    }), [iModelFavorites, addIModelToFavorites, removeIModelFromFavorites]);
    return (React__default["default"].createElement(IModelFavoritesContext.Provider, { value: value }, children));
};
const useIModelFavoritesContext = () => {
    const ctx = React__default["default"].useContext(IModelFavoritesContext);
    if (!ctx) {
        console.warn("useIModelFavoritesContext must be used within IModelFavoritesProvider");
    }
    return ctx;
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
exports.DataStatus = void 0;
(function (DataStatus) {
    DataStatus["Fetching"] = "fetching";
    DataStatus["Complete"] = "complete";
    DataStatus["FetchFailed"] = "error_fetchFailed";
    DataStatus["TokenRequired"] = "error_tokenRequired";
    DataStatus["ContextRequired"] = "error_contextRequired";
})(exports.DataStatus || (exports.DataStatus = {}));
/* Supported IModel cell columns */
exports.IModelCellColumn = void 0;
(function (IModelCellColumn) {
    IModelCellColumn["Favorite"] = "Favorite";
    IModelCellColumn["Name"] = "name";
    IModelCellColumn["Description"] = "description";
    IModelCellColumn["LastModified"] = "lastChangesetPushDateTime";
    /** @deprecated Since 4.1.0. Use `LastModified` instead. */
    IModelCellColumn["CreatedDateTime"] = "createdDateTime";
    IModelCellColumn["Options"] = "options";
})(exports.IModelCellColumn || (exports.IModelCellColumn = {}));
/* Supported ITwin cell columns */
exports.ITwinCellColumn = void 0;
(function (ITwinCellColumn) {
    ITwinCellColumn["Favorite"] = "Favorite";
    ITwinCellColumn["Number"] = "ITwinNumber";
    ITwinCellColumn["Name"] = "ITwinName";
    ITwinCellColumn["LastModified"] = "LastModified";
    ITwinCellColumn["Options"] = "options";
})(exports.ITwinCellColumn || (exports.ITwinCellColumn = {}));

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Resolve `CardActionsItemMUI<T>[]` for specific values, e.g. for a given iTwin or iModel, into `ResolvedCardActionItem[]` that can be used by tiles or table rows.
 * @private
 */
const resolveCardActionsItemsMUI = (items, value, refetchData) => {
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
 * Returns the primary (first visible) resolved card action, or `undefined` when
 * there are none for use as the primary button or row action.
 */
const getPrimaryCardAction = (actions) => actions?.[0];
/**
 * Resolve `MoreActionsMenuItemMUI<T>[]` for specific values, e.g. for a given iTwin or iModel.
 * @private
 */
const resolveMoreActionsMenuItemsMUI = (items, value, refetchData) => {
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
const MoreMenuMUI = React__namespace.forwardRef(({ items, prompt, label, tabIndex }, ref) => {
    const [anchorEl, setAnchorEl] = React__namespace.useState(null);
    const [contextMenuPosition, setContextMenuPosition] = React__namespace.useState(null);
    const menuOpen = anchorEl !== null || contextMenuPosition !== null;
    const handleClose = React__namespace.useCallback(() => {
        setAnchorEl(null);
        setContextMenuPosition(null);
    }, []);
    React__namespace.useImperativeHandle(ref, () => ({
        openAtPosition: (position) => {
            setAnchorEl(null);
            setContextMenuPosition(position);
        },
    }), []);
    const buttonId = React__namespace.useId();
    if (items.length === 0) {
        return null;
    }
    return (React__namespace.createElement(React__namespace.Fragment, null,
        React__namespace.createElement(IconButton__default["default"], { id: buttonId, "aria-haspopup": "true", "aria-expanded": menuOpen ? "true" : "false", "aria-label": label, tabIndex: tabIndex, onClick: (event) => {
                // Prevent the click from bubbling to an ancestor handler
                // (e.g. DataGrid row click / card action) when opening the menu.
                event.stopPropagation();
                setContextMenuPosition(null);
                setAnchorEl(event.currentTarget);
            }, size: "small", "data-testid": "more-options-button" }, prompt),
        React__namespace.createElement(Menu__default["default"], { anchorReference: anchorEl ? "anchorEl" : "anchorPosition", anchorEl: anchorEl, anchorPosition: contextMenuPosition
                ? {
                    top: contextMenuPosition.mouseY,
                    left: contextMenuPosition.mouseX,
                }
                : undefined, open: menuOpen, onClose: handleClose, 
            // Stop menu (and backdrop) clicks from bubbling through the React
            // portal to an ancestor "click anywhere to activate" handler
            // (e.g. Stratakit's MuiCard), which would otherwise replay the click
            // onto the card's title action.
            onClick: (event) => event.stopPropagation(), transformOrigin: { horizontal: "right", vertical: "top" }, anchorOrigin: { horizontal: "right", vertical: "bottom" }, slotProps: {
                list: {
                    "aria-labelledby": buttonId,
                    dense: true,
                },
            }, "data-testid": "more-options-menu" }, items.map(({ key, label: itemLabel, icon, onClick, disabled }) => (React__namespace.createElement(MenuItem__default["default"], { key: key, disabled: disabled, onClick: () => {
                onClick?.();
                handleClose();
            } },
            icon && (React__namespace.createElement(ListItemIcon__default["default"], null,
                React__namespace.createElement(mui.Icon, { href: icon }))),
            React__namespace.createElement(ListItemText__default["default"], null, itemLabel)))))));
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
    return (React__default["default"].createElement(Box__default["default"], { sx: { width: "1.5rem", height: "1.5rem", color }, role: "img", "aria-label": status ? `${status} status` : undefined, "aria-hidden": status ? undefined : "true", "data-testid": "status-icon" },
        React__default["default"].createElement(mui.Icon, { href: href, size: "large" })));
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
const textEllipsisSx = {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};
/**
 * Base card component built on MUI Card.
 *
 * Base card is very customizable. As such, it isn't recommended to use BaseCard directly since
 * design discipline will go out the window.  Prefer to build specific card components for your use case on top of BaseCard.
 *
 * @alpha
 */
const BaseCard = React__default["default"].forwardRef(({ thumbnail, thumbnailTopLeft, thumbnailTopRight, thumbnailBottomRight, thumbnailBottomLeft, title, statusIconHref, description, subheader, thumbnailAlt, actions, moreActions, loading, disabled: cardDisabled, status, stringsOverrides, className, sx, ...rest }, ref) => {
    const titleId = React__default["default"].useId();
    const thumbnailNode = typeof thumbnail === "string" ? (React__default["default"].createElement(CardMedia__default["default"], { image: thumbnail, role: "img", "aria-label": thumbnailAlt ?? "", sx: { height: "100%", backgroundSize: "cover" } })) : (thumbnail);
    const moreMenuRef = React__default["default"].useRef(null);
    const handleContextMenu = React__default["default"].useCallback((event) => {
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
    const primaryAction = getPrimaryCardAction(actions);
    const multipleActions = actions && actions.length > 1 ? actions : undefined;
    if (loading) {
        return (React__default["default"].createElement(BaseCardLoading, { className: className, sx: [baseCardSx, ...spreadSx(sx)] }));
    }
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(Card__default["default"], { ref: ref, variant: "outlined", ...rest, className: className, "aria-labelledby": titleId, ...(cardDisabled
                ? { inert: "true" }
                : {}), onContextMenu: !cardDisabled && hasContextMenu ? handleContextMenu : undefined, sx: [
                {
                    ...baseCardSx,
                    cursor: cardDisabled ? "not-allowed" : "default",
                    boxShadow: "var(--stratakit-shadow-surface-sm)",
                },
                ...spreadSx(sx),
            ] },
            React__default["default"].createElement(BaseCardThumbnailArea, null,
                thumbnailTopLeft && (React__default["default"].createElement(Box__default["default"], { sx: { position: "absolute", top: 8, left: 8, zIndex: 1 } }, thumbnailTopLeft)),
                thumbnailTopRight && (React__default["default"].createElement(Box__default["default"], { sx: {
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        display: "flex",
                        gap: "4px",
                    } }, thumbnailTopRight)),
                thumbnailNode,
                thumbnailBottomLeft && (React__default["default"].createElement(Box__default["default"], { sx: { position: "absolute", bottom: 8, left: 8, zIndex: 1 } }, thumbnailBottomLeft)),
                thumbnailBottomRight && (React__default["default"].createElement(Box__default["default"], { sx: { position: "absolute", bottom: 8, right: 8, zIndex: 1 } }, thumbnailBottomRight))),
            React__default["default"].createElement(Divider__default["default"], { role: "presentation", sx: {
                    borderColor: status === "positive"
                        ? "var(--stratakit-color-border-positive-base)"
                        : status === "warning"
                            ? "var(--stratakit-color-border-attention-base)"
                            : status === "negative"
                                ? "var(--stratakit-color-border-critical-base)"
                                : undefined,
                } }),
            React__default["default"].createElement(CardHeader__default["default"], { avatar: statusIconHref ? (React__default["default"].createElement(StatusIcon, { href: statusIconHref, status: status })) : undefined, title: primaryAction ? (React__default["default"].createElement(CardActionArea__default["default"], { sx: textEllipsisSx, onClick: !cardDisabled && !primaryAction.disabled
                        ? primaryAction.onClick
                        : undefined, disabled: cardDisabled ? true : primaryAction.disabled }, title)) : (title), action: hasContextMenu && !cardDisabled ? (React__default["default"].createElement(MoreMenuMUI, { ref: moreMenuRef, items: moreActions, label: stringsOverrides?.moreOptions ?? "More options", prompt: React__default["default"].createElement(mui.Icon, { href: svgMore__default["default"] }) })) : undefined, subheader: React__default["default"].createElement(Typography__default["default"], { variant: "caption", color: "textSecondary", 
                    // eslint-disable-next-line jsx-a11y/heading-has-content
                    render: React__default["default"].createElement("h3", null) }, subheader), sx: [{ alignItems: "flex-start" }], slotProps: {
                    title: {
                        id: titleId,
                        sx: textEllipsisSx,
                    },
                    content: {
                        sx: {
                            minWidth: 0,
                            flex: "1 1 auto",
                            overflow: "hidden",
                        },
                    },
                } }),
            description ? (React__default["default"].createElement(CardContent__default["default"], { "data-testid": "card-description", sx: { flex: "1 1 auto" } },
                React__default["default"].createElement(Typography__default["default"], { variant: "body2", color: "textSecondary", sx: {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    } }, description))) : (React__default["default"].createElement(CardContent__default["default"], { sx: {
                    flex: "1 1 auto",
                } })),
            multipleActions && (React__default["default"].createElement(CardActions__default["default"], null, multipleActions.map(({ key, label, onClick, disabled }, index) => (React__default["default"].createElement(Button__default["default"], { key: key, onClick: onClick, disabled: cardDisabled ? true : disabled, variant: "contained", color: index === 0 ? "primary" : "secondary" }, label))))))));
});
BaseCard.displayName = "BaseCard";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// our attempt at making icons that can be overlayed with some contrast on top of thumbnails
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
    return (React__default["default"].createElement(IconButton__default["default"], { ...rest, onClick: (event) => {
            event.stopPropagation();
            onClick?.(event);
        }, size: "small", sx: [
            {
                bgcolor,
                "&:hover": {
                    bgcolor: muted ? mutedBgColor : activeBgColor,
                },
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ] },
        React__default["default"].createElement(mui.Icon, { href: icon })));
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
    const [hovered, setHovered] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    // Pinned: always show pin icon, swap to unpin on hover.
    // Unpinned: hidden by default, show pin icon on hover.
    const icon = isFavorite && hovered ? pinUnpinSvg__default["default"] : pinSvg__default["default"];
    return (React__default["default"].createElement(ThumbnailIconButton, { "aria-label": isFavorite ? removeLabel : addLabel, "aria-pressed": isFavorite, tabIndex: tabIndex, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), onClick: async (event) => {
            // debounce
            if (pending)
                return;
            setPending(true);
            try {
                if (isFavorite) {
                    // Blur so the parent's focus-within rule stops keeping the icon visible.
                    event.currentTarget.blur();
                    await onRemoveFromFavorites();
                }
                else {
                    // Reset hover so the icon doesn't immediately flip to "unpin"
                    // while the cursor is still over the button.
                    setHovered(false);
                    await onAddToFavorites();
                }
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.error("Failed to toggle favorite", error);
            }
            finally {
                setPending(false);
            }
        }, className: `favoriteIcon${isFavorite ? " isFavorite" : ""}${className ? " " + className : ""}`, disabled: (disabled ?? false) || pending, muted: !isFavorite, icon: icon, sx: {
            ...(!isFavorite && { opacity: 0 }),
            ...(transparent && {
                bgcolor: "transparent",
                "&:hover": { bgcolor: "transparent" },
            }),
        } }));
};

var defaultIModelThumbnail = "data:image/png;base64,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";

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
    const [thumbnail, setThumbnail] = React.useState();
    React.useEffect(() => {
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
                        ? defaultIModelThumbnail
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
 * iModel thumbnail, fetched from the servers
 *
 * Currently the API will return a placeholder PNG thumbnail when the user has not chosen a custom thumbnail.
 * Unfortunately that means we can not show a nicely-formatted SVG thumbnail for those iModels.
 *
 * @alpha
 */
const IModelThumbnailMUI = ({ iModelId, accessToken, apiOverrides, className, }) => {
    const { ref, inView } = reactIntersectionObserver.useInView({
        triggerOnce: true,
        skip: !!apiOverrides?.data,
    });
    const thumbnail = useIModelThumbnail(iModelId, inView ? accessToken : undefined, apiOverrides);
    return thumbnail ? (React__default["default"].createElement(CardMedia__default["default"], { image: thumbnail, ref: ref, role: "presentation", "aria-hidden": "true", className: classNames__default["default"]("iac-thumbnail", className), sx: { height: "100%" } })) : (React__default["default"].createElement(Skeleton__default["default"], { variant: "rectangular", ref: ref, "aria-hidden": "true", sx: { height: "100%", width: "100%", minHeight: 140 } }));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 * @alpha
 */
const IModelTileMUI = ({ iModel, moreActions: moreActionItems, accessToken, apiOverrides, stringsOverrides, refetchIModels, hideFavoriteIcon, loading, disabled, status, thumbnail, thumbnailTopLeft, thumbnailBottomLeft, thumbnailBottomRight, title, description, subheader, actions, className, ...rest }) => {
    const favoritesContext = React__default["default"].useContext(IModelFavoritesContext);
    const strings = _mergeStrings({
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        moreOptions: "More options",
    }, stringsOverrides);
    const moreActions = React__default["default"].useMemo(() => moreActionItems
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
    const favoriteIcon = !hideFavoriteIcon && favoritesContext ? (React__default["default"].createElement(FavoriteIconMUI, { isFavorite: isFavorite, onAddToFavorites: () => favoritesContext.add(iModel.id), onRemoveFromFavorites: () => favoritesContext.remove(iModel.id), addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, disabled: disabled })) : undefined;
    return (React__default["default"].createElement(BaseCard, { className: className, sx: {
            "&:hover .favoriteIcon, &:focus-within .favoriteIcon": {
                opacity: 1,
            },
        }, disabled: disabled, loading: loading, thumbnail: thumbnail ?? (React__default["default"].createElement(IModelThumbnailMUI, { iModelId: iModel.id, accessToken: accessToken, apiOverrides: thumbnailApiOverride })), thumbnailTopLeft: thumbnailTopLeft, thumbnailTopRight: favoriteIcon, thumbnailBottomLeft: thumbnailBottomLeft, thumbnailBottomRight: thumbnailBottomRight, title: title ?? iModel.displayName ?? "", actions: actions, moreActions: moreActions, status: status, statusIconHref: svgImodel__default["default"], description: description ?? iModel.description ?? "", subheader: subheader, stringsOverrides: stringsOverrides, "data-testid": `imodel-tile-${iModel.id}`, ...rest }));
};

/**
 * Client-side sort applied to the MUI iModel grid for tile view when the
 * request type is "recents" or "favorites" — the server does not honor sort
 * options for those request types, so we sort on the client.
 */
const clientSideIModelSort = (iModels, { viewMode, requestType, sort }) => {
    if (viewMode === "cells") {
        return iModels;
    }
    if (requestType !== "recents" && requestType !== "favorites") {
        return iModels;
    }
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
/**
 * Format an ISO date string for display using the user's locale.
 */
const formatDate = (value) => {
    if (!value) {
        return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    return date.toLocaleDateString();
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const EMPTY_COLUMN_OVERRIDES$1 = {};
const EMPTY_HIDE_COLUMNS$1 = [];
/**
 * Table view for iModels using MUI X DataGrid (Community edition).
 */
const IModelTableMUI = ({ iModels, moreActions, actions, strings, refetchIModels, tableOverrides: { columnOverrides = EMPTY_COLUMN_OVERRIDES$1, hideColumns = EMPTY_HIDE_COLUMNS$1, } = {}, isLoading, fetchMore, }) => {
    // Eagerly load all available data so the table has the full dataset
    // for client-side pagination and sorting.
    React__default["default"].useEffect(() => {
        if (fetchMore) {
            fetchMore();
        }
    }, [fetchMore]);
    const favoritesContext = useIModelFavoritesContext();
    const columns = React__default["default"].useMemo(() => {
        const cols = [
            !hideColumns.includes(exports.IModelCellColumn.Favorite) && {
                field: "id",
                headerName: strings.tableColumnFavorites,
                sortable: false,
                width: 70,
                disableColumnMenu: true,
                renderCell: (params) => {
                    const isFavorite = favoritesContext?.favorites.has(params.value);
                    return (React__default["default"].createElement(FavoriteIconMUI, { isFavorite: !!isFavorite, addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, onAddToFavorites: () => favoritesContext?.add?.(params.value), onRemoveFromFavorites: () => favoritesContext?.remove?.(params.value), transparent: true, tabIndex: params.tabIndex }));
                },
                ...columnOverrides[exports.IModelCellColumn.Favorite],
            },
            !hideColumns.includes(exports.IModelCellColumn.Name) && {
                field: "name",
                headerName: strings.tableColumnName,
                flex: 1,
                minWidth: 200,
                disableColumnMenu: true,
                valueGetter: (_value, row) => row.name ?? row.displayName ?? "",
                ...columnOverrides[exports.IModelCellColumn.Name],
            },
            !hideColumns.includes(exports.IModelCellColumn.Description) && {
                field: "description",
                headerName: strings.tableColumnDescription,
                flex: 1,
                minWidth: 200,
                sortable: false,
                disableColumnMenu: true,
                ...columnOverrides[exports.IModelCellColumn.Description],
            },
            !hideColumns.includes(exports.IModelCellColumn.LastModified) &&
                !hideColumns.includes(exports.IModelCellColumn.CreatedDateTime) && {
                field: "lastChangesetPushDateTime",
                headerName: strings.tableColumnLastModified,
                width: 200,
                valueGetter: (value, row) => row.lastChangesetPushDateTime ?? row.createdDateTime ?? "",
                valueFormatter: (value) => formatDate(value),
                disableColumnMenu: true,
                ...columnOverrides[exports.IModelCellColumn.LastModified],
            },
            !hideColumns.includes(exports.IModelCellColumn.Options) && {
                field: "actions",
                headerName: "",
                sortable: false,
                width: 50,
                disableColumnMenu: true,
                renderCell: (params) => {
                    if (!moreActions || moreActions.length === 0) {
                        return null;
                    }
                    const items = resolveMoreActionsMenuItemsMUI(moreActions, params.row, refetchIModels);
                    return (React__default["default"].createElement(MoreMenuMUI, { items: items, label: strings.moreOptions, prompt: React__default["default"].createElement(mui.Icon, { href: svgMore__default["default"] }), tabIndex: params.tabIndex }));
                },
                ...columnOverrides[exports.IModelCellColumn.Options],
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
    return (React__default["default"].createElement(xDataGrid.DataGrid, { rows: iModels, columns: columns, loading: isLoading, onRowClick: actions
            ? (params) => {
                const action = getPrimaryCardAction(actions(params.row));
                if (action && !action.disabled) {
                    action.onClick?.();
                }
            }
            : undefined, onCellKeyDown: actions
            ? (params, event) => {
                if ((event.key === "Enter" || event.key === " ") &&
                    params.field !== "id" &&
                    params.field !== "actions") {
                    const action = getPrimaryCardAction(actions(params.row));
                    if (action && !action.disabled) {
                        event.preventDefault();
                        action.onClick?.();
                    }
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
            "& .MuiDataGrid-cell:focus:not(:focus-visible)": {
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
                "& .MuiDataGrid-row.row-disabled": {
                    cursor: "default",
                    color: "var(--stratakit-color-text-neutral-disabled)",
                },
            }),
        }, getRowClassName: actions
            ? (params) => getPrimaryCardAction(actions(params.row))?.disabled
                ? "row-disabled"
                : ""
            : undefined }));
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
    return React__default["default"].useMemo(() => {
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
    const [needsUpdate, setNeedsUpdate] = React__default["default"].useState(true);
    const [iModels, setIModels] = React__default["default"].useState([]);
    const [status, setStatus] = React__default["default"].useState();
    const [page, setPage] = React__default["default"].useState(0);
    const [morePagesAvailable, setMorePagesAvailable] = React__default["default"].useState(true);
    const [abortController, setAbortController] = React__default["default"].useState(undefined);
    const sortType = sortOptions && ["name", "createdDateTime"].includes(sortOptions.sortType)
        ? sortOptions.sortType
        : undefined; //Only available sort-by API at the moment.
    const [previousSortOptions, setPreviousSortOptions] = React__default["default"].useState(sortOptions && { ...sortOptions });
    const sortDescending = sortOptions?.descending;
    const sortedIModels = useIModelSort(iModels, sortOptions, requestType !== "recents");
    // For recents and favorites, apply client-side filtering based on searchText
    const filteredIModels = React__default["default"].useMemo(() => {
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
    React.useEffect(() => () => abortController?.abort(), [abortController]);
    const reset = React__default["default"].useCallback(() => {
        if (dataMode === "external") {
            return;
        }
        setStatus(exports.DataStatus.Fetching);
        setIModels([]);
        setPage(0);
        setMorePagesAvailable(true);
        setNeedsUpdate(true);
    }, [dataMode]);
    const fetchMore = React__default["default"].useCallback(() => {
        if (dataMode === "external") {
            return;
        }
        if (needsUpdate ||
            status === exports.DataStatus.Fetching ||
            status === exports.DataStatus.TokenRequired ||
            status === exports.DataStatus.ContextRequired ||
            !morePagesAvailable) {
            return;
        }
        setPage((page) => page + 1);
        setNeedsUpdate(true);
    }, [dataMode, needsUpdate, status, morePagesAvailable]);
    React__default["default"].useEffect(() => {
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
    React__default["default"].useEffect(() => {
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
    React__default["default"].useEffect(() => {
        if (dataMode === "external" || !needsUpdate) {
            return;
        }
        setNeedsUpdate(false);
        abortController?.abort();
        setAbortController(undefined);
        if (!accessToken || !iTwinId) {
            setStatus(!accessToken ? exports.DataStatus.TokenRequired : exports.DataStatus.ContextRequired);
            setIModels([]);
            return;
        }
        // If sort changes but we already have all the data, let client side sorting do its job
        if (sortChanged && !morePagesAvailable) {
            setStatus(exports.DataStatus.Complete);
            return;
        }
        // Otherwise, fetch from server
        setStatus(exports.DataStatus.Fetching);
        const { abortController: newAbortController, fetchIModels } = createFetchIModelsFn(iTwinId, accessToken, sortType, sortDescending ?? false, page, searchText, pageSize, maxCount, apiOverrides?.serverEnvironmentPrefix, requestType);
        setAbortController(newAbortController);
        fetchIModels()
            .then(({ iModels, morePagesAvailable }) => {
            setMorePagesAvailable(morePagesAvailable);
            setIModels((prev) => page === 0 ? [...iModels] : [...prev, ...iModels]);
            setStatus(exports.DataStatus.Complete);
        })
            .catch((e) => {
            if (e.name === "AbortError") {
                // Aborting because unmounting is not an error, swallow.
                return;
            }
            setIModels([]);
            setMorePagesAvailable(false);
            setStatus(exports.DataStatus.FetchFailed);
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
                ? exports.DataStatus.Fetching
                : exports.DataStatus.Complete,
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
    return (React__default["default"].createElement(IModelFavoritesProvider, { iTwinId: props.iTwinId, accessToken: props.accessToken, serverEnvironmentPrefix: props.apiOverrides?.serverEnvironmentPrefix, disabled: props.tileOverrides?.hideFavoriteIcon },
        React__default["default"].createElement(IModelGridInternal, { ...props })));
};
const IModelGridInternal = ({ accessToken, apiOverrides, moreActions, removeFromRecentsIcon, actions, iTwinId, sortOptions = { sortType: "name", descending: false }, requestType, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, emptyStateComponent, searchText, viewMode, pageSize, maxCount, tableOverrides, className, onLoadMore, onRefetch, dataMode = "internal", disableAddToRecents = false, }) => {
    const [sort, setSort] = React__default["default"].useState(sortOptions);
    React__default["default"].useEffect(() => {
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
    const strings = React__default["default"].useMemo(() => _mergeStrings({
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
    }, stringsOverrides), [requestType, stringsOverrides]);
    const enhancedMoreActions = React__default["default"].useMemo(() => {
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
    const iModels = React__default["default"].useMemo(() => {
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
    React__default["default"].useEffect(() => {
        if (iModels.length < (pageSize ?? DEFAULT_PAGE_SIZE) &&
            fetchMore &&
            fetchStatus !== exports.DataStatus.Fetching) {
            fetchMore();
        }
    }, [iModels.length, pageSize, fetchMore, fetchStatus]);
    const iModelClickAndAddToRecents = React__default["default"].useCallback(async (iModel, clickFn) => {
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
    }, [accessToken, disableAddToRecents, apiOverrides?.serverEnvironmentPrefix]);
    const noResultsText = {
        [exports.DataStatus.Fetching]: "",
        [exports.DataStatus.Complete]: strings.noIModels,
        [exports.DataStatus.FetchFailed]: strings.error,
        [exports.DataStatus.TokenRequired]: strings.noAuthentication,
        [exports.DataStatus.ContextRequired]: strings.noContext,
    }[fetchStatus ?? exports.DataStatus.Fetching];
    const tileApiOverrides = apiOverrides
        ? { serverEnvironmentPrefix: apiOverrides.serverEnvironmentPrefix }
        : undefined;
    const resolveActions = React__default["default"].useCallback((iModel) => {
        if (!actions?.length) {
            return [];
        }
        const resolved = resolveCardActionsItemsMUI(actions, iModel);
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
    }, [actions, iModelClickAndAddToRecents]);
    const renderIModelGridStructure = () => {
        return (React__default["default"].createElement(React__default["default"].Fragment, null, viewMode !== "cells" ? (React__default["default"].createElement(Box__default["default"], { component: "ul", sx: {
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
                listStyle: "none",
                alignItems: "stretch",
                "& > li": {
                    display: "flex",
                    minWidth: 0,
                },
                "& > li > *": {
                    flex: 1,
                    minWidth: 0,
                },
                p: 0,
                m: 0,
            }, className: className, "data-testid": "imodel-grid" },
            iModels?.map((iModel) => (React__default["default"].createElement("li", { key: iModel.id },
                React__default["default"].createElement(IModelHookedTile, { iModel: iModel, moreActions: enhancedMoreActions, accessToken: accessToken, apiOverrides: tileApiOverrides, useTileState: useIndividualState, refetchIModels: refetchIModels, stringsOverrides: stringsOverrides, ...tileOverrides, actions: resolveActions(iModel) })))),
            fetchMore ? (React__default["default"].createElement("li", null,
                React__default["default"].createElement(reactIntersectionObserver.InView, { onChange: (inView) => {
                        inView &&
                            fetchStatus !== exports.DataStatus.Fetching &&
                            fetchMore();
                    } }, ({ ref }) => {
                    return React__default["default"].createElement(BaseCardLoading, { ref: ref });
                }))) : null,
            fetchStatus === exports.DataStatus.Fetching && (React__default["default"].createElement(React__default["default"].Fragment, null,
                React__default["default"].createElement("li", null,
                    React__default["default"].createElement(BaseCardLoading, null)),
                React__default["default"].createElement("li", null,
                    React__default["default"].createElement(BaseCardLoading, null)))))) : (React__default["default"].createElement(IModelTableMUI, { iModels: iModels, moreActions: enhancedMoreActions, actions: actions ? resolveActions : undefined, strings: strings, refetchIModels: refetchIModels, tableOverrides: tableOverrides, isLoading: fetchStatus === exports.DataStatus.Fetching, fetchMore: fetchMore, "data-testid": "imodel-table" }))));
    };
    const renderComponent = () => {
        if (!searchText &&
            iModels.length === 0 &&
            noResultsText === strings.noIModels &&
            emptyStateComponent) {
            return React__default["default"].createElement(React__default["default"].Fragment, null, emptyStateComponent);
        }
        if (!searchText && iModels.length === 0 && noResultsText) {
            return React__default["default"].createElement(NoResultsMUI, { text: noResultsText });
        }
        if (searchText &&
            iModels.length === 0 &&
            fetchStatus !== exports.DataStatus.Fetching) {
            return (React__default["default"].createElement(NoResultsMUI, { text: strings.noIModelSearch, subtext: strings.noIModelSearchSubtext, isSearchResult: true }));
        }
        return renderIModelGridStructure();
    };
    return renderComponent();
};
const noOp$1 = () => ({});
const IModelHookedTile = (props) => {
    const { useTileState = noOp$1, ...iModelTileProps } = props;
    const hookIdentity = React__default["default"].useRef(useTileState);
    if (hookIdentity.current !== useTileState) {
        throw new Error("Even when used in a prop, useIndividualState identity must remain stable as it is used as a hook.");
    }
    const tileState = useTileState(props.iModel, iModelTileProps);
    return React__default["default"].createElement(IModelTileMUI, { ...iModelTileProps, ...tileState });
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

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const EMPTY_COLUMN_OVERRIDES = {};
const EMPTY_HIDE_COLUMNS = [];
/**
 * Table view for iTwins using MUI X DataGrid (Community edition).
 */
const ITwinTableMUI = ({ iTwins, moreActions, actions, strings, iTwinFavorites, addITwinToFavorites, removeITwinFromFavorites, refetchITwins, tableOverrides: { columnOverrides = EMPTY_COLUMN_OVERRIDES, hideColumns = EMPTY_HIDE_COLUMNS, } = {}, isLoading, fetchMore, }) => {
    // Eagerly load all available data so the table has the full dataset
    // for client-side pagination and sorting.
    React__default["default"].useEffect(() => {
        if (fetchMore) {
            fetchMore();
        }
    }, [fetchMore]);
    const columns = React__default["default"].useMemo(() => {
        const cols = [
            !hideColumns.includes(exports.ITwinCellColumn.Favorite) && {
                field: "id",
                headerName: strings.tableColumnFavorites,
                sortable: false,
                width: 70,
                disableColumnMenu: true,
                renderCell: (params) => {
                    const isFavorite = iTwinFavorites.has(params.value);
                    return (React__default["default"].createElement(FavoriteIconMUI, { isFavorite: isFavorite, addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, onAddToFavorites: () => addITwinToFavorites(params.value), onRemoveFromFavorites: () => removeITwinFromFavorites(params.value), transparent: true, tabIndex: params.tabIndex }));
                },
                ...columnOverrides[exports.ITwinCellColumn.Favorite],
            },
            !hideColumns.includes(exports.ITwinCellColumn.Number) && {
                field: "number",
                headerName: strings.tableColumnName,
                flex: 1,
                minWidth: 200,
                disableColumnMenu: true,
                ...columnOverrides[exports.ITwinCellColumn.Number],
            },
            !hideColumns.includes(exports.ITwinCellColumn.Name) && {
                field: "displayName",
                headerName: strings.tableColumnDescription,
                flex: 1,
                minWidth: 200,
                disableColumnMenu: true,
                ...columnOverrides[exports.ITwinCellColumn.Name],
            },
            !hideColumns.includes(exports.ITwinCellColumn.LastModified) && {
                field: "lastModifiedDateTime",
                headerName: strings.tableColumnLastModified,
                width: 200,
                disableColumnMenu: true,
                valueFormatter: (value) => formatDate(value),
                ...columnOverrides[exports.ITwinCellColumn.LastModified],
            },
            !hideColumns.includes(exports.ITwinCellColumn.Options) && {
                field: "actions",
                headerName: "",
                sortable: false,
                width: 65,
                disableColumnMenu: true,
                renderCell: (params) => {
                    if (!moreActions || moreActions.length === 0) {
                        return null;
                    }
                    const items = resolveMoreActionsMenuItemsMUI(moreActions, params.row, refetchITwins);
                    return (React__default["default"].createElement(MoreMenuMUI, { items: items, prompt: React__default["default"].createElement(mui.Icon, { href: svgMore__default["default"] }), label: strings.moreOptions, tabIndex: params.tabIndex }));
                },
                ...columnOverrides[exports.ITwinCellColumn.Options],
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
    return (React__default["default"].createElement(xDataGrid.DataGrid, { rows: iTwins, columns: columns, loading: isLoading, onRowClick: actions
            ? (params) => {
                const action = getPrimaryCardAction(actions(params.row));
                if (action && !action.disabled) {
                    action.onClick?.();
                }
            }
            : undefined, onCellKeyDown: actions
            ? (params, event) => {
                if ((event.key === "Enter" || event.key === " ") &&
                    params.field !== "id" &&
                    params.field !== "actions") {
                    const action = getPrimaryCardAction(actions(params.row));
                    if (action && !action.disabled) {
                        event.preventDefault();
                        action.onClick?.();
                    }
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
            "& .MuiDataGrid-cell:focus:not(:focus-visible)": {
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
            "& .MuiDataGrid-row.row-disabled": {
                cursor: "default",
                color: "var(--stratakit-color-text-neutral-disabled)",
            },
        }, getRowClassName: actions
            ? (params) => getPrimaryCardAction(actions(params.row))?.disabled
                ? "row-disabled"
                : ""
            : undefined }));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * SVG icon thumbnail for use in the BaseCard thumbnail area.
 *
 * @alpha
 */
const SvgThumbnail = React__default["default"].forwardRef(({ src, sx: sxOverride }, ref) => {
    return (React__default["default"].createElement(CardMedia__default["default"], { image: src, ref: ref, role: "presentation", "aria-hidden": "true", sx: [
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
const ITwinTileMUI = ({ iTwin, moreActions: moreActionItems, stringsOverrides, isFavorite, addToFavorites, removeFromFavorites, refetchITwins, hideFavoriteIcon, loading, disabled, status, thumbnail, thumbnailBottomRight, thumbnailTopLeft, thumbnailBottomLeft, title, description, actions, className, ...rest }) => {
    const strings = _mergeStrings({
        trialBadge: "Trial",
        inactiveBadge: "Inactive",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
    }, stringsOverrides);
    const moreActions = React__default["default"].useMemo(() => moreActionItems
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
        removeFromFavorites ? (React__default["default"].createElement(FavoriteIconMUI, { isFavorite: isFavorite, onAddToFavorites: () => addToFavorites(iTwin.id), onRemoveFromFavorites: () => removeFromFavorites(iTwin.id), addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, disabled: disabled })) : undefined;
    const additionalDescription = iTwin.lastModifiedDateTime
        ? formatDate(iTwin.lastModifiedDateTime)
        : undefined;
    return (React__default["default"].createElement(BaseCard, { className: className, sx: {
            "&:hover .favoriteIcon, &:focus-within .favoriteIcon": {
                opacity: 1,
            },
        }, disabled: disabled, loading: loading, thumbnail: thumbnail ?? React__default["default"].createElement(DefaultThumbnail, null), thumbnailTopLeft: thumbnailTopLeft, thumbnailBottomLeft: thumbnailBottomLeft, thumbnailTopRight: favoriteIcon, thumbnailBottomRight: thumbnailBottomRight ?? (React__default["default"].createElement(StatusBadge, { status: iTwin.status, strings: strings })), title: title ?? iTwin.displayName ?? "", actions: actions, moreActions: moreActions, status: status, statusIconHref: svgItwin__default["default"], description: description ?? iTwin.number ?? "", subheader: additionalDescription, "data-testid": `itwin-tile-${iTwin.id}`, stringsOverrides: stringsOverrides, ...rest }));
};
function DefaultThumbnail() {
    return React__default["default"].createElement(SvgThumbnail, { src: `${svgItwin__default["default"]}#icon-large` });
}
function StatusBadge({ status, strings, }) {
    if (!status || status.toLocaleLowerCase() === "active") {
        return null;
    }
    return (React__default["default"].createElement(Chip__default["default"], { size: "small", label: status.toLocaleLowerCase() === "inactive"
            ? strings.inactiveBadge
            : strings.trialBadge }));
}

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const useITwinFilter = (iTwins, options) => {
    const filter = options?.toLocaleLowerCase() ?? "";
    return React__default["default"].useMemo(() => !filter
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
    const [projects, setProjects] = React__default["default"].useState([]);
    const [status, setStatus] = React__default["default"].useState();
    const filteredProjects = useITwinFilter(projects, filterOptions);
    const [page, setPage] = React__default["default"].useState(0);
    const [morePages, setMorePages] = React__default["default"].useState(true);
    const refetchData = React__default["default"].useCallback(() => {
        setStatus(exports.DataStatus.Fetching);
        setProjects([]);
        setPage(0);
        setMorePages(true);
        fetchingMoreRef.current = false;
    }, []);
    const fetchingMoreRef = React__default["default"].useRef(false);
    const fetchMore = React__default["default"].useCallback(() => {
        if (fetchingMoreRef.current) {
            return;
        }
        fetchingMoreRef.current = true;
        setPage((page) => page + 1);
    }, []);
    const morePagesRef = React__default["default"].useRef(morePages);
    morePagesRef.current = morePages;
    React__default["default"].useEffect(() => {
        // If filter changes but we already have all the data for favorites or recents,
        // let client side filtering do its job, otherwise, refetch from scratch.
        // Use ref so "morePages" changes itself does not trigger the effect.
        if (morePagesRef.current ||
            !["favorites", "recents"].includes(requestType)) {
            refetchData();
        }
    }, [filterOptions, requestType, refetchData]);
    React__default["default"].useEffect(() => {
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
    React__default["default"].useEffect(() => {
        if (!morePages) {
            return;
        }
        if (data) {
            setProjects(data);
            setStatus(exports.DataStatus.Complete);
            setMorePages(false);
            return;
        }
        if (!accessToken) {
            setStatus(exports.DataStatus.TokenRequired);
            setProjects([]);
            return;
        }
        if (page === 0) {
            setStatus(exports.DataStatus.Fetching);
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
            setStatus(exports.DataStatus.Complete);
            fetchingMoreRef.current = false;
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
            setStatus(exports.DataStatus.FetchFailed);
            fetchingMoreRef.current = false;
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
    const [iTwinFavorites, setITwinFavorites] = React.useState(new Set());
    const [shouldRefetchFavorites, setShouldRefetchFavorites] = React.useState(false);
    /**
     * Adds an iTwin to the favorites.
     * @param {string} iTwinId - The ID of the iTwin to add to favorites.
     * @returns {Promise<void>}
     */
    const addITwinToFavorites = React.useCallback(async (iTwinId) => {
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
    const removeITwinFromFavorites = React.useCallback(async (iTwinId) => {
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
    const getITwinFavorites = React.useCallback(async (abortSignal) => {
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
    const resetShouldRefetchFavorites = React.useCallback(() => {
        setShouldRefetchFavorites(false);
    }, []);
    React.useEffect(() => {
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
    const strings = React__default["default"].useMemo(() => _mergeStrings({
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
                : "No iTwins found.",
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
    }, stringsOverrides), [requestType, stringsOverrides]);
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
    const iTwins = React__default["default"].useMemo(() => postProcessCallback?.([...fetchedItwins], fetchStatus) ?? fetchedItwins, [postProcessCallback, fetchedItwins, fetchStatus]);
    const noResultsText = {
        [exports.DataStatus.Fetching]: "",
        [exports.DataStatus.Complete]: strings.noITwins,
        [exports.DataStatus.FetchFailed]: strings.error,
        [exports.DataStatus.TokenRequired]: strings.noAuthentication,
        [exports.DataStatus.ContextRequired]: "",
    }[fetchStatus ?? exports.DataStatus.Fetching];
    if (iTwins.length === 0 && noResultsText) {
        return React__default["default"].createElement(NoResultsMUI, { text: noResultsText });
    }
    return viewMode !== "cells" ? (React__default["default"].createElement(Box__default["default"], { component: "ul", sx: {
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
            listStyle: "none",
            alignItems: "stretch",
            "& > li": {
                display: "flex",
                minWidth: 0,
            },
            "& > li > *": {
                flex: 1,
                minWidth: 0,
            },
            p: 0,
            m: 0,
        }, className: className }, fetchStatus === exports.DataStatus.Fetching ? (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("li", null,
            React__default["default"].createElement(BaseCardLoading, null)),
        React__default["default"].createElement("li", null,
            React__default["default"].createElement(BaseCardLoading, null)),
        React__default["default"].createElement("li", null,
            React__default["default"].createElement(BaseCardLoading, null)))) : (React__default["default"].createElement(React__default["default"].Fragment, null,
        iTwins?.map((iTwin) => (React__default["default"].createElement("li", { key: iTwin.id },
            React__default["default"].createElement(ITwinHookedTile, { gridProps: {
                    accessToken,
                    apiOverrides,
                    filterOptions,
                    actions,
                    requestType,
                    stringsOverrides,
                    tileOverrides,
                    useIndividualState,
                }, iTwin: iTwin, moreActions: moreActions, actions: actions
                    ? resolveCardActionsItemsMUI(actions, iTwin)
                    : undefined, useTileState: useIndividualState, isFavorite: iTwinFavorites.has(iTwin.id), addToFavorites: addITwinToFavorites, removeFromFavorites: removeITwinFromFavorites, refetchITwins: refetchITwins, stringsOverrides: stringsOverrides, thumbnail: iTwin.image, ...tileOverrides })))),
        fetchMore ? (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("li", null,
                React__default["default"].createElement(reactIntersectionObserver.InView, { onChange: (inView) => {
                        inView && fetchMore();
                    } },
                    React__default["default"].createElement(BaseCardLoading, null))),
            React__default["default"].createElement("li", null,
                React__default["default"].createElement(BaseCardLoading, null)),
            React__default["default"].createElement("li", null,
                React__default["default"].createElement(BaseCardLoading, null)))) : null)))) : (React__default["default"].createElement(ITwinTableMUI, { iTwins: iTwins, moreActions: moreActions, actions: actions
            ? (iTwin) => resolveCardActionsItemsMUI(actions, iTwin)
            : undefined, strings: strings, iTwinFavorites: iTwinFavorites, addITwinToFavorites: addITwinToFavorites, removeITwinFromFavorites: removeITwinFromFavorites, refetchITwins: refetchITwins, tableOverrides: tableOverrides, isLoading: fetchStatus === exports.DataStatus.Fetching, fetchMore: fetchMore }));
};
const noOp = () => ({});
const ITwinHookedTile = (props) => {
    const { useTileState = noOp, ...iTwinTileProps } = props;
    const hookIdentity = React__default["default"].useRef(useTileState);
    if (hookIdentity.current !== useTileState) {
        throw new Error("Even when used in a prop, useIndividualState identity must remain stable as it is used as a hook.");
    }
    const tileState = useTileState(props.iTwin, iTwinTileProps);
    // gridProps aren't used by ITwinTileMUI but are passed to useIndividualState
    const { gridProps, ...tileProps } = props;
    return React__default["default"].createElement(ITwinTileMUI, { ...tileProps, ...tileState });
};

exports.IModelGhostTile = BaseCardLoading;
exports.IModelGrid = IModelGridMUI;
exports.IModelThumbnail = IModelThumbnailMUI;
exports.IModelTile = IModelTileMUI;
exports.ITwinGrid = ITwinGridMUI;
exports.ITwinTile = ITwinTileMUI;
exports.NoResults = NoResultsMUI;
exports.SvgThumbnail = SvgThumbnail;
exports.ThumbnailIconButton = ThumbnailIconButton;
