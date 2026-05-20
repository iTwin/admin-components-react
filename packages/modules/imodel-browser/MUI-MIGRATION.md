# MUI Migration Notes

This file tracks migration notes for the MUI/Stratakit components.

## Current status

- There is no published package-level breaking change yet for consumers on `main`.
- The package barrel at `src/index.ts` still exports the legacy components only.
- A new `src/mui/index.ts` barrel re-exports MUI components under legacy-aligned names (e.g. `IModelGridMUI as IModelGrid`). This is built as a separate rollup entry point.
- `BaseCard`, `IModelTileMUI`, `ITwinTileMUI`, and related V2 helpers are currently branch-only surfaces.

That means the items below are migration notes for adopters moving from the legacy tile components to the new MUI components, or for a future release that exports MUI publicly.

## `IModelTile` -> `IModelTileMUI`

### High-level changes

- `tileProps` fields become first-class props on `IModelTileMUI`.
- State props are renamed to match MUI conventions (`isSelected` → `selected`, `isLoading` → `loading`, `isDisabled` → `disabled`).
- The legacy inline more-options affordance is replaced by a context menu opened via right-click.
- Click interaction is split: single `onThumbnailClick` → separate `onSelect` (single-click) and `onOpen` (double-click).
- Context menu items use `ContextMenuBuilderItemMUI` (MUI `MenuItem`-based) instead of `ContextMenuBuilderItem` (itwinui `MenuItem`-based). The MUI version uses a `children: ReactNode` prop instead of positional children.
- Favorites: legacy only supports context-based favorites via `IModelFavoritesContext`. V2 supports **both** context-based **and** standalone prop-based favorites (`isFavorite`, `addToFavorites`, `removeFromFavorites`). Standalone props take precedence over context when provided.

### Prop mapping

| `IModelTile`            | `IModelTileMUI`         | Change type             | Notes                                                                                                                     |
| ----------------------- | ----------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `iModel`                | `iModel`                | Unchanged               |                                                                                                                           |
| `accessToken`           | `accessToken`           | Unchanged               | Used for thumbnail fetching.                                                                                              |
| `iModelOptions`         | `contextMenuItems`      | Renamed + type changed  | Type changes from `ContextMenuBuilderItem<IModelFull>[]` to `ContextMenuBuilderItemMUI<IModelFull>[]`.                    |
| `onThumbnailClick`      | `onSelect` / `onOpen`   | Split                   | Single callback split into select (single-click) and open (double-click). Both receive the `IModelFull`.                  |
| `tileProps.isSelected`  | `selected`              | Renamed                 | Flattened to a top-level prop.                                                                                            |
| `tileProps.isLoading`   | `loading`               | Renamed                 | Flattened to a top-level prop.                                                                                            |
| `tileProps.isDisabled`  | `disabled`              | Renamed                 | Flattened to a top-level prop.                                                                                            |
| `tileProps.name`        | `title`                 | Renamed                 | `title` defaults to `iModel.displayName`.                                                                                 |
| `tileProps.thumbnail`   | `thumbnail`             | Moved                   | Flattened to a top-level prop. Legacy defaults to `IModelThumbnail`; V2 defaults to `IModelThumbnailMUI`.                 |
| `tileProps.leftIcon`    | `thumbnailTopLeft`      | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                                                                            |
| `tileProps.rightIcon`   | `thumbnailTopRight`     | Renamed                 | Shared with the favorite icon. V2 renders the favorite here automatically.                                                |
| `tileProps.badge`       | `badge`                 | Renamed                 | Flattened to a top-level prop. Value is placed in `thumbnailBottomRight`.                                                 |
| `tileProps.getBadge`    | `getBadge`              | Moved                   | Flattened to a top-level prop. Return value is placed in `thumbnailBottomRight`.                                          |
| `tileProps.buttons`     | `actions`               | Renamed + type changed  | Type changes from `ReactNode` to `BaseCardActionItem[]`. Rendered as hover-overlay buttons.                               |
| `tileProps.moreOptions` | `contextMenuContent`    | Renamed                 | Still accepts prebuilt menu content, but now follows `BaseCard` naming.                                                   |
| `tileProps.className`   | `className`             | Moved                   | Comes from `CardProps`.                                                                                                   |
| `tileProps.metadata`    | `additionalDescription` | Approximate replacement | V2 auto-populates `additionalDescription` from `iModel.lastChangesetPushDateTime`. Different styling/container semantics. |
| `tileProps.status`      | `status`                | Moved + type changed    | Flattened to a top-level prop. Type changes from itwinui status to `"positive" \| "warning" \| "negative"`.               |
| `apiOverrides`          | `apiOverrides`          | Unchanged               |
| `refetchIModels`        | `refetchIModels`        | Unchanged               |                                                                                                                           |
| `hideFavoriteIcon`      | `hideFavoriteIcon`      | Unchanged               |                                                                                                                           |
| `fullWidth`             | None                    | Removed                 | No direct replacement. Grid layout is now CSS grid via parent.                                                            |
| `tileProps.isNew`       | None                    | Removed                 | No direct replacement currently. TODO: is this needed                                                                     |
| `tileProps.onClick`     | None                    | Removed                 | Replaced by `onSelect` / `onOpen` on the tile.                                                                            |
| `tileProps.children`    | `additionalContent`     | Renamed                 | Via `BaseCardProps`. Rendered below description in the info section.                                                      |
|                         | `description`           | Added                   | `title` defaults to `iModel.description`.                                                                                 |
|                         | `thumbnailTopLeft`      | Added                   |                                                                                                                           |
|                         | `thumbnailBottomLeft`   | Added                   |                                                                                                                           |
|                         | `slotProps`             | Added                   |                                                                                                                           |
|                         | `headerRight`           | Added                   |                                                                                                                           |
|                         | `statusIcon`            | Added                   |                                                                                                                           |

