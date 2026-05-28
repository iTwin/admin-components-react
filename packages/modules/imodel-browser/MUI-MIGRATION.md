# MUI Migration Notes

This file tracks migration notes for the MUI/Stratakit components.

A new `src/mui/index.ts` barrel re-exports MUI components under legacy-aligned names (e.g. `IModelGridMUI as IModelGrid`). This is built as a separate rollup entry point.

## `IModelTile` -> `IModelTileMUI`

- `tileProps` fields become first-class props on `IModelTileMUI`.
- State props are renamed to match MUI conventions (`isSelected` → `selected`, `isLoading` → `loading`, `isDisabled` → `disabled`).
- Click interaction is split: `onThumbnailClick` → separate `onSelect` (single-click) and `onOpen` (double-click).
- Context menu items use `ContextMenuBuilderItemMUI` and require an explicit `children: ReactNode` prop.

### Prop mapping

| `IModelTile`            | `IModelTileMUI`         | Change type             | Notes                                                                                                           |
| ----------------------- | ----------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `iModel`                | `iModel`                | Unchanged               |                                                                                                                 |
| `accessToken`           | `accessToken`           | Unchanged               | Used for thumbnail fetching.                                                                                    |
| `iModelOptions`         | `contextMenuItems`      | Renamed + type changed  | Type changes from `ContextMenuBuilderItem<IModelFull>[]` to `ContextMenuBuilderItemMUI<IModelFull>[]`.          |
| `onThumbnailClick`      | `onSelect` / `onOpen`   | Split                   | Single callback split into select (single-click) and open (double-click). Both receive the `IModelFull`.        |
| `tileProps.isSelected`  | `selected`              | Renamed                 | Flattened to a top-level prop.                                                                                  |
| `tileProps.isLoading`   | `loading`               | Renamed                 | Flattened to a top-level prop.                                                                                  |
| `tileProps.isDisabled`  | `disabled`              | Renamed                 | Flattened to a top-level prop.                                                                                  |
| `tileProps.name`        | `title`                 | Renamed                 | `title` defaults to `iModel.displayName`.                                                                       |
| `tileProps.thumbnail`   | `thumbnail`             | Moved                   | Flattened to a top-level prop. Legacy defaults to `IModelThumbnail`; V2 defaults to `IModelThumbnailMUI`.       |
| `tileProps.leftIcon`    | `thumbnailTopLeft`      | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                                                                  |
| `tileProps.rightIcon`   | -                       | Removed                 | MUI renders the favorite and context menu trigger here automatically.                                           |
| `tileProps.badge`       | `badge`                 | Renamed                 | Flattened to a top-level prop. Value is placed in `thumbnailBottomRight`.                                       |
| `tileProps.getBadge`    | `getBadge`              | Moved                   | Flattened to a top-level prop. Return value is placed in `thumbnailBottomRight`. Takes precedence over `badge`. |
| `tileProps.buttons`     | `actions`               | Renamed + type changed  | Type changes from `ReactNode` to `BaseCardActionItem[]`. Rendered as hover-overlay buttons.                     |
| `tileProps.moreOptions` | `contextMenuItems`      | Renamed + type changed  | Combined with `contextMenuItems`                                                                                |
| `tileProps.className`   | `className`             | Moved                   | Comes from `CardProps`.                                                                                         |
| `tileProps.metadata`    | `additionalDescription` | Approximate replacement | Pass-through prop. No auto-population — consumers must supply the value.                                        |
| `tileProps.status`      | `status`                | Moved + type changed    | Flattened to a top-level prop. Type changes from itwinui status to `"positive" \| "warning" \| "negative"`.     |
| `apiOverrides`          | `apiOverrides`          | Unchanged               |
| `refetchIModels`        | `refetchIModels`        | Unchanged               |                                                                                                                 |
| `hideFavoriteIcon`      | `hideFavoriteIcon`      | Unchanged               |                                                                                                                 |
| `fullWidth`             | -                       | Removed                 | No direct replacement. Grid layout is now CSS grid via parent.                                                  |
| `tileProps.isNew`       | -                       | Removed                 | No direct replacement currently. TODO: IS THIS NEEDED?                                                          |
| `tileProps.onClick`     | -                       | Removed                 | Replaced by `onSelect` / `onOpen` on the tile.                                                                  |
| `tileProps.children`    | `additionalContent`     | Renamed                 | Via `BaseCardProps`. Rendered below description in the info section.                                            |
|                         | `badge`                 | Added                   | Static badge node for `thumbnailBottomRight`. `getBadge` takes precedence when both provided.                   |
|                         | `description`           | Added                   | Defaults to `iModel.description`.                                                                               |
|                         | `thumbnailTopLeft`      | Added                   | Overlay slot in the top-left of the thumbnail.                                                                  |
|                         | `thumbnailBottomLeft`   | Added                   | Overlay slot in the bottom-left of the thumbnail.                                                               |
|                         | `slotProps`             | Added                   | `BaseCard` slot styling API — each slot accepts `className` and `sx`.                                           |
|                         | `headerRight`           | Added                   | Slot to the right of the title in the header row.                                                               |
|                         | `statusIcon`            | Added                   | Icon rendered to the left of the content area.                                                                  |

