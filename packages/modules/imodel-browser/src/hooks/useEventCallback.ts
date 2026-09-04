/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

/**
 * A function with one identity for the life of the hook that always calls the latest `fn`. Lets a
 * caller pass an inline closure where a stable dependency is needed. The standard `useEffectEvent`
 * polyfill: an insertion effect writes the ref before any layout or passive effect can read it.
 */
export const useEventCallback = <TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult
): ((...args: TArgs) => TResult) => {
  const latestFn = React.useRef(fn);
  React.useInsertionEffect(() => {
    latestFn.current = fn;
  }, [fn]);
  return React.useCallback((...args: TArgs) => latestFn.current(...args), []);
};
