/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MOCKED_IMODEL_ID, MockedChangesetList } from "../mocks";
import { ChangesetClient } from "./changesetClient";
import { HttpClient } from "./httpClient";

describe("ChangesetClient", () => {
  const mockHttpGet = jest.spyOn(HttpClient.prototype, "get");
  const changesetClient = new ChangesetClient("token");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have correct url on get", async () => {
    mockHttpGet.mockResolvedValue({ changesets: MockedChangesetList() });

    await changesetClient.get(MOCKED_IMODEL_ID);
    expect(
      mockHttpGet
    ).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/changesets`,
      { headers: { Prefer: "return=representation" } }
    );
  });

  it("should have correct url on get with request options", async () => {
    mockHttpGet.mockResolvedValue({ changesets: MockedChangesetList() });

    await changesetClient.get(MOCKED_IMODEL_ID, { top: 10, skip: 20 });
    expect(
      mockHttpGet
    ).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/changesets?$top=10&$skip=20`,
      { headers: { Prefer: "return=representation" } }
    );
  });
});
