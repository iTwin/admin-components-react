/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export enum HttpHeaderNames {
  Authorization = "Authorization",
  ContentType = "Content-Type",
  Prefer = "Prefer",
}

export enum HttpStatusCodes {
  Forbidden_403 = 403,
}

export class ApimError extends Error {
  public statusCode: number | undefined;

  constructor(error: any, statusCode?: number) {
    super(error?.message);
    this.statusCode = statusCode ?? error.statusCode;
  }
}
