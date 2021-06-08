/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MOCKED_IMODEL_ID, MockedVersion, MockedVersionList } from "../mocks";
import { HttpClient } from "./httpClient";
import { NamedVersionClient } from "./namedVersionClient";

describe("NamedVersionClient", () => {
  const mockHttpGet = jest.spyOn(HttpClient.prototype, "get");
  const mockHttpPost = jest.spyOn(HttpClient.prototype, "post");
  const mockHttpPatch = jest.spyOn(HttpClient.prototype, "patch");
  const namedVersionClient = new NamedVersionClient("token");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have correct URL on get", async () => {
    mockHttpGet.mockResolvedValue({ namedVersions: MockedVersionList() });

    await namedVersionClient.get(MOCKED_IMODEL_ID);
    expect(
      mockHttpGet
    ).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions`,
      { headers: { Prefer: "return=representation" } }
    );
  });

  it("should have correct URL on get with query params", async () => {
    mockHttpGet.mockResolvedValue({ namedVersions: MockedVersionList() });

    await namedVersionClient.get(MOCKED_IMODEL_ID, { top: 10, skip: 20 });
    expect(
      mockHttpGet
    ).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions?$skip=20&$top=10`,
      { headers: { Prefer: "return=representation" } }
    );
  });

  it("should have correct URLs on recursive get", async () => {
    mockHttpGet.mockResolvedValueOnce({ namedVersions: MockedVersionList(10) });
    mockHttpGet.mockResolvedValueOnce({ namedVersions: MockedVersionList() });

    const versions = await namedVersionClient.get(MOCKED_IMODEL_ID, {
      top: 10,
    });
    expect(versions.length).toBe(13);
    expect(mockHttpGet).toHaveBeenNthCalledWith(
      1,
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions?$top=10`,
      { headers: { Prefer: "return=representation" } }
    );
    expect(mockHttpGet).toHaveBeenNthCalledWith(
      2,
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions?$skip=10&$top=10`,
      { headers: { Prefer: "return=representation" } }
    );
  });

  it("should have correct URL on create", async () => {
    mockHttpPost.mockResolvedValue({ namedVersion: MockedVersion() });

    await namedVersionClient.create(MOCKED_IMODEL_ID, {
      name: "nv_name1",
      description: "nv_description1",
      changeSetId: "ch1",
    });
    expect(mockHttpPost).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions`,
      {
        name: "nv_name1",
        description: "nv_description1",
        changeSetId: "ch1",
      }
    );
  });

  it("should have correct URL on update", async () => {
    mockHttpPatch.mockResolvedValue({ namedVersion: MockedVersion() });

    await namedVersionClient.update(MOCKED_IMODEL_ID, "nv1", {
      name: "nv_name1",
      description: "nv_description1",
    });
    expect(mockHttpPatch).toHaveBeenCalledWith(
      `https://api.bentley.com/imodels/${MOCKED_IMODEL_ID}/namedversions/nv1`,
      {
        name: "nv_name1",
        description: "nv_description1",
      }
    );
  });
});
