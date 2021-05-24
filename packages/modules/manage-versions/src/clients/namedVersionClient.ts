/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LogFunc } from "../components/ManageVersions/types";
import { HttpHeaderNames, NamedVersion } from "../models";
import { RequestOptions } from "../models/requestOptions";
import { HttpClient } from "./httpClient";
import { UrlBuilder } from "./urlBuilder";

export class NamedVersionClient {
  private _http: HttpClient;
  private _serverEnvironmentPrefix: string | undefined;

  constructor(token: string, serverEnvironmentPrefix?: string, log?: LogFunc) {
    this._http = new HttpClient(token, log);
    this._serverEnvironmentPrefix = serverEnvironmentPrefix;
  }

  public async get(
    imodelId: string,
    requestOptions: RequestOptions = {}
  ): Promise<NamedVersion[]> {
    const { skip = 0, top } = requestOptions;
    return this._http
      .get(
        `${UrlBuilder.buildVersionsUrl(
          imodelId,
          this._serverEnvironmentPrefix
        )}${UrlBuilder.getQuery({ skip, top })}`,
        {
          headers: { [HttpHeaderNames.Prefer]: "return=representation" },
        }
      )
      .then((resp) => resp.namedVersions as NamedVersion[])
      .then(async (namedVersions) => {
        // Recursively load all Named Versions
        const versionCount = namedVersions.length;
        if (versionCount === top) {
          return [
            ...namedVersions,
            ...(await this.get(imodelId, {
              skip: skip + versionCount,
              top,
            })),
          ];
        }
        return namedVersions;
      });
  }
}
