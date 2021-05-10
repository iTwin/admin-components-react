/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { CreateIModel } from "./CreateIModel";

describe("CreateIModel", () => {
  const mockedimodel = { iModel: { id: "dd", name: "name" } };
  const fetchMock = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockedimodel),
    } as Response)
  );
  global.fetch = fetchMock;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an iModel", async () => {
    const successMock = jest.fn();
    toaster.positive = jest.fn();

    const { getByText, container } = render(
      <CreateIModel
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onSuccess={successMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
      />
    );

    const name = container.querySelector(
      "input[name=name]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const createButton = getByText("Create");
    await act(async () => createButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels",
      {
        method: "POST",
        headers: { Authorization: "dd" },
        body: JSON.stringify({
          iModel: {
            projectId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
            name: "Some name",
            description: "",
          },
        }),
      }
    );
    expect(successMock).toHaveBeenCalledWith(mockedimodel);
    expect(toaster.positive).toHaveBeenCalledWith(
      "iModel created successfully.",
      {
        hasCloseButton: true,
      }
    );
  });

  it("should show general error", async () => {
    const errorMock = jest.fn();
    const error = new Error("Fail");
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    toaster.negative = jest.fn();

    const { getByText, container } = render(
      <CreateIModel
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onError={errorMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
      />
    );

    const name = container.querySelector(
      "input[name=name]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const createButton = getByText("Create");
    await act(async () => createButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels",
      {
        method: "POST",
        headers: { Authorization: "dd" },
        body: JSON.stringify({
          iModel: {
            projectId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
            name: "Some name",
            description: "",
          },
        }),
      }
    );
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(
      toaster.negative
    ).toHaveBeenCalledWith(
      "Could not create an iModel. Please try again later.",
      { hasCloseButton: true }
    );
  });

  it("should show imodel already exists error", async () => {
    const errorMock = jest.fn();
    const error = { error: { code: "iModelExists" } };
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    toaster.negative = jest.fn();

    const { getByText, container } = render(
      <CreateIModel
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onError={errorMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
      />
    );

    const name = container.querySelector(
      "input[name=name]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const createButton = getByText("Create");
    await act(async () => createButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels",
      {
        method: "POST",
        headers: { Authorization: "dd" },
        body: JSON.stringify({
          iModel: {
            projectId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
            name: "Some name",
            description: "",
          },
        }),
      }
    );
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(
      toaster.negative
    ).toHaveBeenCalledWith(
      "iModel with the same name already exists within the project.",
      { hasCloseButton: true }
    );
  });
});
