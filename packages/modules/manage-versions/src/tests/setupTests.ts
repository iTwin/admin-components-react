/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

// Constants for mock element dimensions
const MOCK_ELEMENT_HEIGHT = 400;
const MOCK_ELEMENT_WIDTH = 800;

/**
 * Mock ResizeObserver API for JSDOM test environment.
 * The ResizeObserver API is required by virtualized tables to detect container size changes.
 * JSDOM doesn't implement this API, so we provide a minimal mock implementation.
 */
/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
/* eslint-enable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverMock as any;
}

/**
 * Mock HTMLElement dimension properties for virtualization support.
 * Virtualized tables need non-zero element dimensions to calculate which rows are visible.
 * JSDOM returns 0 for all dimension properties by default.
 */
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
  configurable: true,
  get() {
    return MOCK_ELEMENT_HEIGHT;
  },
});

Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
  configurable: true,
  get() {
    return MOCK_ELEMENT_WIDTH;
  },
});

/**
 * Mock scrollTo method if not available.
 * Required by virtualized scrolling behavior.
 */
if (!HTMLElement.prototype.scrollTo) {
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  HTMLElement.prototype.scrollTo = (): void => {};
}

/**
 * Mock getBoundingClientRect to return realistic dimensions.
 * Virtualized components use this to determine viewport and element positions.
 */
const originalGetBoundingClientRect =
  HTMLElement.prototype.getBoundingClientRect;

HTMLElement.prototype.getBoundingClientRect = function (): DOMRect {
  const original = originalGetBoundingClientRect.call(this);
  return {
    ...original,
    width: MOCK_ELEMENT_WIDTH,
    height: MOCK_ELEMENT_HEIGHT,
    top: 0,
    left: 0,
    bottom: MOCK_ELEMENT_HEIGHT,
    right: MOCK_ELEMENT_WIDTH,
  };
};
