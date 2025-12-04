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
    expect(mockHttpGet).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/changesets?$orderBy=index%20desc`,
      {
        headers: {
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
      }
    );
  });

  it("should have correct url on get with request options", async () => {
    mockHttpGet.mockResolvedValue({ changesets: MockedChangesetList() });

    await changesetClient.get(MOCKED_IMODEL_ID, { top: 10, skip: 20 });
    expect(mockHttpGet).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/changesets?$orderBy=index%20desc&$top=10&$skip=20`,
      {
        headers: {
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
      }
    );
  });

  it("should have correct url on getUsers", async () => {
    mockHttpGet.mockResolvedValue({ changesets: MockedChangesetList() });

    await changesetClient.getUsers(MOCKED_IMODEL_ID);
    expect(mockHttpGet).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/users`,
      {
        headers: {
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
      }
    );
  });

  it("should have the correct url and resolve with the checkpoint data on getChangesetCheckpoint", async () => {
    const changesetIndex = 5;
    const mockCheckpoint = {
      changesetIndex: changesetIndex,
      changesetId: "mockChangesetId",
      state: "available",
      containerAccessInfo: {
        account: "mockAccount",
        container: "mockContainer",
        sas: "mockSasToken",
        dbName: "mockDbName",
      },
      _links: {
        download: {
          href: "http://download-link",
        },
      },
    };

    mockHttpGet.mockResolvedValue({ checkpoint: mockCheckpoint });

    const checkpoint = await changesetClient.getChangesetCheckpoint(
      MOCKED_IMODEL_ID,
      changesetIndex
    );
    expect(mockHttpGet).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/changesets/${changesetIndex}/checkpoint`,
      {
        headers: {
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
      }
    );
    expect(checkpoint).toEqual(mockCheckpoint);
  });
});
