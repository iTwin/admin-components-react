/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { iModelExtent } from "../..";
import { UpdateIModel } from "./UpdateIModel";

describe("UpdateIModel", () => {
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

  it("should update an iModel", async () => {
    const successMock = jest.fn();
    toaster.positive = jest.fn();

    const { getByText, container } = render(
      <UpdateIModel
        accessToken="dd"
        imodelId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onSuccess={successMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
        initialIModel={{
          name: "Initial name",
          description: "Initial description",
          extent: {
            southWest: { latitude: 1, longitude: 2 },
            northEast: { latitude: 3, longitude: 4 },
          },
        }}
      />
    );

    const name = container.querySelector(
      "input[name=name]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some other name" } });

    const updateButton = getByText("Update");
    await act(async () => updateButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels/de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      {
        method: "PATCH",
        headers: {
          Authorization: "dd",
          Prefer: "return=representation",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Some other name",
          description: "Initial description",
          extent: {
            southWest: { latitude: 1, longitude: 2 },
            northEast: { latitude: 3, longitude: 4 },
          },
        }),
      }
    );
    expect(successMock).toHaveBeenCalledWith(mockedimodel);
    expect(toaster.positive).toHaveBeenCalledWith(
      "iModel updated successfully.",
      {
        hasCloseButton: true,
      }
    );
  });

  it("should enable update when extent is removed", async () => {
    const successMock = jest.fn();
    toaster.positive = jest.fn();

    const { getByText, rerender } = render(
      <UpdateIModel
        accessToken="dd"
        imodelId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onSuccess={successMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
        initialIModel={{
          name: "Initial name",
          description: "Initial description",
          extent: {
            southWest: { latitude: 1, longitude: 2 },
            northEast: { latitude: 3, longitude: 4 },
          },
        }}
      />
    );

    const updateButton = getByText("Update");
    expect(updateButton.closest("button")?.hasAttribute("disabled")).toBe(true);

    rerender(
      <UpdateIModel
        accessToken="dd"
        imodelId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onSuccess={successMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
        initialIModel={{
          name: "Initial name",
          description: "Initial description",
          extent: {
            southWest: { latitude: 1, longitude: 2 },
            northEast: { latitude: 3, longitude: 4 },
          },
        }}
        extent={(null as unknown) as iModelExtent}
      />
    );
    expect(updateButton.closest("button")?.hasAttribute("disabled")).toBe(
      false
    );
    await act(async () => updateButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels/de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      {
        method: "PATCH",
        headers: {
          Authorization: "dd",
          Prefer: "return=representation",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Initial name",
          description: "Initial description",
          extent: null,
        }),
      }
    );
    expect(successMock).toHaveBeenCalledWith(mockedimodel);
    expect(toaster.positive).toHaveBeenCalledWith(
      "iModel updated successfully.",
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
      <UpdateIModel
        accessToken="dd"
        imodelId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onError={errorMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
        initialIModel={{
          name: "Initial name",
          description: "Initial description",
        }}
      />
    );

    const name = container.querySelector(
      "input[name=name]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const updateButton = getByText("Update");
    await act(async () => updateButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels/de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      {
        method: "PATCH",
        headers: {
          Authorization: "dd",
          Prefer: "return=representation",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Some name",
          description: "Initial description",
        }),
      }
    );
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(
      toaster.negative
    ).toHaveBeenCalledWith(
      "Could not update an iModel. Please try again later.",
      { hasCloseButton: true }
    );
  });

  it("should show imodel already exists error", async () => {
    const errorMock = jest.fn();
    const error = { error: { code: "iModelExists" } };
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    toaster.negative = jest.fn();

    const { getByText, container } = render(
      <UpdateIModel
        accessToken="dd"
        imodelId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onError={errorMock}
        apiOverrides={{ serverEnvironmentPrefix: "dev" }}
        initialIModel={{
          name: "Initial name",
          description: "Initial description",
        }}
      />
    );

    const name = container.querySelector(
      "input[name=name]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const updateButton = getByText("Update");
    await act(async () => updateButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dev-api.bentley.com/imodels/de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      {
        method: "PATCH",
        headers: {
          Authorization: "dd",
          Prefer: "return=representation",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Some name",
          description: "Initial description",
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
