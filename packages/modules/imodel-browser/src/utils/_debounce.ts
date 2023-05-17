/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Debounce function
 * @private
 */
export const debounce = (func: any, delay = 500) => {
  let timeout: any;
  return (value: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(value);
    }, delay);
  };
};