---

## `ITwinTile` -> `ITwinTileMUI`

- `tileProps` fields become first-class props on `ITwinTileMUI`.
- State props are renamed to match MUI conventions (`isSelected` → `selected`, `isLoading` → `loading`, `isDisabled` → `disabled`).
- Click interaction is split: `onThumbnailClick` → separate `onSelect` (single-click) and `onOpen` (double-click).
- Context menu items use `ContextMenuBuilderItemMUI` instead of `ContextMenuBuilderItem`.

### Prop mapping

| Existing `ITwinTile`    | `ITwinTileMUI`                | Change type             | Notes                                                                                                        |
| ----------------------- | ----------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `iTwin`                 | `iTwin`                       | Unchanged               |                                                                                                              |
| `iTwinOptions`          | `contextMenuItems`            | Renamed + type changed  | Type changes from `ContextMenuBuilderItem<ITwinFull>[]` to `ContextMenuBuilderItemMUI<ITwinFull>[]`.         |
| `onThumbnailClick`      | `onSelect` / `onOpen`         | Split                   | Single callback split into select (single-click) and open (double-click). Both receive the `ITwinFull`.      |
| `tileProps` object      | Top-level props + `slotProps` | Structural change       | `tileProps` are now top-level and additional customization happens via `slotProps`.                          |
| `tileProps.isSelected`  | `selected`                    | Renamed                 | Flattened to a top-level prop.                                                                               |
| `tileProps.isLoading`   | `loading`                     | Renamed                 | Flattened to a top-level prop.                                                                               |
| `tileProps.isDisabled`  | `disabled`                    | Renamed                 | Flattened to a top-level prop.                                                                               |
| `tileProps.name`        | `title`                       | Renamed                 | `title` defaults to `iTwin.displayName`.                                                                     |
| `tileProps.description` | `description`                 | Moved                   | Flattened; defaults to `iTwin.number`.                                                                       |
| `tileProps.thumbnail`   | `thumbnail`                   | Moved                   | Flattened. Default changes from itwinui `SvgItwin` icon to Stratakit `Icon` with `itwin.svg`.                |
| `tileProps.leftIcon`    | `thumbnailTopLeft`            | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                                                               |
| `tileProps.rightIcon`   | None                          | Removed                 | MUI renders the favorite and context menu trigger here automatically.                                        |
| `tileProps.badge`       | `thumbnailBottomRight`        | Renamed                 | MUI auto-renders a `StatusBadge` here when `iTwin.status` is not "active". Can be overridden via `getBadge`. |
| `tileProps.buttons`     | `actions`                     | Renamed + type changed  | Type changes from `ReactNode` to `BaseCardActionItem[]`. Rendered as hover-overlay buttons.                  |
| `tileProps.moreOptions` | `contextMenuItems`            | Renamed + type changed  | Combined with `contextMenuItems`                                                                             |
| `tileProps.children`    | `additionalContent`           | Renamed                 | Via `BaseCardProps`. Rendered below description in the info section.                                         |
| `tileProps.className`   | `className`                   | Moved                   | Comes from `CardProps`.                                                                                      |
| `tileProps.status`      | `status`                      | Moved + type changed    | Flattened. Type changes from itwinui status to `"positive" \| "warning" \| "negative"`.                      |
| `tileProps.metadata`    | `additionalDescription`       | Approximate replacement | Auto-populated from `iTwin.lastModifiedDateTime` (formatted as `toDateString()`).                            |
| `stringsOverrides`      | `stringsOverrides`            | Unchanged               | Same keys: `trialBadge`, `inactiveBadge`, `addToFavorites`, `removeFromFavorites`.                           |
| `isFavorite`            | `isFavorite`                  | Unchanged               |                                                                                                              |
| `addToFavorites`        | `addToFavorites`              | Unchanged               |                                                                                                              |
| `removeFromFavorites`   | `removeFromFavorites`         | Unchanged               |                                                                                                              |
| `refetchITwins`         | `refetchITwins`               | Unchanged               |                                                                                                              |
| `hideFavoriteIcon`      | `hideFavoriteIcon`            | Unchanged               |                                                                                                              |
| `fullWidth`             |                               | Removed                 | No direct replacement. Grid layout is now CSS grid via parent.                                               |
| `tileProps.isNew`       |                               | Removed                 | No direct replacement currently.                                                                             |
| `tileProps.onClick`     |                               | Removed                 | Replaced by `onSelect` / `onOpen` on the tile.                                                               |
|                         | `getBadge`                    | Added                   | `(iTwin: ITwinFull) => ReactNode`. Overrides the default `StatusBadge`.                                      |
|                         | `slotProps`                   | Added                   | `BaseCard` slot styling API — each slot accepts `className` and `sx`.                                        |
|                         | `headerRight`                 | Added                   | Slot to the right of the title in the header row.                                                            |
|                         | `statusIcon`                  | Added                   | Icon rendered to the left of the content area.                                                               |

