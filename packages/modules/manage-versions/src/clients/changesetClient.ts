/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LogFunc } from "../components/ManageVersions/types";
import { Changeset, HttpHeaderNames, User } from "../models";
import { RequestOptions } from "../models/requestOptions";
import { HttpClient } from "./httpClient";
import { UrlBuilder } from "./urlBuilder";

export class ChangesetClient {
  private _http: HttpClient;
  private _serverEnvironmentPrefix: string | undefined;

  constructor(token: string, serverEnvironmentPrefix?: string, log?: LogFunc) {
    this._http = new HttpClient(token, log);
    this._serverEnvironmentPrefix = serverEnvironmentPrefix;
  }

  public async get(
    imodelId: string,
    requestOptions: RequestOptions = {}
  ): Promise<Changeset[]> {
    return this._http
      .get(
        `${UrlBuilder.buildChangesetUrl(
          imodelId,
          this._serverEnvironmentPrefix
        )}${UrlBuilder.getQuery({ orderBy: "index+desc", ...requestOptions })}`,
        {
          headers: {
            [HttpHeaderNames.Prefer]: "return=representation",
            [HttpHeaderNames.Accept]:
              "application/vnd.bentley.itwin-platform.v2+json",
          },
        }
      )
      .then((resp) => resp.changesets);
  }

  public async getUsers(imodelId: string): Promise<User[]> {
    return this._http
      .get(
        `${UrlBuilder.buildGetUsersUrl(
          imodelId,
          this._serverEnvironmentPrefix
        )}`,
        {
          headers: {
            [HttpHeaderNames.Prefer]: "return=representation",
            [HttpHeaderNames.Accept]:
              "application/vnd.bentley.itwin-platform.v2+json",
          },
        }
      )
      .then((resp) => resp.users);
  }
}
