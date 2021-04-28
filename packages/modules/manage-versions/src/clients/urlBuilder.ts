/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export class UrlBuilder {
  private static getBaseUrl(environment?: string) {
    return `https://${environment ? `${environment}-` : ""}api.bentley.com`;
  }

  public static buildVersionsUrl(imodelId: string, environment?: string) {
    return `${this.getBaseUrl(environment)}/imodels/${imodelId}/namedversions/`;
  }

  public static buildChangesetUrl(imodelId: string, environment?: string) {
    return `${this.getBaseUrl(environment)}/imodels/${imodelId}/changesets/`;
  }
}