### Behavior changes

- `contextMenuContent` no longer renders as the legacy visible kebab/menu affordance. In MUI it is passed into `BaseCard`'s context menu and opens on right-click.
- `status` is forwarded to `BaseCard` to drive divider color (`"positive"` → success, `"warning"` → warning, `"negative"` → error).
- When `disabled` is true, `BaseCard` suppresses title click, context menu, and double-click handlers. Legacy only passed `isDisabled` through to `Tile.Wrapper`.

---

## `ITwinTile` -> `ITwinTileMUI`

### High-level changes

- `tileProps` bag is removed. Legacy `tileProps` fields become first-class props on `ITwinTileMUI`.
- State props are renamed to match MUI conventions (`isSelected` → `selected`, `isLoading` → `loading`, `isDisabled` → `disabled`).
- The component layout moves from `@itwin/itwinui-react` `Tile.*` primitives to the shared `BaseCard`.
- The legacy inline more-options affordance is replaced by a context menu opened via right-click.
- Click interaction is split: single `onThumbnailClick` → separate `onSelect` (single-click) and `onOpen` (double-click).
- Context menu items use `ContextMenuBuilderItemMUI` instead of `ContextMenuBuilderItem`.
- Status badge rendering: Legacy uses itwinui `Badge` with `backgroundColor` ("oak"/"steelblue"). MUI uses MUI `Chip` with `size="small"` (no color — Stratakit disables Badge/Chip color overrides).

### Prop mapping

