/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { waitForOptions } from "@testing-library/react";
import {
  act,
  renderHook as renderHookRtl,
  waitFor as waitForRtl,
} from "@testing-library/react";
import type React from "react";

export { act };

/** Like the legacy `waitFor`: the callback may return `false` to keep waiting instead of throwing. */
const waitForCondition = (
  callback: () => boolean | void,
  options?: waitForOptions
) =>
  waitForRtl(() => {
    if (callback() === false) {
      throw new Error("Timed out waiting for the condition to be met");
    }
  }, options);

const waitForChange = <T>(
  read: () => T,
  message: string,
  options?: waitForOptions
) => {
  const initial = read();
  return waitForRtl(() => {
    if (Object.is(read(), initial)) {
      throw new Error(message);
    }
  }, options);
};

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

  const utils = renderHookRtl((props: TProps) => {
    renderCount++;
    const value = callback(props);
    all.push(value);
    return value;
  }, options);

  const waitForNextUpdate = (options?: waitForOptions) =>
    waitForChange(
      () => renderCount,
      "Timed out waiting for the next hook update",
      options
    );

  const waitForValueToChange = (
    selector: () => unknown,
    options?: waitForOptions
  ) =>
    waitForChange(
      selector,
      "Timed out waiting for the value to change",
      options
    );

  return {
    result: {
      get current() {
        return utils.result.current;
      },
      all,
    },
    rerender: utils.rerender,
    unmount: utils.unmount,
    waitFor: waitForCondition,
    waitForNextUpdate,
    waitForValueToChange,
  };
};
