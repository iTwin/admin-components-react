/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export class UrlBuilder {
  public static getQuery = (params: { skip?: number; top?: number }) => {
    const query = Object.entries(params)
      .filter(([key, value]) => !!value)
      .map(([key, value]) => `$${key}=${value}`)
      .join("&");
    return query ? `?${query}` : "";
  };

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
    )}/imodels/${imodelId}/namedversions`;
  }

  public static buildChangesetUrl(
    imodelId: string,
    serverEnvironmentPrefix?: string
  ) {
    return `${this.getBaseUrl(
      serverEnvironmentPrefix
    )}/imodels/${imodelId}/changesets`;
  }
}
