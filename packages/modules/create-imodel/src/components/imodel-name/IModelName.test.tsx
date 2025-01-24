/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { IModelContext, InnerIModelContext } from "../context/imodel-context";
import { IModelName } from "./IModelName";

const callbackFun = jest.fn();
const innerContextValue = {
  nameString: "Name",
  nameTooLong: "The value exceeds allowed 255 characters.",
  descriptionString: "Description",
  descriptionTooLong: "The value exceeds allowed 255 characters.",
  confirmButtonText: "Confirm",
  cancelButtonText: "Cancel",
};

const contextValue = {
  imodel: { name: "Testing", description: "Testing" },
  onPropChange: callbackFun,
  onImageChange: callbackFun,
  nameString: "name",
  nameTooLong: "The value exceeds allowed 255 characters.",
  descriptionString: "Description",
  descriptionTooLong: "The value exceeds allowed 255 characters.",
  confirmAction: callbackFun,
  isPrimaryButtonDisabled: false,
};

const renderFunction = (newContextValue = {}) => {
  return (
    <InnerIModelContext.Provider value={innerContextValue}>
      <IModelContext.Provider value={{ ...contextValue, ...newContextValue }}>
        <IModelName />
      </IModelContext.Provider>
    </InnerIModelContext.Provider>
  );
};

describe("IModelName", () => {
  it("should show input field with value from context API", async () => {
    const { container } = render(renderFunction());

    const name = container.querySelector("input") as HTMLInputElement;

    expect(name.value).toEqual("Testing");
  });

  it("should call onPropChange when value is changed", async () => {
    const { container } = render(renderFunction());

    const name = container.querySelector("input") as HTMLInputElement;
    await act(() => fireEvent.change(name, { target: { value: "new" } }));
    expect(callbackFun).toHaveBeenCalled();
  });

  it("should show error when value exceeds the max limit", async () => {
    const { getByText } = render(
      renderFunction({
        imodel: { name: new Array(257).join("a"), description: "" },
      })
    );

    expect(getByText("The value exceeds allowed 255 characters.")).toBeTruthy();
  });
});
