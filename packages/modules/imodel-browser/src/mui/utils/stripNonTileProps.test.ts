/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { stripNonTileProps } from "./stripNonTileProps";

describe("stripNonTileProps", () => {
  it("removes gridProps, useTileState, and tileProps while preserving everything else", () => {
    const input = {
      id: "1",
      title: "Tile",
      onClick: () => undefined,
      gridProps: { foo: "bar" },
      useTileState: () => ({}),
      tileProps: { className: "x" },
    };

    const result = stripNonTileProps(input);

    expect(result).toEqual({
      id: "1",
      title: "Tile",
      onClick: input.onClick,
    });
    expect(result).not.toHaveProperty("gridProps");
    expect(result).not.toHaveProperty("useTileState");
    expect(result).not.toHaveProperty("tileProps");
  });

  it("returns a new object without mutating the source", () => {
    const input = { keep: 1, gridProps: { foo: "bar" } };

    const result = stripNonTileProps(input);

    expect(result).not.toBe(input);
    expect(input).toHaveProperty("gridProps");
  });

  it("is a no-op when none of the stripped keys are present", () => {
    const input = { a: 1, b: "two" };

    expect(stripNonTileProps(input)).toEqual(input);
  });
});
