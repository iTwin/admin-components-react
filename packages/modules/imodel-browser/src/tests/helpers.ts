/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export const ids = (withId: { id: string }) => withId.id;

/** A promise settled by the test, for asserting on ordering without relying on timers. */
export const deferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

/** A successful fetch response carrying `body`, with no headers. Ignores the abort signal. */
export const responseFor = (body: unknown) =>
  ({
    ok: true,
    json: async () => body,
    headers: { get: () => null },
  } as unknown as Response);
