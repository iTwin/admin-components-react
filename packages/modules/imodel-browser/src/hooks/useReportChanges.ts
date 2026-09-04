/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

/**
 * Calls `report(value)` once per distinct value, the first one included. Only this effect writes
 * the ref, so `report` can stay a dependency without re-reporting and without a ref-sync effect.
 */
export const useReportChanges = <TValue>(
  value: TValue,
  report: (value: TValue) => void
) => {
  const lastReported = React.useRef<{ value: TValue } | undefined>(undefined);
  React.useEffect(() => {
    const alreadyReported =
      lastReported.current !== undefined &&
      Object.is(lastReported.current.value, value);
    if (alreadyReported) {
      return;
    }
    lastReported.current = { value };
    report(value);
  }, [value, report]);
};