| Existing `ITwinTile`    | `ITwinTileMUI`                | Change type             | Notes                                                                                                                 |
| ----------------------- | ----------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `iTwin`                 | `iTwin`                       | Unchanged               |                                                                                                                       |
| `iTwinOptions`          | `contextMenuItems`            | Renamed + type changed  | Type changes from `ContextMenuBuilderItem<ITwinFull>[]` to `ContextMenuBuilderItemMUI<ITwinFull>[]`.                  |
| `onThumbnailClick`      | `onSelect` / `onOpen`         | Split                   | Single callback split into select (single-click) and open (double-click). Both receive the `ITwinFull`.               |
| `tileProps` object      | Top-level props + `slotProps` | Structural change       | `tileProps` are now top-level and additional customization happens via `slotProps`                                    |
| `tileProps.isSelected`  | `selected`                    | Renamed                 | Flattened to a top-level prop.                                                                                        |
| `tileProps.isLoading`   | `loading`                     | Renamed                 | Flattened to a top-level prop.                                                                                        |
| `tileProps.isDisabled`  | `disabled`                    | Renamed                 | Flattened to a top-level prop.                                                                                        |
| `tileProps.name`        | `title`                       | Renamed                 | `title` defaults to `iTwin.displayName`.                                                                              |
| `tileProps.description` | `description`                 | Moved                   | Flattened; defaults to `iTwin.number`.                                                                                |
| `tileProps.thumbnail`   | `thumbnail`                   | Moved                   | Flattened. Default changes from itwinui `SvgItwin` icon to Stratakit `Icon` with `itwin.svg`.                         |
| `tileProps.leftIcon`    | `thumbnailTopLeft`            | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                                                                        |
| `tileProps.rightIcon`   | `thumbnailTopRight`           | Renamed                 | Shared with the favorite icon. MUI component renders the favorite here automatically.                                 |
| `tileProps.badge`       | `thumbnailBottomRight`        | Renamed                 | MUI auto-renders a `StatusBadge` here when `iTwin.status` is not "active". Can be overridden via `getBadge`.          |
| `tileProps.buttons`     | `actions`                     | Renamed + type changed  | Type changes from `ReactNode` to `BaseCardActionItem[]`. Rendered as hover-overlay buttons.                           |
| `tileProps.moreOptions` | `contextMenuContent`          | Renamed                 | Still accepts prebuilt menu content via `BaseCard` naming.                                                            |
| `tileProps.children`    | `additionalContent`           | Renamed                 | Via `BaseCardProps`. Rendered below description in the info section.                                                  |
| `tileProps.className`   | `className`                   | Moved                   | Comes from `CardProps`.                                                                                               |
| `tileProps.status`      | `status`                      | Moved + type changed    | Flattened. Type changes from itwinui status to `"positive" \| "warning" \| "negative"`.                               |
| `tileProps.metadata`    | `additionalDescription`       | Approximate replacement | No exact `metadata` slot exists in MUI. MUI auto-populates `additionalDescription` from `iTwin.lastModifiedDateTime`. |
| `stringsOverrides`      | `stringsOverrides`            | Unchanged               | Same keys: `trialBadge`, `inactiveBadge`, `addToFavorites`, `removeFromFavorites`.                                    |
| `isFavorite`            | `isFavorite`                  | Unchanged               |                                                                                                                       |
| `addToFavorites`        | `addToFavorites`              | Unchanged               |                                                                                                                       |
| `removeFromFavorites`   | `removeFromFavorites`         | Unchanged               |                                                                                                                       |
| `refetchITwins`         | `refetchITwins`               | Unchanged               |                                                                                                                       |
| `hideFavoriteIcon`      | `hideFavoriteIcon`            | Unchanged               |                                                                                                                       |
| `fullWidth`             |                               | Removed                 | No direct replacement. Grid layout is now CSS grid via parent.                                                        |
| `tileProps.isNew`       |                               | Removed                 | No direct replacement currently.                                                                                      |
| `tileProps.onClick`     |                               | Removed                 | Replaced by `onSelect` / `onOpen` on the tile.                                                                        |
|                         | `getBadge`                    | Added                   |                                                                                                                       |
|                         | `slotProps`                   | Added                   |                                                                                                                       |
|                         | `headerRight`                 | Added                   |                                                                                                                       |
|                         | `statusIcon`                  | Added                   |                                                                                                                       |
| children                | `additionalContent`           | Added                   |                                                                                                                       |

### Behavior changes

- `contextMenuContent` no longer renders as the legacy visible kebab/menu affordance. In MUI it is passed into `BaseCard`'s context menu and opens on right-click.
- `additionalDescription` is auto-populated from `iTwin.lastModifiedDateTime` (formatted as `toDateString()`). Legacy had no automatic date display.
- `status` is forwarded to `BaseCard` to drive divider color.
- When `disabled` is true, `BaseCard` suppresses title click, context menu, and double-click handlers. Legacy only passed `isDisabled` through to `Tile.Wrapper`.

