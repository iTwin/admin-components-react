/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/**
 * Strip props that may be passed to useIndividualState hooks but should not be
 * forwarded to a tile/card component.
 */
export const stripNonTileProps = <T extends object>(
  source: T
): Omit<T, "gridProps" | "useTileState" | "tileProps"> => {
  const {
    gridProps: _gridProps,
    useTileState: _useTileState,
    tileProps: _tileProps,
    ...stripped
  } = source as T & {
    gridProps?: unknown;
    useTileState?: unknown;
    tileProps?: unknown;
  };
  return stripped;
};
