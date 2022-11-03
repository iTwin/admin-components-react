/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { IModelContext } from "../context/imodel-context";
import { IModelName } from "./IModelName";

describe("IModelName", () => {
  it("should show input field with value from context API", async () => {
    const { container } = render(
      <IModelContext.Provider
        value={{
          imodel: { name: "Testing", description: "" },
          onPropChange: jest.fn(),
          onImageChange: jest.fn(),
        }}
      >
        <IModelName />
      </IModelContext.Provider>
    );

    const name = container.querySelector("input") as HTMLInputElement;

    expect(name.value).toEqual("Testing");
  });
  it("should call onPropChange when value is changed", async () => {
    const mockFunc = jest.fn();
    const { container } = render(
      <IModelContext.Provider
        value={{
          imodel: { name: "Testing", description: "" },
          onPropChange: mockFunc,
          onImageChange: jest.fn(),
        }}
      >
        <IModelName />
      </IModelContext.Provider>
    );

    const name = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(name, { target: { value: "new" } });
    expect(mockFunc).toHaveBeenCalled();
  });

  it("should show error when value exceeds the max limit", async () => {
    const { getByText } = render(
      <IModelContext.Provider
        value={{
          imodel: { name: new Array(256).join("a"), description: "" },
          onPropChange: jest.fn(),
          onImageChange: jest.fn(),
        }}
      >
        <IModelName message="Name too long." />
      </IModelContext.Provider>
    );

    expect(getByText("Name too long.")).toBeTruthy();
  });
});
