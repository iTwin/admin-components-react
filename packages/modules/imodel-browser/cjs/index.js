'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var itwinuiReact = require('@itwin/itwinui-react');
var React = require('react');
var reactIntersectionObserver = require('react-intersection-observer');
var classNames = require('classnames');
var itwinuiIconsReact = require('@itwin/itwinui-icons-react');
var svgIModel = require('@stratakit/icons/imodel.svg');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var classNames__default = /*#__PURE__*/_interopDefaultLegacy(classNames);
var svgIModel__default = /*#__PURE__*/_interopDefaultLegacy(svgIModel);

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
                        ? svgIModel__default["default"]
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
    }, []);
    const fetchMore = React__default["default"].useCallback(() => {
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