### Behavior changes

- Context menu opens on right-click. Accepts both `contextMenuItems` (built internally) and `contextMenuContent` (pre-built ReactNode pass-through).
- `additionalDescription` is auto-populated from `iTwin.lastModifiedDateTime` (formatted as `toDateString()`).
- `status` is forwarded to `BaseCard` to drive divider color.
- When `disabled` is true, `BaseCard` suppresses title click, context menu, and double-click handlers.

---

## `IModelGrid` -> `IModelGridMUI`

### High-level changes

- Click interaction split: `onThumbnailClick` → `onOpen` + `onSelect`.
- Context menu items use `ContextMenuBuilderItemMUI` instead of `ContextMenuBuilderItem`.
- Adds "selected iTwin" tracking (`selectedIModelId` state).

### Prop mapping

| `IModelGrid`         | `IModelGridMUI`       | Change type  | Notes                                                                |
| -------------------- | --------------------- | ------------ | -------------------------------------------------------------------- |
| `onThumbnailClick`   | `onOpen` / `onSelect` | Split        | `onOpen` also adds iModel to recents (unless `disableAddToRecents`). |
| `iModelActions`      | `iModelActions`       | Type changed | TODO: maybe rename to contextMenuItems?                              |
| `useIndividualState` | `useIndividualState`  | Type changed | ``IModelTileProps` → IModelTileMUIProps`                             |
| `tileOverrides`      | `tileOverrides`       | Type changed | `Partial<IModelTileProps>` → `Partial<IModelTileMUIProps>`.          |
| All other props      | Same                  | Unchanged    | `accessToken`, `iTwinId`, etc... are unchanged.                      |

### Behavior changes