---

## `IModelGrid` -> `IModelGridMUI`

### High-level changes

- Click interaction split: `onThumbnailClick` → `onOpen` + `onSelect`.
- Context menu items use `ContextMenuBuilderItemMUI` instead of `ContextMenuBuilderItem`.
- Grid tile type: `useIndividualState` and `tileOverrides` operate on `IModelTileMUIProps` instead of `IModelTileProps`.
- Loading placeholders: `IModelGhostTile` → `BaseCardLoading`.
- Grid container: `GridStructure` wrapper → MUI `Box` with CSS grid (`repeat(auto-fill, minmax(22.5rem, 1fr))`).
- Adds internal "Remove from recents" action rendering using MUI `Box`/`Icon` layout instead of itwinui icons.
- Adds internal selection tracking (`selectedIModelId` state) — not present in legacy.

### Prop mapping

| Legacy `IModelGrid`  | `IModelGridMUI`       | Change type           | Notes                                                                                                                                                                                                                                                                                                      |
| -------------------- | --------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onThumbnailClick`   | `onOpen` / `onSelect` | Split                 | `onOpen` also adds iModel to recents (unless `disableAddToRecents`).                                                                                                                                                                                                                                       |
| `iModelActions`      | `iModelActions`       | Type changed          | `ContextMenuBuilderItem[]` → `ContextMenuBuilderItemMUI[]`.                                                                                                                                                                                                                                                |
| `useIndividualState` | `useIndividualState`  | Signature changed     | Receives/returns `IModelTileMUIProps` instead of `IModelTileProps`.                                                                                                                                                                                                                                        |
| `tileOverrides`      | `tileOverrides`       | Type changed          | `Partial<IModelTileProps>` → `Partial<IModelTileMUIProps>`.                                                                                                                                                                                                                                                |
| All other props      | Same                  | Inherited from legacy | `accessToken`, `iTwinId`, `requestType`, `sortOptions`, `searchText`, `pageSize`, `maxCount`, `apiOverrides`, `postProcessCallback`, `emptyStateComponent`, `viewMode`, `cellOverrides`, `className`, `dataMode`, `onLoadMore`, `onRefetch`, `disableAddToRecents`, `removeFromRecentsIcon` are unchanged. |

### Behavior changes

- The "cells" (table) view mode still uses itwinui `Table` component with `ThemeProvider theme="inherit"`. This has not been migrated to MUI yet.
- Infinite scroll loading indicators use `BaseCardLoading` instead of `IModelGhostTile`.
- The grid manages `resolvedOnOpen` / `resolvedOnSelect` from `tileOverrides` to allow overrides to take effect properly.

---

## `ITwinGrid` -> `ITwinGridMUI`

### High-level changes

- Click interaction split: `onThumbnailClick` → `onOpen` + `onSelect`.
- Context menu items use `ContextMenuBuilderItemMUI` instead of `ContextMenuBuilderItem`.
- Grid tile type: `useIndividualState` and `tileOverrides` operate on `ITwinTileMUIProps` instead of `ITwinTileProps`.
- Loading placeholders: `IModelGhostTile` → `BaseCardLoading`.
- Grid container: `GridStructure` wrapper → MUI `Box` with CSS grid (`repeat(auto-fill, minmax(22.5rem, 1fr))`).
- Adds internal selection tracking (`selectedITwinId` state) — not present in legacy.
- Exports `IndividualITwinStateHookMUI` type alias (MUI counterpart to `IndividualITwinStateHook`).

### Prop mapping

| Legacy `ITwinGrid`   | `ITwinGridMUI`        | Change type           | Notes                                                                                                                                                                                                |
| -------------------- | --------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onThumbnailClick`   | `onOpen` / `onSelect` | Split                 |                                                                                                                                                                                                      |
| `iTwinActions`       | `iTwinActions`        | Type changed          | `ContextMenuBuilderItem[]` → `ContextMenuBuilderItemMUI[]`.                                                                                                                                          |
| `useIndividualState` | `useIndividualState`  | Signature changed     | Uses `IndividualITwinStateHookMUI` — receives/returns `ITwinTileMUIProps`.                                                                                                                           |
| `tileOverrides`      | `tileOverrides`       | Type changed          | `Partial<ITwinTileProps>` → `Partial<ITwinTileMUIProps>`.                                                                                                                                            |
| All other props      | Same                  | Inherited from legacy | `accessToken`, `requestType`, `iTwinSubClass`, `filterOptions`, `orderbyOptions`, `apiOverrides`, `postProcessCallback`, `viewMode`, `cellOverrides`, `className`, `stringsOverrides` are unchanged. |

