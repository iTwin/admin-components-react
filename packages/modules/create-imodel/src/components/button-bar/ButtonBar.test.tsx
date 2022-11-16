/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { IModelContext, InnerIModelContext } from "../context/imodel-context";
import { ButtonBar } from "./ButtonBar";

const callbackFun = jest.fn();
const innerContextValue = {
  nameString: "name",
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
  confirmAction: callbackFun,
  isPrimaryButtonDisabled: false,
  cancelAction: callbackFun,
};

const renderFunction = (newContextValue = {}) => {
  return (
    <InnerIModelContext.Provider value={innerContextValue}>
      <IModelContext.Provider value={{ ...contextValue, ...newContextValue }}>
        <ButtonBar />
      </IModelContext.Provider>
    </InnerIModelContext.Provider>
  );
};

describe("ButtonBar", () => {
  it("should show buttons with value from context API", async () => {
    const { getByText } = render(renderFunction());

    fireEvent.click(getByText(innerContextValue.confirmButtonText));
    expect(callbackFun).toHaveBeenCalled();
  });

  it("should disable create button if isPrimaryButtonDisabled context prop is true", async () => {
    const { getByText } = render(
      renderFunction({ isPrimaryButtonDisabled: true })
    );

    const buttonConfirm = getByText(
      innerContextValue.confirmButtonText
    ) as HTMLInputElement;
    const buttonCancel = getByText(
      innerContextValue.cancelButtonText
    ) as HTMLInputElement;
    expect(buttonConfirm.closest("button")).toHaveProperty("disabled", true);
    expect(buttonCancel.closest("button")).toHaveProperty("disabled", false);
  });
});
