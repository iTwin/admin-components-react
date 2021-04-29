/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { act, render } from "@testing-library/react";
import React from "react";

import { DeleteIModel } from "./DeleteIModel";

describe("DeleteIModel", () => {
  const fetchMock = jest.fn(() => Promise.resolve({ ok: true } as Response));
  global.fetch = fetchMock;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  it("should open delete modal", () => {
    const { getByText } = render(
      <DeleteIModel
        imodel={{ id: "111", name: "test imodel" }}
        accessToken="dd"
      />
    );

    const title = document.querySelector(".iac-delete-title") as HTMLElement;
    expect(title.textContent).toBe(`Delete an iModel 'test imodel'`);
    expect(title.querySelector(".iac-warning-icon")).toBeTruthy();
    getByText(
      "Deleting this iModel will remove access for all users and all data will no longer be available. Are you sure you want to delete this iModel?"
    );
  });

  it("should delete imodel", async () => {
    const successMock = jest.fn();

    const { getByText } = render(
      <DeleteIModel
        imodel={{ id: "111", name: "test imodel" }}
        environment="dev"
        accessToken="dd"
        onSuccess={successMock}
      />
    );

    const button = getByText("Yes") as HTMLButtonElement;
    await act(async () => button.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels/111",
      {
        method: "DELETE",
        headers: { Authorization: "dd" },
      }
    );
    expect(successMock).toHaveBeenCalled();
  });

  it("should return error when failed to delete imodel", async () => {
    const failureMock = jest.fn();
    const error = new Error("Fail");
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    const { getByText } = render(
      <DeleteIModel
        imodel={{ id: "111", name: "test imodel" }}
        accessToken="dd"
        onError={failureMock}
      />
    );

    const button = getByText("Yes") as HTMLButtonElement;
    await act(async () => button.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bentley.com/imodels/111",
      {
        method: "DELETE",
        headers: { Authorization: "dd" },
      }
    );
    expect(failureMock).toHaveBeenCalledWith(error);
  });

  it("should close dialog", () => {
    const closeMock = jest.fn();

    const { getByText } = render(
      <DeleteIModel
        imodel={{ id: "111", name: "test imodel" }}
        accessToken="dd"
        onClose={closeMock}
      />
    );

    const button = getByText("No") as HTMLButtonElement;
    act(() => button.click());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });
});
