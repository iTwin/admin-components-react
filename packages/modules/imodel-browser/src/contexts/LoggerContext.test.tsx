/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render } from "@testing-library/react";
import React from "react";

import { Logger } from "../types";
import { LoggerProvider, useLogger } from "./LoggerContext";

describe("LoggerProvider", () => {
  it("keeps the logger reference stable across rerenders", () => {
    const loggerReferences: Logger[] = [];

    const Consumer = () => {
      const logger = useLogger();

      React.useEffect(() => {
        loggerReferences.push(logger);
      });

      return null;
    };

    const { rerender } = render(
      <LoggerProvider
        logger={{
          logError: jest.fn(),
          logWarning: jest.fn(),
          logInfo: jest.fn(),
          logTrace: jest.fn(),
        }}
      >
        <Consumer />
      </LoggerProvider>
    );

    rerender(
      <LoggerProvider
        logger={{
          logError: jest.fn(),
          logWarning: jest.fn(),
          logInfo: jest.fn(),
          logTrace: jest.fn(),
        }}
      >
        <Consumer />
      </LoggerProvider>
    );

    expect(loggerReferences).toHaveLength(2);
    expect(loggerReferences[0]).toBe(loggerReferences[1]);
  });

  it("forwards calls to the latest logger implementation", () => {
    const firstLogError = jest.fn();
    const secondLogError = jest.fn();
    const triggerRef: { current?: () => void } = {};

    const Consumer = () => {
      const logger = useLogger();

      triggerRef.current = () => {
        logger.logError("Failed", new Error("boom"));
      };

      return null;
    };

    const { rerender } = render(
      <LoggerProvider
        logger={{
          logError: firstLogError,
          logWarning: jest.fn(),
          logInfo: jest.fn(),
          logTrace: jest.fn(),
        }}
      >
        <Consumer />
      </LoggerProvider>
    );

    rerender(
      <LoggerProvider
        logger={{
          logError: secondLogError,
          logWarning: jest.fn(),
          logInfo: jest.fn(),
          logTrace: jest.fn(),
        }}
      >
        <Consumer />
      </LoggerProvider>
    );

    triggerRef.current?.();

    expect(firstLogError).not.toHaveBeenCalled();
    expect(secondLogError).toHaveBeenCalledTimes(1);
    expect(secondLogError).toHaveBeenCalledWith("Failed", expect.any(Error));
  });
});
