/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export class UrlBuilder {
  private static getBaseUrl(serverEnvironmentPrefix?: string) {
    return `https://${
      serverEnvironmentPrefix ? `${serverEnvironmentPrefix}-` : ""
    }api.bentley.com`;
  }

  public static buildVersionsUrl(
    imodelId: string,
    serverEnvironmentPrefix?: string
  ) {
    return `${this.getBaseUrl(
      serverEnvironmentPrefix
    )}/imodels/${imodelId}/namedversions/`;
  }

  public static buildChangesetUrl(
    imodelId: string,
    serverEnvironmentPrefix?: string
  ) {
    return `${this.getBaseUrl(
      serverEnvironmentPrefix
    )}/imodels/${imodelId}/changesets/`;
  }
}