### Behavior changes

- The "cells" (table) view mode still uses itwinui `Table` with `useITwinTableConfig` (legacy hook, passed `onThumbnailClick: onSelect` with `as any` cast). This is a known TODO.
- Selection state is tracked internally — calling `onSelect` also sets `selectedITwinId`, which highlights the tile via `selected` prop.

---

## `ContextMenuBuilderItem` -> `ContextMenuBuilderItemMUI`

| Property   | Legacy (`ContextMenuBuilderItem`)                      | MUI (`ContextMenuBuilderItemMUI`)              | Notes                                           |
| ---------- | ------------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------- |
| Extends    | `Omit<itwinui MenuItemProps, "onClick" \| ...>`        | `Omit<MUI MenuItemProps, "onClick" \| ...>`    | Base type changes from itwinui to MUI MenuItem. |
| `key`      | `string`                                               | `string`                                       | Unchanged.                                      |
| `children` | Positional (via itwinui `MenuItem`)                    | `children: ReactNode` (explicit, **required**) | Must be provided explicitly in MUI.             |
| `visible`  | `boolean \| ((value: T) => boolean)`                   | Same                                           | Unchanged.                                      |
| `onClick`  | `((value?: T, refetchData?: () => void) => void)`      | Same                                           | Unchanged.                                      |
| `disabled` | `MenuItemProps["disabled"] \| ((value: T) => boolean)` | Same (MUI `MenuItemProps["disabled"]`)         | Unchanged behavior, different base type.        |

---

## `TileFavoriteIcon` -> `TileFavoriteIconMUI`

| Property                | Legacy                                      | MUI                                                | Notes                                                    |
| ----------------------- | ------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| `isFavorite`            | `boolean`                                   | `boolean`                                          | Unchanged.                                               |
| `onAddToFavorites`      | `() => Promise<void>`                       | `() => Promise<void> \| void`                      | MUI allows synchronous callbacks.                        |
| `onRemoveFromFavorites` | `() => Promise<void>`                       | `() => Promise<void> \| void`                      | MUI allows synchronous callbacks.                        |
| `addLabel`              | `string`                                    | `string`                                           | Unchanged.                                               |
| `removeLabel`           | `string`                                    | `string`                                           | Unchanged.                                               |
| `className`             | `string?`                                   | `string?`                                          | Unchanged.                                               |
| `disabled`              | N/A                                         | `boolean?`                                         | **New in MUI.** Disables the icon button.                |
| `sx`                    | N/A                                         | `SxProps?`                                         | **New in MUI.** MUI sx styling prop.                     |
| Icon rendering          | `SvgStar` / `SvgStarHollow` (itwinui icons) | `Icon href={pin.svg}` (Stratakit) with CSS classes | Visual change: star → pin icon. Filled/unfilled via CSS. |

### `IModelThumbnailMUI`

MUI version of `IModelThumbnail`. Same props interface (`iModelId`, `accessToken`, `apiOverrides`, `className`, `onClick`). Rendering differs: uses MUI `CardMedia` + `Skeleton` instead of itwinui `Tile.ThumbnailPicture` + `Text isSkeleton`.

---

## `NoResults` -> `NoResultsMUI`

### High-level changes

- Icons change from itwinui-icons-react (`SvgImodelHollow`, `SvgSearch`) to Stratakit `Icon` with `imodel.svg` / `search.svg`.
- Text rendering changes from itwinui `Text` to MUI `Typography`.
- Layout changes from global SCSS classes (`iac-no-results-container`, `iac-no-results`) to MUI `Box` with `sx` props + a CSS module for icon sizing.

