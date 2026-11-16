/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  act,
  renderHook as renderHookRtl,
  waitFor as waitForRtl,
} from "@testing-library/react";
import type React from "react";

export { act };

/** Like the legacy helper: the callback may return `false` to keep waiting instead of throwing. */
const waitFor = (callback: () => boolean | void) =>
  waitForRtl(() => {
    if (callback() === false) {
      throw new Error("Timed out waiting for the condition to be met");
    }
  });

/**
 * `renderHook` on top of `@testing-library/react` (which supports React 19), keeping the
 * `waitForNextUpdate`, `waitFor` and `waitForValueToChange` helpers of the legacy
 * `@testing-library/react-hooks` package that the hook tests rely on.
 */
export const renderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: {
    initialProps?: TProps;
    wrapper?: React.JSXElementConstructor<{ children: React.ReactNode }>;
  }
) => {
  let renderCount = 0;
  const all: TResult[] = [];

  const utils = renderHookRtl(
    (props: TProps) => {
      renderCount++;
      const value = callback(props);
      all.push(value);
      return value;
    },
    { initialProps: options?.initialProps as TProps, wrapper: options?.wrapper }
  );

  const waitForNextUpdate = async () => {
    const startCount = renderCount;
    await waitFor(() => {
      if (renderCount === startCount) {
        throw new Error("Timed out waiting for the next hook update");
      }
    });
  };

  const waitForValueToChange = async (selector: () => unknown) => {
    const initial = selector();
    await waitFor(() => {
      if (Object.is(selector(), initial)) {
        throw new Error("Timed out waiting for the value to change");
      }
    });
  };

  return {
    result: {
      get current() {
        return utils.result.current;
      },
      all,
    },
    rerender: utils.rerender,
    unmount: utils.unmount,
    waitFor,
    waitForNextUpdate,
    waitForValueToChange,
  };
};
