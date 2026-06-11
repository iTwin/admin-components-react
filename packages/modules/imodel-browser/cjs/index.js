'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var itwinuiReact = require('@itwin/itwinui-react');
var React = require('react');
var reactIntersectionObserver = require('react-intersection-observer');
var classNames = require('classnames');
var itwinuiIconsReact = require('@itwin/itwinui-icons-react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var classNames__default = /*#__PURE__*/_interopDefaultLegacy(classNames);

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

var css_248z$6 = ".iac-grid-structure{display:grid;justify-content:space-between;grid-template-columns:repeat(auto-fill, minmax(288px, 1fr));grid-auto-rows:min-content;padding:calc(22px - 3px) calc(var(--responsive-grid-margin, 64px) - 3px);gap:var(--responsive-grid-gutter, 24px);overflow:hidden;margin:3px}.iac-grid-structure>*{display:inline-flex}";
styleInject(css_248z$6);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Browser container structure */
const GridStructure = (props) => {
    return (React__default["default"].createElement("div", { ...props, className: classNames__default["default"]("iac-grid-structure", props.className) }));
};

var css_248z$5 = ".iac-no-results-container{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;margin:1em}.iac-no-results-container .iac-no-results{display:flex;flex-direction:column;align-items:center;gap:var(--iui-size-2xs)}.iac-no-results-container .iac-no-results>svg{height:var(--iui-size-2xl);width:var(--iui-size-2xl);fill:var(--iui-color-icon-muted);margin-bottom:var(--iui-size-2xs)}";
styleInject(css_248z$5);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Pre-formatted empty result page */
const NoResults = ({ text, subtext, isSearchResult = false, }) => {
    return (React__default["default"].createElement("div", { className: "iac-no-results-container" },
        React__default["default"].createElement("div", { className: "iac-no-results" },
            isSearchResult ? React__default["default"].createElement(itwinuiIconsReact.SvgSearch, null) : React__default["default"].createElement(itwinuiIconsReact.SvgImodelHollow, null),
            React__default["default"].createElement(itwinuiReact.Text, { variant: "leading" }, text),
            subtext && React__default["default"].createElement(itwinuiReact.Text, null, subtext))));
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
 * Representation of a Ghost IModel
 */
const IModelGhostTile = React.forwardRef(({ fullWidth, ...props }, ref) => {
    return (React__default["default"].createElement(itwinuiReact.ThemeProvider, { ref: ref, theme: "inherit", ...props },
        React__default["default"].createElement(itwinuiReact.Tile.Wrapper, { style: fullWidth ? { width: "100%" } : undefined },
            React__default["default"].createElement(itwinuiReact.Tile.ThumbnailArea, null,
                React__default["default"].createElement(itwinuiReact.Text, { isSkeleton: true }, "Skeleton")),
            React__default["default"].createElement(itwinuiReact.Tile.Name, null,
                React__default["default"].createElement(itwinuiReact.Text, { isSkeleton: true, variant: "leading" }, "Skeleton Name")),
            React__default["default"].createElement(itwinuiReact.Tile.ContentArea, null,
                React__default["default"].createElement(itwinuiReact.Tile.Description, null,
                    React__default["default"].createElement(itwinuiReact.Text, { isSkeleton: true, variant: "title" }, "Skeleton Description"))))));
});

var css_248z$4 = ".TileFavoriteIcon-module_favoriteIconButton__pJaA0{padding-inline:var(--iui-button-padding-block);background-color:rgb(from var(--iui-color-background-hover) r g b/0.7)}.TileFavoriteIcon-module_favoriteIconButton__pJaA0:hover{background-color:var(--iui-color-background-hover)}.TileFavoriteIcon-module_favoriteIconButton__pJaA0:active{background-color:var(--iui-color-background)}";
var styles$3 = {"favoriteIconButton":"TileFavoriteIcon-module_favoriteIconButton__pJaA0"};
styleInject(css_248z$4);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Reusable favorite icon button for Tile components
 * Shows a star icon that can be clicked to add/remove from favorites
 */
const TileFavoriteIcon = ({ isFavorite, onAddToFavorites, onRemoveFromFavorites, addLabel, removeLabel, className = "", }) => {
    return (React__default["default"].createElement(itwinuiReact.IconButton, { "aria-label": isFavorite ? removeLabel : addLabel, onClick: async () => {
            isFavorite ? await onRemoveFromFavorites() : await onAddToFavorites();
        }, className: `${styles$3.favoriteIconButton} ${className}`, styleType: "borderless" }, isFavorite ? React__default["default"].createElement(itwinuiIconsReact.SvgStar, null) : React__default["default"].createElement(itwinuiIconsReact.SvgStarHollow, null)));
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** Build MenuItem array for the value for each provided options
 * @private
 */
const _buildManagedContextMenuOptions = (options, value, closeMenu, refetchData) => {
    return options
        ?.filter?.(({ visible }) => {
        return typeof visible === "function" ? visible(value) : visible ?? true;
    })
        .map(({ key, visible, onClick, disabled, ...contextMenuProps }) => {
        return (React__default["default"].createElement(itwinuiReact.MenuItem, { ...contextMenuProps, disabled: typeof disabled === "function" ? disabled(value) : disabled, onClick: (e) => {
                e?.stopPropagation();
                closeMenu?.();
                onClick?.(value, refetchData);
            }, key: key }));
    });
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
/** Clickable iModel thumbnail, fetched from the servers */
const IModelThumbnail = ({ iModelId, accessToken, apiOverrides, className, }) => {
    const { ref, inView } = reactIntersectionObserver.useInView({
        triggerOnce: true,
        skip: !!apiOverrides?.data,
    });
    const thumbnail = useIModelThumbnail(iModelId, inView ? accessToken : undefined, apiOverrides);
    return thumbnail ? (React__default["default"].createElement(itwinuiReact.Tile.ThumbnailPicture, { url: thumbnail, ref: ref, className: classNames__default["default"]("iac-thumbnail", className) })) : (React__default["default"].createElement(itwinuiReact.Text, { as: "p", variant: "body", ref: ref, isSkeleton: true, style: { height: "100%", width: "100%", margin: 0 } }));
};

var css_248z$3 = ".IModelTile-module_fullWidth__JK5-H{width:100%}.IModelTile-module_iModelTileFavoriteIcon__Y7UWb.IModelTile-module_hidden__RP9E4{display:none}.IModelTile-module_iModelTile__GdDYw:hover .IModelTile-module_iModelTileFavoriteIcon__Y7UWb{display:flex}";
var styles$2 = {"fullWidth":"IModelTile-module_fullWidth__JK5-H","iModelTileFavoriteIcon":"IModelTile-module_iModelTileFavoriteIcon__Y7UWb","hidden":"IModelTile-module_hidden__RP9E4","iModelTile":"IModelTile-module_iModelTile__GdDYw"};
styleInject(css_248z$3);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Representation of an IModel
 */
const IModelTile = ({ iModel, iModelOptions, accessToken, onThumbnailClick, apiOverrides, tileProps, stringsOverrides, refetchIModels, fullWidth, hideFavoriteIcon, }) => {
    const { name, status, isNew, isLoading, isSelected, thumbnail, badge, getBadge, leftIcon, rightIcon, buttons, moreOptions, isDisabled, onClick: tilePropsOnClick, metadata, className = "", ...rest } = tileProps ?? {};
    const favoritesContext = useIModelFavoritesContext();
    const strings = _mergeStrings({
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
    }, stringsOverrides);
    const moreOptionsBuilt = React__default["default"].useMemo(() => _buildManagedContextMenuOptions(iModelOptions, iModel, undefined, refetchIModels), [iModelOptions, iModel, refetchIModels]);
    const thumbnailApiOverride = apiOverrides || iModel.thumbnail
        ? {
            ...(apiOverrides ?? {}),
            data: iModel.thumbnail,
        }
        : undefined;
    return (React__default["default"].createElement(itwinuiReact.Tile.Wrapper, { key: iModel.id, isNew: isNew, isSelected: isSelected, isLoading: isLoading, status: status, isDisabled: isDisabled, className: `${styles$2.iModelTile} ${fullWidth ? styles$2.fullWidth : ""} ${className}`, ...rest },
        React__default["default"].createElement(itwinuiReact.Tile.Name, null,
            React__default["default"].createElement(itwinuiReact.Tile.NameIcon, null),
            React__default["default"].createElement(itwinuiReact.Tile.NameLabel, { onClick: (e) => tilePropsOnClick?.(e) ?? onThumbnailClick?.(iModel), "aria-disabled": isDisabled, "data-testid": `iModel-tile-${iModel.id}-name-label` }, name ?? iModel.displayName)),
        React__default["default"].createElement(itwinuiReact.Tile.ThumbnailArea, null,
            leftIcon && React__default["default"].createElement(itwinuiReact.Tile.TypeIndicator, null, leftIcon),
            React__default["default"].createElement(itwinuiReact.Tile.QuickAction, null,
                rightIcon,
                !hideFavoriteIcon && favoritesContext && (React__default["default"].createElement(TileFavoriteIcon, { isFavorite: favoritesContext.favorites.has(iModel.id), onAddToFavorites: () => favoritesContext.add(iModel.id), onRemoveFromFavorites: () => favoritesContext.remove(iModel.id), addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, className: `${styles$2.iModelTileFavoriteIcon} ${!favoritesContext.favorites.has(iModel.id) && styles$2.hidden}` }))),
            thumbnail ? (React__default["default"].createElement(itwinuiReact.Tile.ThumbnailPicture, null, thumbnail)) : (React__default["default"].createElement(IModelThumbnail, { iModelId: iModel.id, accessToken: accessToken, apiOverrides: thumbnailApiOverride })),
            (getBadge || badge) && (React__default["default"].createElement(itwinuiReact.Tile.BadgeContainer, null, getBadge?.(iModel) ?? badge))),
        React__default["default"].createElement(itwinuiReact.Tile.ContentArea, null,
            React__default["default"].createElement(itwinuiReact.Tile.Action, { onClick: (e) => tilePropsOnClick?.(e) ?? onThumbnailClick?.(iModel), "aria-disabled": isDisabled, "data-testid": `iModel-tile-${iModel.id}-action` },
                React__default["default"].createElement(itwinuiReact.Tile.Description, null, iModel?.description ?? "")),
            (moreOptions || moreOptionsBuilt) && (React__default["default"].createElement(itwinuiReact.Tile.MoreOptions, { "data-testid": `iModel-tile-${iModel.id}-more-options` }, moreOptions ?? moreOptionsBuilt)),
            metadata && (React__default["default"].createElement(itwinuiReact.Tile.Metadata, { "data-testid": `iModel-tile-${iModel.id}-metadata` }, metadata))),
        buttons && React__default["default"].createElement(itwinuiReact.Tile.Buttons, null, buttons)));
};

var css_248z$2 = ".IModelGrid-module_rowCursor__Ay8md div[role=row]{cursor:pointer}";
var styles$1 = {"rowCursor":"IModelGrid-module_rowCursor__Ay8md"};
styleInject(css_248z$2);

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
const useIModelTableConfig = ({ iModelActions, onThumbnailClick, strings, refetchIModels, cellOverrides = {}, }) => {
    const favoritesContext = useIModelFavoritesContext();
    const onRowClick = (_, row) => {
        const iModel = row.original;
        if (!iModel) {
            return;
        }
        onThumbnailClick?.(iModel);
    };
    const columns = React.useMemo(() => [
        {
            Header: "Table",
            columns: [
                {
                    id: exports.IModelCellColumn.Favorite,
                    Header: strings.tableColumnFavorites,
                    accessor: "id",
                    disableSortBy: true,
                    width: 70,
                    Cell: (props) => {
                        const isFavorite = favoritesContext?.favorites.has(props.value);
                        return (React__default["default"].createElement(itwinuiReact.IconButton, { styleType: "borderless", "aria-label": isFavorite
                                ? strings.removeFromFavorites
                                : strings.addToFavorites, onClick: async (e) => {
                                e.stopPropagation();
                                isFavorite
                                    ? await favoritesContext?.remove?.(props.value)
                                    : await favoritesContext?.add?.(props.value);
                            } }, isFavorite ? React__default["default"].createElement(itwinuiIconsReact.SvgStar, null) : React__default["default"].createElement(itwinuiIconsReact.SvgStarHollow, null)));
                    },
                },
                {
                    id: exports.IModelCellColumn.Name,
                    Header: strings.tableColumnName,
                    accessor: "name",
                    maxWidth: 350,
                    Cell: (props) => (React__default["default"].createElement("div", { "data-tip": props.row.original.name }, cellOverrides.name ? (cellOverrides.name(props)) : (React__default["default"].createElement("span", null, props.value)))),
                },
                {
                    id: exports.IModelCellColumn.Description,
                    Header: strings.tableColumnDescription,
                    accessor: "description",
                    disableSortBy: true,
                    Cell: (props) => (React__default["default"].createElement("div", { "data-tip": props.row.original.description }, cellOverrides.description ? (cellOverrides.description(props)) : (React__default["default"].createElement("span", null, props.value)))),
                },
                {
                    id: exports.IModelCellColumn.LastModified,
                    Header: strings.tableColumnLastModified,
                    accessor: (row) => row.lastChangesetPushDateTime ?? row.createdDateTime ?? "",
                    maxWidth: 350,
                    Cell: (props) => {
                        const date = props.data[props.row.index].lastChangesetPushDateTime ??
                            props.data[props.row.index].createdDateTime;
                        const lastModifiedOverride = cellOverrides.lastModified ?? cellOverrides.createdDateTime;
                        return lastModifiedOverride
                            ? lastModifiedOverride(props)
                            : date
                                ? new Date(date).toDateString()
                                : "";
                    },
                },
                {
                    id: exports.IModelCellColumn.Options,
                    disableSortBy: true,
                    maxWidth: 65,
                    Cell: (props) => {
                        const moreOptions = (close) => {
                            const options = _buildManagedContextMenuOptions(iModelActions, props.row.original, close, refetchIModels);
                            return options !== undefined ? options : [];
                        };
                        return iModelActions && iModelActions.length > 0 ? (React__default["default"].createElement(itwinuiReact.DropdownMenu, { menuItems: moreOptions, onClick: (e) => {
                                e.stopPropagation();
                            } },
                            React__default["default"].createElement(itwinuiReact.IconButton, { "data-testid": `iModel-row-${props.row.original.id}-more-options`, styleType: "borderless", "aria-label": "More options", className: "iac-options-icon", onClick: (e) => {
                                    e.stopPropagation();
                                } },
                                React__default["default"].createElement(itwinuiIconsReact.SvgMore, null)))) : null;
                    },
                },
            ].filter(({ id }) => !cellOverrides.hideColumns?.includes(id) &&
                // Support deprecated CreatedDateTime alias for the LastModified column
                !(id === exports.IModelCellColumn.LastModified &&
                    cellOverrides.hideColumns?.includes(exports.IModelCellColumn.CreatedDateTime))),
        },
    ], [
        strings.tableColumnFavorites,
        strings.tableColumnName,
        strings.tableColumnDescription,
        strings.tableColumnLastModified,
        strings.addToFavorites,
        strings.removeFromFavorites,
        favoritesContext,
        cellOverrides,
        iModelActions,
        refetchIModels,
    ]);
    return {
        onRowClick,
        columns,
    };
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Component that will allow displaying a grid of iModels, given a contextId
 */
const IModelGrid = (props) => {
    return (React__default["default"].createElement(IModelFavoritesProvider, { iTwinId: props.iTwinId, accessToken: props.accessToken, serverEnvironmentPrefix: props.apiOverrides?.serverEnvironmentPrefix, disabled: props.tileOverrides?.hideFavoriteIcon },
        React__default["default"].createElement(IModelGridInternal, { ...props })));
};
const IModelGridInternal = ({ accessToken, apiOverrides, iModelActions, removeFromRecentsIcon, onThumbnailClick, iTwinId, sortOptions = { sortType: "name", descending: false }, requestType, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, emptyStateComponent, searchText, viewMode, pageSize, maxCount, cellOverrides, className, onLoadMore, onRefetch, dataMode = "internal", disableAddToRecents = false, }) => {
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
    }, stringsOverrides);
    // Add "Remove from recents" action when viewing recents
    const enhancedIModelActions = React__default["default"].useMemo(() => {
        if (requestType === "recents") {
            const removeFromRecentsAction = {
                key: "remove-from-recents",
                children: strings.removeFromRecents,
                ...(removeFromRecentsIcon && { icon: removeFromRecentsIcon }),
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
            return iModelActions
                ? [removeFromRecentsAction, ...iModelActions]
                : [removeFromRecentsAction];
        }
        return iModelActions;
    }, [
        requestType,
        iModelActions,
        strings.removeFromRecents,
        removeFromRecentsIcon,
        accessToken,
        apiOverrides?.serverEnvironmentPrefix,
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
    const iModels = React__default["default"].useMemo(() => postProcessCallback?.([...fetchediModels], fetchStatus, searchText) ??
        fetchediModels, [postProcessCallback, fetchediModels, fetchStatus, searchText]);
    React__default["default"].useEffect(() => {
        if (iModels.length < (pageSize ?? DEFAULT_PAGE_SIZE) &&
            fetchMore &&
            fetchStatus !== exports.DataStatus.Fetching) {
            fetchMore();
        }
    }, [iModels.length, pageSize, fetchMore, fetchStatus]);
    const iModelClickAndAddToRecents = async (iModel, clickFn) => {
        try {
            if (!accessToken || disableAddToRecents) {
                clickFn();
                return;
            }
            void addIModelToRecents({
                iModelId: iModel.id,
                accessToken,
                serverEnvironmentPrefix: apiOverrides?.serverEnvironmentPrefix,
            });
        }
        catch (e) {
            // swallow errors to avoid disrupting the UI
            console.error("Failed to add iModel to recents", e);
        }
        onThumbnailClick?.(iModel);
    };
    const { columns, onRowClick } = useIModelTableConfig({
        iModelActions: enhancedIModelActions,
        onThumbnailClick: (iModel) => iModelClickAndAddToRecents(iModel, () => onThumbnailClick?.(iModel)),
        strings,
        refetchIModels,
        cellOverrides,
    });
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
    const renderIModelGridStructure = () => {
        return (React__default["default"].createElement(React__default["default"].Fragment, null, viewMode !== "cells" ? (React__default["default"].createElement(GridStructure, { className: className },
            iModels?.map((iModel) => (React__default["default"].createElement(IModelHookedTile, { key: iModel.id, iModel: iModel, iModelOptions: enhancedIModelActions, accessToken: accessToken, onThumbnailClick: (iModel) => iModelClickAndAddToRecents(iModel, () => onThumbnailClick?.(iModel)), apiOverrides: tileApiOverrides, useTileState: useIndividualState, refetchIModels: refetchIModels, ...tileOverrides, tileProps: tileOverrides
                    ? {
                        ...tileOverrides.tileProps,
                        onClick: tileOverrides.tileProps?.onClick
                            ? (e) => iModelClickAndAddToRecents(iModel, () => tileOverrides.tileProps?.onClick?.(e))
                            : undefined,
                    }
                    : undefined }))),
            fetchMore ? (React__default["default"].createElement(reactIntersectionObserver.InView, { onChange: (inView) => {
                    inView && fetchStatus !== exports.DataStatus.Fetching && fetchMore();
                } }, ({ ref }) => {
                return (React__default["default"].createElement(IModelGhostTile, { ref: ref, fullWidth: tileOverrides?.fullWidth }));
            })) : null,
            fetchStatus === exports.DataStatus.Fetching && (React__default["default"].createElement(React__default["default"].Fragment, null,
                React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth }),
                React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth }))))) : (React__default["default"].createElement(itwinuiReact.ThemeProvider, { theme: "inherit" },
            React__default["default"].createElement(itwinuiReact.Table, { columns: columns, data: iModels, onRowClick: onRowClick, emptyTableContent: fetchStatus === exports.DataStatus.Fetching
                    ? strings.tableLoadingData
                    : strings.noIModelSearch, isLoading: fetchStatus === exports.DataStatus.Fetching, isSortable: true, onBottomReached: fetchMore, autoResetFilters: false, autoResetSortBy: false, bodyProps: {
                    className: onThumbnailClick ? styles$1.rowCursor : "",
                } })))));
    };
    const renderComponent = () => {
        if (!searchText &&
            iModels.length === 0 &&
            noResultsText === strings.noIModels &&
            emptyStateComponent) {
            return React__default["default"].createElement(React__default["default"].Fragment, null, emptyStateComponent);
        }
        if (!searchText && iModels.length === 0 && noResultsText) {
            return React__default["default"].createElement(NoResults, { text: noResultsText });
        }
        if (searchText &&
            iModels.length === 0 &&
            fetchStatus !== exports.DataStatus.Fetching) {
            return (React__default["default"].createElement(NoResults, { text: strings.noIModelSearch, subtext: strings.noIModelSearchSubtext, isSearchResult: true }));
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
        throw new Error("Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook.");
    }
    const tileState = useTileState(props.iModel, iModelTileProps);
    return React__default["default"].createElement(IModelTile, { ...iModelTileProps, ...tileState });
};

var css_248z$1 = ".iac-iTwinCell{display:flex;flex-direction:column;justify-content:center;overflow:hidden}.iac-iTwinCell>*{overflow:hidden;text-overflow:ellipsis;max-width:100%}.row-cursor div[role=row]{cursor:pointer}";
styleInject(css_248z$1);

var css_248z = ".ITwinTile-module_fullWidth__VGOS7{width:100%}.ITwinTile-module_iTwinTileFavoriteIcon__VwBgT.ITwinTile-module_hidden__8-9tG{display:none}.ITwinTile-module_iTwinTile__EDkIT:hover .ITwinTile-module_iTwinTileFavoriteIcon__VwBgT{display:flex}";
var styles = {"fullWidth":"ITwinTile-module_fullWidth__VGOS7","iTwinTileFavoriteIcon":"ITwinTile-module_iTwinTileFavoriteIcon__VwBgT","hidden":"ITwinTile-module_hidden__8-9tG","iTwinTile":"ITwinTile-module_iTwinTile__EDkIT"};
styleInject(css_248z);

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Representation of an iTwin
 */
const ITwinTile = ({ iTwin, iTwinOptions, onThumbnailClick, tileProps, stringsOverrides, isFavorite, addToFavorites, removeFromFavorites, refetchITwins, fullWidth, hideFavoriteIcon, }) => {
    const { name, description, status, isNew, isLoading, isSelected, thumbnail, badge, leftIcon, rightIcon, buttons, metadata, moreOptions, children, isDisabled, onClick, className = "", ...rest } = tileProps ?? {};
    const strings = _mergeStrings({
        trialBadge: "Trial",
        inactiveBadge: "Inactive",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
    }, stringsOverrides);
    const moreOptionsBuilt = React__default["default"].useMemo(() => _buildManagedContextMenuOptions(iTwinOptions, iTwin, undefined, refetchITwins), [iTwinOptions, iTwin, refetchITwins]);
    return (React__default["default"].createElement(itwinuiReact.ThemeProvider, { theme: "inherit" },
        React__default["default"].createElement(itwinuiReact.Tile.Wrapper, { key: iTwin.id, isNew: isNew, isSelected: isSelected, isLoading: isLoading, status: status, isDisabled: isDisabled, className: `${styles.iTwinTile} ${fullWidth ? styles.fullWidth : ""} ${className}`, ...rest },
            React__default["default"].createElement(itwinuiReact.Tile.Name, null,
                (status || isNew || isLoading || isSelected) && React__default["default"].createElement(itwinuiReact.Tile.NameIcon, null),
                React__default["default"].createElement(itwinuiReact.Tile.NameLabel, null,
                    React__default["default"].createElement(itwinuiReact.Tile.Action, { onClick: (e) => onClick?.(e) ?? onThumbnailClick?.(iTwin), "aria-disabled": isDisabled, "data-testid": `iTwin-tile-${iTwin.id}` }, name ?? iTwin.displayName))),
            React__default["default"].createElement(itwinuiReact.Tile.ThumbnailArea, null,
                leftIcon && React__default["default"].createElement(itwinuiReact.Tile.TypeIndicator, null, leftIcon),
                React__default["default"].createElement(itwinuiReact.Tile.QuickAction, null,
                    rightIcon,
                    !hideFavoriteIcon &&
                        isFavorite !== undefined &&
                        addToFavorites &&
                        removeFromFavorites && (React__default["default"].createElement(TileFavoriteIcon, { isFavorite: isFavorite, onAddToFavorites: () => addToFavorites(iTwin.id), onRemoveFromFavorites: () => removeFromFavorites(iTwin.id), addLabel: strings.addToFavorites, removeLabel: strings.removeFromFavorites, className: `${styles.iTwinTileFavoriteIcon} ${!isFavorite && styles.hidden}` }))),
                React__default["default"].createElement(itwinuiReact.Tile.BadgeContainer, null, badge ??
                    (iTwin.status &&
                        iTwin.status.toLocaleLowerCase() !== "active" && (React__default["default"].createElement(itwinuiReact.Badge, { backgroundColor: iTwin.status.toLocaleLowerCase() === "inactive"
                            ? "oak"
                            : "steelblue" }, iTwin.status.toLocaleLowerCase() === "inactive"
                        ? strings.inactiveBadge
                        : strings.trialBadge)))),
                React__default["default"].createElement(itwinuiReact.Tile.ThumbnailPicture, { style: { cursor: onThumbnailClick ? "pointer" : "auto" } }, thumbnail ?? React__default["default"].createElement(itwinuiIconsReact.SvgItwin, null))),
            React__default["default"].createElement(itwinuiReact.Tile.ContentArea, null,
                React__default["default"].createElement(itwinuiReact.Tile.Description, null, description ?? iTwin.number ?? ""),
                metadata && (React__default["default"].createElement(itwinuiReact.Tile.Metadata, { "data-testid": `iTwin-tile-${iTwin.id}-metadata` }, metadata)),
                children,
                (moreOptions || moreOptionsBuilt) && (React__default["default"].createElement(itwinuiReact.Tile.MoreOptions, { "data-testid": `iTwin-tile-${iTwin.id}-more-options` }, moreOptions ?? moreOptionsBuilt))),
            buttons && React__default["default"].createElement(itwinuiReact.Tile.Buttons, null, buttons))));
};

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
const useITwinTableConfig = ({ iTwinActions, onThumbnailClick, strings, iTwinFavorites, addITwinToFavorites, removeITwinFromFavorites, refetchITwins, cellOverrides = {}, }) => {
    const onRowClick = (_, row) => {
        const iTwin = row.original;
        if (!iTwin) {
            return;
        }
        onThumbnailClick?.(iTwin);
    };
    const columns = React.useMemo(() => [
        {
            Header: "Table",
            columns: [
                {
                    id: exports.ITwinCellColumn.Favorite,
                    Header: strings.tableColumnFavorites,
                    accessor: "id",
                    disableSortBy: true,
                    width: 70,
                    Cell: (props) => {
                        const isFavorite = iTwinFavorites.has(props.value);
                        return (React__default["default"].createElement(itwinuiReact.IconButton, { styleType: "borderless", "aria-label": isFavorite
                                ? strings.addToFavorites
                                : strings.removeFromFavorites, onClick: async (e) => {
                                e.stopPropagation();
                                isFavorite
                                    ? await removeITwinFromFavorites(props.value)
                                    : await addITwinToFavorites(props.value);
                            } }, isFavorite ? React__default["default"].createElement(itwinuiIconsReact.SvgStar, null) : React__default["default"].createElement(itwinuiIconsReact.SvgStarHollow, null)));
                    },
                },
                {
                    id: exports.ITwinCellColumn.Number,
                    Header: strings.tableColumnName,
                    accessor: "number",
                    maxWidth: 350,
                    Cell: (props) => (React__default["default"].createElement("div", { "data-tip": props.row.original.number, className: "iac-iTwinCell" }, cellOverrides.ITwinNumber ? (cellOverrides.ITwinNumber(props)) : (React__default["default"].createElement("span", null, props.value)))),
                },
                {
                    id: exports.ITwinCellColumn.Name,
                    Header: strings.tableColumnDescription,
                    accessor: "displayName",
                    maxWidth: 350,
                    Cell: (props) => (React__default["default"].createElement("div", { "data-tip": props.row.original.displayName, className: "iac-iTwinCell" }, cellOverrides.ITwinName ? (cellOverrides.ITwinName(props)) : (React__default["default"].createElement("span", null, props.value)))),
                },
                {
                    id: exports.ITwinCellColumn.LastModified,
                    Header: strings.tableColumnLastModified,
                    // Use lastModifiedDateTime (not createdDateTime) so this column reflects the last update, matching the "Last modified" header.
                    accessor: "lastModifiedDateTime",
                    Cell: (props) => {
                        const date = props.data[props.row.index].lastModifiedDateTime;
                        return cellOverrides.LastModified
                            ? cellOverrides.LastModified(props)
                            : date
                                ? new Date(date).toDateString()
                                : "";
                    },
                },
                {
                    id: exports.ITwinCellColumn.Options,
                    disableSortBy: true,
                    maxWidth: 65,
                    Cell: (props) => {
                        const moreOptions = (close) => {
                            const options = _buildManagedContextMenuOptions(iTwinActions, props.row.original, close, refetchITwins);
                            return options !== undefined ? options : [];
                        };
                        return iTwinActions && iTwinActions.length > 0 ? (React__default["default"].createElement(itwinuiReact.DropdownMenu, { menuItems: moreOptions },
                            React__default["default"].createElement(itwinuiReact.IconButton, { "data-testid": `iTwin-row-${props.row.original.id}-more-options`, styleType: "borderless", "aria-label": "More options", className: "iac-options-icon", onClick: (e) => {
                                    e.stopPropagation();
                                } },
                                React__default["default"].createElement(itwinuiIconsReact.SvgMore, null)))) : null;
                    },
                },
            ].filter((column) => !cellOverrides.hideColumns?.includes(column.id)),
        },
    ], [
        strings.tableColumnFavorites,
        strings.tableColumnName,
        strings.tableColumnDescription,
        strings.tableColumnLastModified,
        strings.addToFavorites,
        strings.removeFromFavorites,
        iTwinFavorites,
        removeITwinFromFavorites,
        addITwinToFavorites,
        cellOverrides,
        iTwinActions,
        refetchITwins,
    ]);
    return {
        onRowClick,
        columns,
    };
};

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/**
 * Component that will allow displaying a grid of iTwins, given a requestType
 */
const ITwinGrid = ({ accessToken, apiOverrides, filterOptions, orderbyOptions, onThumbnailClick, iTwinActions, requestType, iTwinSubClass, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, viewMode, cellOverrides, className, }) => {
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
    const iTwins = React__default["default"].useMemo(() => postProcessCallback?.([...fetchedItwins], fetchStatus) ?? fetchedItwins, [postProcessCallback, fetchedItwins, fetchStatus]);
    const { columns, onRowClick } = useITwinTableConfig({
        iTwinActions,
        onThumbnailClick,
        strings,
        iTwinFavorites,
        addITwinToFavorites,
        removeITwinFromFavorites,
        refetchITwins,
        cellOverrides,
    });
    const noResultsText = {
        [exports.DataStatus.Fetching]: "",
        [exports.DataStatus.Complete]: strings.noITwins,
        [exports.DataStatus.FetchFailed]: strings.error,
        [exports.DataStatus.TokenRequired]: strings.noAuthentication,
        [exports.DataStatus.ContextRequired]: "",
    }[fetchStatus ?? exports.DataStatus.Fetching];
    return viewMode !== "cells" ? (iTwins.length === 0 && noResultsText ? (React__default["default"].createElement(NoResults, { text: noResultsText })) : (React__default["default"].createElement(GridStructure, { className: className }, fetchStatus === exports.DataStatus.Fetching ? (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth }),
        React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth }),
        React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth }))) : (React__default["default"].createElement(React__default["default"].Fragment, null,
        iTwins?.map((iTwin) => (React__default["default"].createElement(ITwinHookedTile, { gridProps: {
                accessToken,
                apiOverrides,
                filterOptions,
                onThumbnailClick,
                requestType,
                stringsOverrides,
                tileOverrides,
                useIndividualState,
            }, key: iTwin.id, iTwin: iTwin, iTwinOptions: iTwinActions, onThumbnailClick: onThumbnailClick, useTileState: useIndividualState, isFavorite: iTwinFavorites.has(iTwin.id), addToFavorites: addITwinToFavorites, removeFromFavorites: removeITwinFromFavorites, refetchITwins: refetchITwins, ...tileOverrides }))),
        fetchMore ? (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(reactIntersectionObserver.InView, { onChange: fetchMore },
                React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth })),
            React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth }),
            React__default["default"].createElement(IModelGhostTile, { fullWidth: tileOverrides?.fullWidth }))) : null))))) : (React__default["default"].createElement(itwinuiReact.ThemeProvider, { theme: "inherit" },
        React__default["default"].createElement(itwinuiReact.Table, { columns: columns, data: iTwins, onRowClick: onRowClick, emptyTableContent: fetchStatus === exports.DataStatus.Fetching
                ? strings.tableLoadingData
                : strings.noITwins, isLoading: fetchStatus === exports.DataStatus.Fetching, isSortable: true, onBottomReached: fetchMore, autoResetFilters: false, autoResetSortBy: false, bodyProps: { className: onThumbnailClick ? "row-cursor" : "" } })));
};
const noOp = () => ({});
const ITwinHookedTile = (props) => {
    const { useTileState = noOp, ...iTwinTileProps } = props;
    const hookIdentity = React__default["default"].useRef(useTileState);
    if (hookIdentity.current !== useTileState) {
        throw new Error("Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook.");
    }
    const tileState = useTileState(props.iTwin, iTwinTileProps);
    return React__default["default"].createElement(ITwinTile, { ...iTwinTileProps, ...tileState });
};

exports.IModelGhostTile = IModelGhostTile;
exports.IModelGrid = IModelGrid;
exports.IModelThumbnail = IModelThumbnail;
exports.IModelTile = IModelTile;
exports.ITwinGrid = ITwinGrid;
exports.ITwinTile = ITwinTile;
exports.NoResults = NoResults;
