# V2 Migration Notes

This file tracks migration notes for the MUI/Stratakit tile work on branch `alex/imodelgrid-mui`.

## Maintenance

- Update this file whenever a V2 component prop, slot, export, or interaction pattern changes.
- Prefer recording the change in the running log first, then fold it into the detailed sections below if it affects migration guidance.

## Running change log

### 2026-05-06

- Created the initial migration guide comparing legacy `IModelTile` and `ITwinTile` to `IModelTileMUI` and `ITwinTileMUI`.
- Recorded the current branch-only breaking differences for early V2 adopters: flattened props, MUI-style state prop renames, removed legacy `tileProps`, and changed more-options interaction.
- Renamed several V2 wrapper aliases to align with `BaseCard`/MUI naming: `buttons` -> `actions`, `moreOptions` -> `contextMenuContent`, `leftIcon` -> `thumbnailTopLeft`, `rightIcon` -> `thumbnailTopRight`, and `badge` -> `thumbnailBottomRight`.

## Current status

- There is no published package-level breaking change yet for consumers on `main`.
- The package barrel at `src/index.ts` still exports the legacy `IModelTile` and `ITwinTile` components only.
- `BaseCard`, `IModelTileMUI`, `ITwinTileMUI`, and related V2 helpers are currently branch-only surfaces.

That means the items below are migration notes for adopters moving from the legacy tile components to the new V2 components, or for a future release that exports V2 publicly.

## `IModelTile` -> `IModelTileMUI`

### High-level changes

- `tileProps` is removed. Most legacy `tileProps` fields become first-class props on `IModelTileMUI`.
- State props are renamed to match MUI conventions.
- The component customization model changes from overriding `Tile.*` internals to using `BaseCard` plus `slotProps`.
- The legacy inline more-options affordance is replaced by a context menu opened via right-click.

### Prop mapping

| Legacy `IModelTile`     | `IModelTileMUI`               | Change type             | Notes                                                                                |
| ----------------------- | ----------------------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `tileProps.isSelected`  | `selected`                    | Renamed                 | Flattened to a top-level prop.                                                       |
| `tileProps.isLoading`   | `loading`                     | Renamed                 | Flattened to a top-level prop.                                                       |
| `tileProps.isDisabled`  | `disabled`                    | Renamed                 | Flattened to a top-level prop.                                                       |
| `tileProps.name`        | `title`                       | Renamed                 | `title` defaults to `iModel.displayName`.                                            |
| `tileProps.thumbnail`   | `thumbnail`                   | Moved                   | Flattened to a top-level prop.                                                       |
| `tileProps.leftIcon`    | `thumbnailTopLeft`            | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                                       |
| `tileProps.badge`       | `thumbnailBottomRight`        | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                                       |
| `tileProps.getBadge`    | `getBadge`                    | Moved                   | Flattened to a top-level prop.                                                       |
| `tileProps.buttons`     | `actions`                     | Renamed                 | Uses the shared `BaseCard` footer prop name.                                         |
| `tileProps.moreOptions` | `contextMenuContent`          | Renamed                 | Still accepts prebuilt menu content, but now follows `BaseCard` naming.              |
| `tileProps.className`   | `className`                   | Moved                   | Comes from `CardProps`.                                                              |
| `tileProps.metadata`    | `fineprint`                   | Approximate replacement | Same general placement below description, but different styling/container semantics. |
| `tileProps.status`      | `status`                      | Moved                   | Flattened to a top-level prop.                                                       |
| `fullWidth`             | None                          | Removed                 | No direct replacement currently.                                                     |
| `tileProps.isNew`       | None                          | Removed                 | No direct replacement currently.                                                     |
| `tileProps.rightIcon`   | `thumbnailTopRight`           | Renamed                 | Shares the top-right thumbnail slot with the favorite action.                        |
| `tileProps.onClick`     | `onThumbnailClick`            | Approximate replacement | Still item-based; internally this only wires the title action in V2.                 |
| `tileProps` object      | Top-level props + `slotProps` | Structural change       | Consumers must unwrap the nested bag.                                                |

### New V2-only props

- `thumbnailBottomLeft`: New overlay slot in the lower-left thumbnail corner.
- `isFavorite`, `addToFavorites`, `removeFromFavorites`: Standalone favorite control without requiring context.
- `slotProps`: New `BaseCard` slot styling API.

### Behavior changes

