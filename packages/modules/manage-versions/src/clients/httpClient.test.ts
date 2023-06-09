/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MockedVersion, MockedVersionList } from "../mocks";
import { ApimError, HttpHeaderNames } from "../models";
import { NamedVersion } from "../models/namedVersion";
import { HttpClient } from "./httpClient";

describe("HttpClient", () => {
  const mockLog = jest.fn();
  const http = new HttpClient("token", mockLog);
  const originalFetch = window.fetch;
  const fetchMock = jest.fn();
  window.fetch = fetchMock;

  function mockFetch(isOk: boolean, responseBody: any) {
    fetchMock.mockResolvedValue({
      ok: isOk,
      json: () => Promise.resolve(responseBody),
    } as Response);
  }

  async function assertFailure() {
    return http
      .get<NamedVersion[]>("https://someApiUrl.com")
      .then(() => fail())
      .catch((error) => {
        expect(mockLog).toHaveBeenCalledWith(
          `@itwin/manage-versions-react - ${error.message}`,
          {
            error,
            request: {
              method: "GET",
              url: "https://someApiUrl.com",
              headers: {
                [HttpHeaderNames.ContentType]: "application/json",
                [HttpHeaderNames.Accept]:
                  "application/vnd.bentley.itwin-platform.v2+json",
              },
            },
          }
        );
      });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.fetch = originalFetch;
  });

  it("should have correct request parameters on get without options", async () => {
    mockFetch(true, { instances: MockedVersionList() });

    const versions = await http.get<NamedVersion[]>("https://someApiUrl.com");

    expect(versions).toEqual({ instances: MockedVersionList() });
    expect(fetchMock).toHaveBeenCalledWith("https://someApiUrl.com", {
      method: "GET",
      headers: expect.objectContaining({
        [HttpHeaderNames.Authorization]: "token",
        [HttpHeaderNames.ContentType]: "application/json",
      }),
    });
  });

  it("should have correct request parameters on get with options", async () => {
    mockFetch(true, { instances: MockedVersionList() });

    const versions = await http.get<NamedVersion[]>("https://someApiUrl.com", {
      headers: {
        customHeader: "test",
        [HttpHeaderNames.ContentType]: "text/plain",
      },
    });

    expect(versions).toEqual({ instances: MockedVersionList() });
    expect(fetchMock).toHaveBeenCalledWith("https://someApiUrl.com", {
      method: "GET",
      headers: expect.objectContaining({
        [HttpHeaderNames.Authorization]: "token",
        [HttpHeaderNames.ContentType]: "text/plain",
        customHeader: "test",
      }),
    });
  });

  it("should have correct request parameters on post without options", async () => {
    mockFetch(true, { changedInstance: MockedVersion() });

    const versions = await http.post<NamedVersion>("https://someApiUrl.com", {
      instance: MockedVersion(),
    });

    expect(versions).toEqual({ changedInstance: MockedVersion() });
    expect(fetchMock).toHaveBeenCalledWith("https://someApiUrl.com", {
      method: "POST",
      headers: expect.objectContaining({
        [HttpHeaderNames.Authorization]: "token",
        [HttpHeaderNames.ContentType]: "application/json",
      }),
      body: JSON.stringify({ instance: MockedVersion() }),
    });
  });

  it("should have correct request parameters on patch without options", async () => {
    mockFetch(true, { changedInstance: MockedVersion() });

    const versions = await http.patch<NamedVersion>("https://someApiUrl.com", {
      instance: MockedVersion(),
    });

    expect(versions).toEqual({ changedInstance: MockedVersion() });
    expect(fetchMock).toHaveBeenCalledWith("https://someApiUrl.com", {
      method: "PATCH",
      headers: expect.objectContaining({
        [HttpHeaderNames.Authorization]: "token",
        [HttpHeaderNames.ContentType]: "application/json",
      }),
      body: JSON.stringify({ instance: MockedVersion() }),
    });
  });

  it("should have correct request parameters on delete without options", async () => {
    mockFetch(true, { changedInstance: MockedVersion() });

    const versions = await http.delete<NamedVersion>("https://someApiUrl.com");

    expect(versions).toEqual({ changedInstance: MockedVersion() });
    expect(fetchMock).toHaveBeenCalledWith("https://someApiUrl.com", {
      method: "DELETE",
      headers: expect.objectContaining({
        [HttpHeaderNames.Authorization]: "token",
        [HttpHeaderNames.ContentType]: "application/json",
      }),
    });
  });

  it("should log and throw when fetch fails", async () => {
    fetchMock.mockRejectedValue(new Error("error"));

    return assertFailure();
  });

  it("should log and throw when response is not ok", async () => {
    mockFetch(false, {
      error: new ApimError({
        code: "InsufficientPermissions",
        message: "error",
      }),
    });

    return assertFailure();
  });
});