- The "cells" (table) view mode uses MUI X DataGrid (Community edition) via `IModelTableMUI`. See [cellOverrides → tableOverrides migration](#celloverrides--tableoverrides-migration) below.
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

| `ITwinGrid`          | `ITwinGridMUI`        | Change type  | Notes                                                                |
| -------------------- | --------------------- | ------------ | -------------------------------------------------------------------- |
| `onThumbnailClick`   | `onOpen` / `onSelect` | Split        |                                                                      |
| `iTwinActions`       | `iTwinActions`        | Type changed | TODO: maybe rename to contextMenuItems?                              |
| `useIndividualState` | `useIndividualState`  | Type changed | `ITwinTileProps` → `ITwinTileMUIProps`                               |
| `tileOverrides`      | `tileOverrides`       | Type changed | `Partial<ITwinTileProps>` → `Partial<ITwinTileMUIProps>`.            |
| All other props      | Same                  | Unchanged    | `accessToken`, `requestType`, `iTwinSubClass`, etc... are unchanged. |

### Behavior changes

- The "cells" (table) view mode uses MUI X DataGrid (Community edition) via `ITwinTableMUI`. See [cellOverrides → tableOverrides migration](#celloverrides--tableoverrides-migration) below.
- Selection state is tracked internally — calling `onSelect` also sets `selectedITwinId`, which highlights the tile via `selected` prop.

---

## `ContextMenuBuilderItem` -> `ContextMenuBuilderItemMUI`

| Property   | `ContextMenuBuilderItem`                               | `ContextMenuBuilderItemMUI`                                       | Notes                                                                                                                                  |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Extends    | `Omit<itwinui MenuItemProps, "onClick" \| ...>`        | `Omit<MUI MenuItemProps, "onClick" \| ...>`                       | Base type changes from itwinui to MUI MenuItem.                                                                                        |
| `key`      | `string`                                               | `string`                                                          | Unchanged.                                                                                                                             |
| `children` | Positional (via itwinui `MenuItem`)                    | `ReactNode \| ((value: T) => ReactNode)` (explicit, **required**) | Must be provided explicitly. Accepts a render function to generate content per-item (e.g. `(iTwin) => \`View ${iTwin.displayName}\``). |
| `icon`     | Inherited from itwinui `MenuItem`                      | `ReactNode?`                                                      | **New explicit prop.** Optional icon rendered before `children`. When provided, the menu item gets flex alignment automatically.        |
| `visible`  | `boolean \| ((value: T) => boolean)`                   | Same                                                              | Unchanged.                                                                                                                             |
| `onClick`  | `((value?: T, refetchData?: () => void) => void)`      | Same                                                              | Unchanged.                                                                                                                             |
| `disabled` | `MenuItemProps["disabled"] \| ((value: T) => boolean)` | Same (MUI `MenuItemProps["disabled"]`)                            | Unchanged behavior, different base type.                                                                                               |

---

## `TileFavoriteIcon` -> `TileFavoriteIconMUI`

| Property                | `TileFavoriteIcon``                         | `TileFavoriteIconMUI``                             | Notes                                                    |
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

### `IModelThumbnail` -> `IModelThumbnailMUI`

API is unchanged.

---

## `NoResults` -> `NoResultsMUI`

API is unchanged.

---

## Exports via MUI barrel (`src/mui/index.ts`)

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
| `IModelGhostTile`          | `BaseCardLoading`             |
| `IModelGhostTileProps`     | `BaseCardLoadingProps`        |
| `ContextMenuBuilderItem`   | `ContextMenuBuilderItemMUI`   |
| `ThumbnailIconButton`      | `ThumbnailIconButton`         |

Also re-exports all shared types.

Built via a separate rollup entry point → `cjs/src/mui/index.js` / `esm/src/mui/index.js`.

This allows consumers to swap imports from the legacy barrel to the MUI barrel with minimal rename churn.

### Not exported from either barrel

- `BaseCard` (internal building block)
- `TileFavoriteIconMUI` (internal)

### New exports (no legacy equivalent)

- `ThumbnailIconButton` — styled MUI `IconButton` with translucent background and backdrop blur, intended for use in thumbnail overlay slots (`thumbnailTopLeft`, `thumbnailTopRight`, etc.).

---

## cellOverrides → tableOverrides migration

The legacy `cellOverrides` API (used by `IModelGrid` and `ITwinGrid`) passes react-table `CellProps` render functions per column. The MUI variants replace this with a `tableOverrides` prop using a MUI-native API.

### Shape change

Legacy (`IModelCellOverrides` / `ITwinCellOverrides`):

```ts
cellOverrides: {
  name: (cellProps: CellProps<IModelFull>) => <div>{cellProps.value}</div>,
  description: (cellProps) => <em>{cellProps.value}</em>,
  hideColumns: [IModelCellColumn.LastModified],
}
```

MUI (`IModelTableOverridesMUI` / `ITwinTableOverridesMUI`):

```ts
tableOverrides: {
  columnOverrides: {
    [IModelCellColumn.Name]: {
      renderCell: (params) => <div>{params.value}</div>,
    },
    [IModelCellColumn.Description]: {
      renderCell: (params) => <em>{params.value}</em>,
      sortable: false,
    },
  },
  hideColumns: [IModelCellColumn.LastModified],
}
```

### Key differences

| Aspect                 | Legacy                                                                  | MUI                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Override shape         | Flat keys (`name`, `description`, `lastModified`) with render functions | `columnOverrides` record keyed by `IModelCellColumn` / `ITwinCellColumn` enum                       |
| Render function params | react-table `CellProps<T>` (`{ value, row: { original } }`)             | MUI `GridRenderCellParams<T>` (`{ value, row, formattedValue, ... }`)                               |
| Override scope         | Render function only                                                    | Any `GridColDef` property (`renderCell`, `valueFormatter`, `width`, `sortable`, `headerName`, etc.) |
| Hide columns           | `hideColumns: CellColumn[]` (same)                                      | `hideColumns: CellColumn[]` (same)                                                                  |
| Prop name              | `cellOverrides`                                                         | `tableOverrides`                                                                                    |
| Type safety            | `as any` shims needed internally                                        | Fully typed — overrides are `Partial<GridColDef<T>>`                                                |

### Column enum mapping

**IModel columns** (`IModelCellColumn`):

| Legacy key                         | Enum value                                                           | DataGrid field              |
| ---------------------------------- | -------------------------------------------------------------------- | --------------------------- |
| (favorites)                        | `IModelCellColumn.Favorite`                                          | `id`                        |
| `name`                             | `IModelCellColumn.Name`                                              | `name`                      |
| `description`                      | `IModelCellColumn.Description`                                       | `description`               |
| `lastModified` / `createdDateTime` | `IModelCellColumn.LastModified` / `IModelCellColumn.CreatedDateTime` | `lastChangesetPushDateTime` |
| (options)                          | `IModelCellColumn.Options`                                           | `actions`                   |

**ITwin columns** (`ITwinCellColumn`):

| Legacy key     | Enum value                     | DataGrid field         |
| -------------- | ------------------------------ | ---------------------- |
| (favorites)    | `ITwinCellColumn.Favorite`     | `id`                   |
| `ITwinNumber`  | `ITwinCellColumn.Number`       | `number`               |
| `ITwinName`    | `ITwinCellColumn.Name`         | `displayName`          |
| `LastModified` | `ITwinCellColumn.LastModified` | `lastModifiedDateTime` |
| (options)      | `ITwinCellColumn.Options`      | `actions`              |

### Table component details

- Component: MUI X DataGrid (Community/free edition, `@mui/x-data-grid`)
- Localization: Bentley-specific strings mapped to DataGrid `localeText` prop (`noRowsLabel`, `noResultsOverlayLabel`). MUI pagination chrome uses MUI defaults — host app can localize via `ThemeProvider` + MUI locale pack.
- Built-in features: Pagination, column sorting, column resize.
- Row click: Fires `onOpen` callback with the clicked iModel/iTwin.

---

## TODO

- Rename `iTwinActions` and `iModelActions` to contextMenu?
- Do we need a replacement for `isNew` and `fullWidth`?
- Fix fallback icons - rendered differently currently
- Verify icons on top of different colour thumbnails
