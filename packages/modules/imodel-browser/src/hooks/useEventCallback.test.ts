/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";

import { useEventCallback } from "./useEventCallback";

describe("useEventCallback", () => {
  const renderWith = (fn: (value: string) => string) =>
    renderHook<{ fn: (value: string) => string }, (value: string) => string>(
      ({ fn: current }) => useEventCallback(current),
      { initialProps: { fn } }
    );

  it("keeps one identity across renders", () => {
    const { result, rerender } = renderWith(() => "first");
    const stable = result.current;

    rerender({ fn: () => "second" });

    expect(result.current).toBe(stable);
  });

  it("calls the latest function", () => {
    const { result, rerender } = renderWith(() => "first");
    expect(result.current("ignored")).toEqual("first");

    rerender({ fn: () => "second" });

    expect(result.current("ignored")).toEqual("second");
  });

  it("forwards the arguments", () => {
    const { result } = renderWith((value) => `got ${value}`);

    expect(result.current("payload")).toEqual("got payload");
  });
});
