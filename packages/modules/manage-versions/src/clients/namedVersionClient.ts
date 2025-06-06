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
    return this._http
      .get(
        `${UrlBuilder.buildVersionsUrl(
          imodelId,
          undefined,
          this._serverEnvironmentPrefix
        )}${UrlBuilder.getQuery({
          orderBy: "changesetIndex+desc",
          ...requestOptions,
        })}`,
        {
          headers: {
            [HttpHeaderNames.Prefer]: "return=representation",
            [HttpHeaderNames.Accept]:
              "application/vnd.bentley.itwin-platform.v2+json",
          },
        }
      )
      .then((resp) => resp.namedVersions);
  }

  public async create(
    imodelId: string,
    version: { name: string; description: string; changeSetId: string }
  ): Promise<NamedVersion> {
    return this._http
      .post(
        UrlBuilder.buildVersionsUrl(
          imodelId,
          undefined,
          this._serverEnvironmentPrefix
        ),
        version
      )
      .then((resp) => resp.namedVersion);
  }

  public async update(
    imodelId: string,
    versionId: string,
    version: { name: string; description: string }
  ): Promise<NamedVersion> {
    return this._http
      .patch(
        UrlBuilder.buildVersionsUrl(
          imodelId,
          versionId,
          this._serverEnvironmentPrefix
        ),
        version
      )
      .then((resp) => resp.namedVersion);
  }
}