### Prop mapping

| `NoResults`      | `NoResultsMUI`   | Change type | Notes                                                     |
| ---------------- | ---------------- | ----------- | --------------------------------------------------------- |
| `text`           | `text`           | Unchanged   |                                                           |
| `subtext`        | `subtext`        | Unchanged   |                                                           |
| `isSearchResult` | `isSearchResult` | Unchanged   | Defaults to `false`. Switches icon from imodel to search. |

### Behavior changes

- Icon size is set via CSS module class (`5rem × 5rem`) instead of itwinui CSS variables (`--iui-size-2xl`).
- Text variant changes from itwinui `Text variant="leading"` to MUI `Typography variant="h6"` for the primary text, and `Typography variant="body1"` for subtext.
- Icon color uses MUI theme path `"text.secondary"` instead of itwinui `--iui-color-icon-muted`.

---

## Shared migration themes

- Expect a styling migration from `@itwin/itwinui-react` `Tile` primitives to `@mui/material` plus `@stratakit/mui`.
- Expect tests and stories to change from nested `tileProps` fixtures to flattened V2 props.
- Expect any code depending on a visible more-options button to be updated, since V2 currently exposes the menu through right-click behavior instead.
- Context menu items must be migrated from `ContextMenuBuilderItem` to `ContextMenuBuilderItemMUI` — the key difference is the explicit `children: ReactNode` prop.
- Favorite callbacks now accept sync or async returns (`Promise<void> | void`).
- The `actions` prop type changes from `ReactNode` (arbitrary content) to `BaseCardActionItem[]` (structured objects). This is a breaking change for consumers who passed custom button JSX.
- Grid containers no longer use `GridStructure` — layout is handled by MUI `Box` with CSS grid.
- The table/cells view mode has **not** been migrated to MUI — both V2 grid components still use itwinui `Table` with `ThemeProvider theme="inherit"`.

## Export status

### Legacy barrel (`src/index.ts`)

Exports legacy components only:

- `IModelGrid`, `IModelTile`, `IModelGhostTile`, `IModelThumbnail`
- `ITwinGrid`, `ITwinTile`
- `NoResults`
- Shared types

### MUI barrel (`src/mui/index.ts`)

New entry point that re-exports MUI components under **legacy-aligned names**:

| Export name                | Internal component            |
| -------------------------- | ----------------------------- |
| `IModelGrid`               | `IModelGridMUI`               |
| `IModelGridProps`          | `IModelGridMUIProps`          |
| `IModelTile`               | `IModelTileMUI`               |
| `IModelTileProps`          | `IModelTileMUIProps`          |
| `IModelThumbnail`          | `IModelThumbnailMUI`          |
| `IModelThumbnailProps`     | `IModelThumbnailMUIProps`     |
| `ITwinGrid`                | `ITwinGridMUI`                |
| `ITwinGridProps`           | `ITwinGridMUIProps`           |
| `IndividualITwinStateHook` | `IndividualITwinStateHookMUI` |
| `ITwinGridStrings`         | `ITwinGridStrings`            |
| `ITwinTile`                | `ITwinTileMUI`                |
| `ITwinTileProps`           | `ITwinTileMUIProps`           |
| `NoResults`                | `NoResultsMUI`                |
| `NoResultsProps`           | `NoResultsMUIProps`           |

Also re-exports all shared types.

Built via a separate rollup entry point → `cjs/src/mui/index.js` / `esm/src/mui/index.js`.

This allows consumers to swap imports from the legacy barrel to the MUI barrel with minimal rename churn.

### Not exported from either barrel

- `BaseCard`, `BaseCardLoading` (internal building blocks)
- `TileFavoriteIconMUI` (internal)
- `ContextMenuBuilderItemMUI` (type — importable via deep path)

## Open questions to track

- Should V2 expose a visible more-options trigger in addition to right-click?
- Do we need a replacement for legacy `isNew` and `fullWidth` before V2 is exported publicly?
