/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React, { act } from "react";

import { IModelContext, InnerIModelContext } from "../context/imodel-context";
import { IModelDescription } from "./IModelDescription";

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
  nameString: "Name",
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
        <IModelDescription />
      </IModelContext.Provider>
    </InnerIModelContext.Provider>
  );
};

describe("IModelDescription", () => {
  it("should show text area field", async () => {
    const { container } = render(renderFunction());

    const description = container.querySelector(
      '[name="description"]'
    ) as HTMLTextAreaElement;

    expect(description).toBeTruthy();
    expect(description.value).toEqual("Testing");
  });

  it("should call onPropsChange when value is changed", async () => {
    const { container } = render(renderFunction());

    const description = container.querySelector(
      '[name="description"]'
    ) as HTMLTextAreaElement;
    await act(() =>
      fireEvent.change(description, { target: { value: "changed" } })
    );
    expect(callbackFun).toHaveBeenCalled();
  });

  it("should show error when value exceeds the max limit", async () => {
    const { getByText } = render(
      renderFunction({
        imodel: { name: "", description: new Array(257).join("a") },
      })
    );

    expect(getByText("The value exceeds allowed 255 characters.")).toBeTruthy();
  });
});
