/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export class UrlBuilder {
  public static getQuery = (params: {
    skip?: number;
    top?: number;
    orderBy?: string;
    lastIndex?: number;
  }) => {
    const query = Object.entries(params)
      .filter(([key, value]) => !!value)
      .map(([key, value]) =>
        key === "lastIndex" ? `${key}=${value}` : `$${key}=${value}`
      )
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
    versionId?: string,
    serverEnvironmentPrefix?: string
  ) {
    return `${this.getBaseUrl(
      serverEnvironmentPrefix
    )}/imodels/${imodelId}/namedversions${versionId ? `/${versionId}` : ""}`;
  }

  public static buildChangesetUrl(
    imodelId: string,
    serverEnvironmentPrefix?: string
  ) {
    return `${this.getBaseUrl(
      serverEnvironmentPrefix
    )}/imodels/${imodelId}/changesets`;
  }

  public static buildGetUsersUrl(
    imodelId: string,
    serverEnvironmentPrefix?: string
  ) {
    return `${this.getBaseUrl(
      serverEnvironmentPrefix
    )}/imodels/${imodelId}/users`;
  }
}
