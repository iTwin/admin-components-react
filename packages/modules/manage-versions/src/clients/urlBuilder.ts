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
    afterIndex?: number;
    $search?: string;
    name?: string;
  }) => {
    const query = Object.entries(params)
      .filter(
        ([key, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => {
        if (key === "lastIndex" || key === "afterIndex") {
          return `${key}=${value}`;
        } else if (key === "orderBy") {
          // Replace + with space before encoding
          const orderByValue = (value as string).replace(/\+/g, " ");
          return `$orderBy=${encodeURIComponent(orderByValue)}`;
        } else if (key === "skip") {
          return `$skip=${value}`;
        } else if (key === "top") {
          return `$top=${value}`;
        } else if (key === "name") {
          return `name=${encodeURIComponent(value as string)}`;
        } else {
          return `${key}=${value}`;
        }
      })
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
