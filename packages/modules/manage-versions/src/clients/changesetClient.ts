/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Changeset } from "../models/changeset";
import { HttpHeaderNames } from "../models/http";
import { HttpClient } from "./httpClient";
import { UrlBuilder } from "./urlBuilder";

export class ChangesetClient {
  private _http: HttpClient;
  private _environment: string | undefined;

  constructor(token: string, environment?: string) {
    this._http = new HttpClient(token);
    this._environment = environment;
  }

  public async get(imodelId: string): Promise<Changeset[]> {
    return this._http
      .get(UrlBuilder.buildChangesetUrl(imodelId, this._environment), {
        headers: { [HttpHeaderNames.Prefer]: "return=representation" },
      })
      .then((resp) => resp.changesets);
  }
}
