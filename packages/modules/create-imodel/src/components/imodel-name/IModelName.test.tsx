/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { IModelContext } from "../context/imodel-context";
import { IModelName } from "./IModelName";

const mockFunc = jest.fn();
const contextValue = {
  imodel: { name: "Testing", description: "" },
  onPropChange: mockFunc,
  onImageChange: mockFunc,
  nameString: "name",
  nameTooLong: "The value exceeds allowed 255 characters.",
  descriptionString: "Description",
  descriptionTooLong: "The value exceeds allowed 255 characters.",
  confirmAction: mockFunc,
  isPrimaryButtonDisabled: false,
};

describe("IModelName", () => {
  it("should show input field with value from context API", async () => {
    const { container } = render(
      <IModelContext.Provider value={contextValue}>
        <IModelName />
      </IModelContext.Provider>
    );

    const name = container.querySelector("input") as HTMLInputElement;

    expect(name.value).toEqual("Testing");
  });

  it("should call onPropChange when value is changed", async () => {
    const { container } = render(
      <IModelContext.Provider value={contextValue}>
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
          ...contextValue,
          ...{ imodel: { name: new Array(257).join("a"), description: "" } },
        }}
      >
        <IModelName />
      </IModelContext.Provider>
    );

    expect(getByText("The value exceeds allowed 255 characters.")).toBeTruthy();
  });
});
