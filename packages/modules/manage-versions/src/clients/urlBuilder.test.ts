/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MOCKED_IMODEL_ID } from "../mocks";
import { UrlBuilder } from "./urlBuilder";

describe("UrlBuilder", () => {
  it("should return correct Versions URL", () => {
    expect(UrlBuilder.buildVersionsUrl(MOCKED_IMODEL_ID)).toEqual(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions`
    );
    expect(UrlBuilder.buildVersionsUrl(MOCKED_IMODEL_ID, "dev")).toEqual(
      `https://dev-api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions`
    );
  });

  it("should return correct Changesets URL", () => {
    expect(UrlBuilder.buildChangesetUrl(MOCKED_IMODEL_ID)).toEqual(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/changesets`
    );
    expect(UrlBuilder.buildChangesetUrl(MOCKED_IMODEL_ID, "dev")).toEqual(
      `https://dev-api.bentley.com/imodels/${MOCKED_IMODEL_ID}/changesets`
    );
  });

  it("should return query with given params", () => {
    expect(UrlBuilder.getQuery({ skip: 20, top: 10 })).toEqual(
      "?$skip=20&$top=10"
    );
  });

  it("should return query with given params (one with falsy value)", () => {
    expect(UrlBuilder.getQuery({ skip: 0, top: 10 })).toEqual("?$top=10");
    expect(UrlBuilder.getQuery({ skip: undefined, top: 10 })).toEqual(
      "?$top=10"
    );
    expect(UrlBuilder.getQuery({ top: 10 })).toEqual("?$top=10");
  });

  it("should return empty string when query params are empty", () => {
    expect(UrlBuilder.getQuery({})).toEqual("");
    expect(UrlBuilder.getQuery({ skip: 0, top: 0 })).toEqual("");
    expect(UrlBuilder.getQuery({ skip: undefined, top: undefined })).toEqual(
      ""
    );
  });
});