- `contextMenuContent` no longer renders as the legacy visible kebab/menu affordance. In V2 it is passed into `BaseCard`'s context menu and opens on right-click.
- `onThumbnailClick` no longer covers the legacy description/content action area. In V2 it only wires the title action.
- When `disabled` is true, `BaseCard` suppresses title click, context menu, and double-click handlers.

## `ITwinTile` -> `ITwinTileMUI`

### High-level changes

- `tileProps` is removed. Most legacy `tileProps` fields become first-class props on `ITwinTileMUI`.
- State props are renamed to match MUI conventions.
- The component layout moves from `@itwin/itwinui-react` `Tile.*` primitives to the shared `BaseCard`.
- The legacy inline more-options affordance is replaced by a context menu opened via right-click.

### Prop mapping

| Legacy `ITwinTile`      | `ITwinTileMUI`                | Change type             | Notes                                                          |
| ----------------------- | ----------------------------- | ----------------------- | -------------------------------------------------------------- |
| `tileProps.isSelected`  | `selected`                    | Renamed                 | Flattened to a top-level prop.                                 |
| `tileProps.isLoading`   | `loading`                     | Renamed                 | Flattened to a top-level prop.                                 |
| `tileProps.isDisabled`  | `disabled`                    | Renamed                 | Flattened to a top-level prop.                                 |
| `tileProps.name`        | `title`                       | Renamed                 | `title` defaults to `iTwin.displayName`.                       |
| `tileProps.description` | `description`                 | Moved                   | Flattened to a top-level prop.                                 |
| `tileProps.thumbnail`   | `thumbnail`                   | Moved                   | Flattened to a top-level prop.                                 |
| `tileProps.leftIcon`    | `thumbnailTopLeft`            | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                 |
| `tileProps.rightIcon`   | `thumbnailTopRight`           | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                 |
| `tileProps.badge`       | `thumbnailBottomRight`        | Renamed                 | Flattened to a top-level `BaseCard` slot prop.                 |
| `tileProps.buttons`     | `actions`                     | Renamed                 | Uses the shared `BaseCard` footer prop name.                   |
| `tileProps.moreOptions` | `contextMenuContent`          | Renamed                 | Still accepts prebuilt menu content via `BaseCard` naming.     |
| `tileProps.children`    | `children`                    | Moved                   | Now documented as content below fineprint in the info section. |
| `tileProps.className`   | `className`                   | Moved                   | Comes from `CardProps`.                                        |
| `tileProps.status`      | `status`                      | Moved                   | Flattened to a top-level prop.                                 |
| `tileProps.metadata`    | `fineprint` or `children`     | Approximate replacement | No exact `metadata` slot exists in V2.                         |
| `fullWidth`             | None                          | Removed                 | No direct replacement currently.                               |
| `tileProps.isNew`       | None                          | Removed                 | No direct replacement currently.                               |
| `tileProps.onClick`     | None                          | Removed                 | No direct equivalent.                                          |
| `tileProps` object      | Top-level props + `slotProps` | Structural change       | Consumers must unwrap the nested bag.                          |

### New V2-only props

- `thumbnailBottomLeft`: New overlay slot in the lower-left thumbnail corner.
- `slotProps`: New `BaseCard` slot styling API.

### Behavior changes

- `contextMenuContent` no longer renders as the legacy visible kebab/menu affordance. In V2 it is passed into `BaseCard`'s context menu and opens on right-click.
- `children` now renders after `fineprint` inside the `BaseCard` info section instead of the legacy `Tile.ContentArea` layout.
- When `disabled` is true, `BaseCard` suppresses title click, context menu, and double-click handlers.

## Shared migration themes

- Expect a styling migration from `@itwin/itwinui-react` `Tile` primitives to `@mui/material` plus `@stratakit/mui`.
- Expect tests and stories to change from nested `tileProps` fixtures to flattened V2 props.
- Expect any code depending on a visible more-options button to be updated, since V2 currently exposes the menu through right-click behavior instead.

## Known workarounds

- **`render={undefined}` on Stratakit `Icon`**: This project uses TypeScript ~4.x. TS 4 loses the optional modifier (`?`) on Ariakit's `render` prop when it passes through `Pick<RoleProps, "render">` in intersection types. TS 5 fixes this. Until we upgrade, pass `render={undefined}` to suppress the false "missing required prop" error. Remove all `render={undefined}` overrides once TS is upgraded to 5+.

## Open questions to track

- Should V2 expose a visible more-options trigger in addition to right-click?
- Do we want a dedicated replacement for legacy `metadata` instead of folding it into `fineprint` or `children`?
- Do we need a replacement for legacy `isNew` and `fullWidth` before V2 is exported publicly?
