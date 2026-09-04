/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";

import { useReportChanges } from "./useReportChanges";

describe("useReportChanges", () => {
  interface Props {
    value: string | undefined;
    report: (value: string | undefined) => void;
  }

  const renderWith = (initialProps: Props) =>
    renderHook<Props, void>(
      ({ value, report }) => useReportChanges(value, report),
      { initialProps }
    );

  it("reports the first value", () => {
    const report = jest.fn();

    renderWith({ value: "first", report });

    expect(report).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenCalledWith("first");
  });

  it("reports an initial undefined value", () => {
    const report = jest.fn();

    renderWith({ value: undefined, report });

    expect(report).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenCalledWith(undefined);
  });

  it("does not report the same value again when only the reporter changed", () => {
    const report = jest.fn();
    const { rerender } = renderWith({ value: "same", report });

    rerender({ value: "same", report: (value) => report(value) });
    rerender({ value: "same", report });

    expect(report).toHaveBeenCalledTimes(1);
  });

  it("reports a new value once, through the latest reporter", () => {
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = renderWith({ value: "one", report: first });

    rerender({ value: "two", report: second });

    expect(first).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledWith("one");
    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith("two");
  });

  it("reports a value that comes back, because only the last one is remembered", () => {
    const report = jest.fn();
    const { rerender } = renderWith({ value: "one", report });

    rerender({ value: "two", report });
    rerender({ value: "one", report });

    expect(report).toHaveBeenCalledTimes(3);
  });
});
