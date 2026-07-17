/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { Logger } from "../types";

/** Default logger for all components. */
export const defaultLogger: Logger = {
  logError: (message, error) => console.error(message, error),
  logWarning: (message) => console.warn(message),
  logInfo: (message) => console.log(message),
  logTrace: (message) => console.log(message),
};

/** React context that provides a Logger to the component subtree. */
export const LoggerContext = React.createContext<Logger>(defaultLogger);

export interface LoggerProviderProps {
  logger?: Logger;
  children: React.ReactNode;
}

/**
 * Provides logger context, whilst stabilizing logger to prevent rerendering.
 */
export const LoggerProvider = ({ logger, children }: LoggerProviderProps) => {
  const loggerRef = React.useRef<Logger>(logger ?? defaultLogger);
  loggerRef.current = logger ?? defaultLogger;

  const stableLogger = React.useMemo<Logger>(
    () => ({
      logError: (message, error) => loggerRef.current.logError(message, error),
      logWarning: (message) => loggerRef.current.logWarning(message),
      logInfo: (message) => loggerRef.current.logInfo(message),
      logTrace: (message) => loggerRef.current.logTrace(message),
    }),
    []
  );

  return (
    <LoggerContext.Provider value={stableLogger}>
      {children}
    </LoggerContext.Provider>
  );
};

/** Returns the logger from the nearest LoggerContext.Provider, or defaultLogger if none is present. */
export const useLogger = (): Logger => React.useContext(LoggerContext);
