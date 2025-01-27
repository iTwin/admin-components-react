/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useToaster } from "@itwin/itwinui-react";
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
    useToaster().positive = jest.fn();

    const { getByText, container } = render(
      <CreateIModel
        accessToken="dd"
        iTwinId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
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
        headers: {
          Authorization: "dd",
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iTwinId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
          name: "Some name",
          description: "",
        }),
      }
    );
    expect(successMock).toHaveBeenCalledWith(mockedimodel);
    expect(useToaster().positive).toHaveBeenCalledWith(
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
    useToaster().negative = jest.fn();

    const { getByText, container } = render(
      <CreateIModel
        accessToken="dd"
        iTwinId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onError={errorMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
      />
    );

    const inputs = container.querySelectorAll<HTMLInputElement>(
      ".iac-inputs-container input"
    );
    fireEvent.change(inputs[0], { target: { value: "Some name" } });
    fireEvent.change(inputs[1], { target: { value: "1" } });
    fireEvent.change(inputs[2], { target: { value: "2" } });
    fireEvent.change(inputs[3], { target: { value: "3" } });
    fireEvent.change(inputs[4], { target: { value: "4" } });

    const createButton = getByText("Create");
    await act(async () => createButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels",
      {
        method: "POST",
        headers: {
          Authorization: "dd",
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iTwinId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
          name: "Some name",
          description: "",
          extent: {
            northEast: { latitude: 3, longitude: 4 },
            southWest: { latitude: 1, longitude: 2 },
          },
        }),
      }
    );
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(useToaster().negative).toHaveBeenCalledWith(
      "Could not create an iModel. Please try again later.",
      { hasCloseButton: true }
    );
  });

  it("should show imodel already exists error", async () => {
    const errorMock = jest.fn();
    const error = { error: { code: "iModelExists" } };
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    useToaster().negative = jest.fn();

    const { getByText, container } = render(
      <CreateIModel
        accessToken="dd"
        iTwinId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
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
        headers: {
          Authorization: "dd",
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iTwinId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
          name: "Some name",
          description: "",
        }),
      }
    );
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(useToaster().negative).toHaveBeenCalledWith(
      "iModel with the same name already exists within the iTwin.",
      { hasCloseButton: true }
    );
  });
});
