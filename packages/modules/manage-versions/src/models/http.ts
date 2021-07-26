/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export enum HttpHeaderNames {
  Authorization = "Authorization",
  ContentType = "Content-Type",
  Prefer = "Prefer",
}

export type ApimCodes = "NamedVersionExists" | "InsufficientPermissions";

export class ApimError extends Error {
  public statusCode: number | undefined;
  public code: ApimCodes | undefined;

  constructor(
    error?: { code: ApimCodes; message: string },

    statusCode?: number
  ) {
    super(error?.message);
    this.code = error?.code;
    this.statusCode = statusCode;
  }
}
