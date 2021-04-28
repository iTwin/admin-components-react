/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MOCKED_IMODEL_ID, MockedVersionList } from "../mocks";
import { HttpClient } from "./httpClient";
import { NamedVersionClient } from "./namedVersionClient";

describe("NamedVersionClient", () => {
  const mockHttpGet = jest.spyOn(HttpClient.prototype, "get");
  const namedVersionClient = new NamedVersionClient("token");

  it("should have correct url on get", async () => {
    mockHttpGet.mockResolvedValue(MockedVersionList());

    await namedVersionClient.get(MOCKED_IMODEL_ID);
    expect(
      mockHttpGet
    ).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions/`,
      { headers: { Prefer: "return=representation" } }
    );
  });
});
