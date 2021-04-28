/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LogFunc } from "../components/ManageVersions/types";
import { ApimError, HttpHeaderNames } from "../models/http";

export interface HttpRequestOptions {
  headers?: { [key: string]: string };
  abortController?: AbortController;
}

export interface HttpRequest {
  url: string;
  body?: any;
  headers: { [key: string]: string };
  method: string;
  signal?: AbortSignal;
}

export class HttpClient {
  private _token: string;
  private _log: LogFunc | undefined;
  private readonly _errorMessagePrefix = "@itwin/manage-versions";
  private readonly _defaultErrorMessage = "HTTP error without a message.";

  constructor(token: string, log?: LogFunc) {
    this._token = token;
    this._log = log;
  }

  public async get<T = any>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<T> {
    const requestData: HttpRequest = {
      method: "GET",
      url: url,
      headers: { ...options?.headers },
      signal: options?.abortController?.signal,
    };
    return this.makeRequest<T>(requestData);
  }

  public async post<T = any>(
    url: string,
    body: any,
    options?: HttpRequestOptions
  ): Promise<T> {
    const requestData: HttpRequest = {
      method: "POST",
      url: url,
      headers: { ...options?.headers },
      body: body,
      signal: options?.abortController?.signal,
    };
    return this.makeRequest<T>(requestData);
  }

  public async delete<T>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<T> {
    const requestData: HttpRequest = {
      method: "DELETE",
      url: url,
      headers: { ...options?.headers },
      signal: options?.abortController?.signal,
    };
    return this.makeRequest<T>(requestData);
  }

  private async makeRequest<T>(request: HttpRequest): Promise<T> {
    this.prepareHeaders(request);
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
        signal: request?.signal,
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new ApimError(responseBody, response.status);
      }

      return responseBody;
    } catch (error) {
      this.logError(error, request);
      throw error;
    }
  }

  private prepareHeaders(request: HttpRequest): void {
    request.headers = {
      [HttpHeaderNames.Authorization]: this._token,
      [HttpHeaderNames.ContentType]: "application/json",
      ...request.headers,
    };
  }

  private logError(error: any, request: HttpRequest) {
    this._log?.(
      `${this._errorMessagePrefix} - ${
        error.message || this._defaultErrorMessage
      }`,
      {
        request: this.getRequestToLog(request),
        error,
      }
    );
  }

  private getRequestToLog(request: HttpRequest) {
    const headers = { ...request.headers };
    delete headers[HttpHeaderNames.Authorization];

    return {
      headers: headers,
      url: request.url,
      method: request.method,
    };
  }
}
