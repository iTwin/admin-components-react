/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import { act, fireEvent, render, screen } from "@testing-library/react";
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

    await act(() =>
      fireEvent.click(getByText(innerContextValue.confirmButtonText))
    );
    expect(callbackFun).toHaveBeenCalled();
  });

  it("should disable create button if isPrimaryButtonDisabled context prop is true", async () => {
    render(renderFunction({ isPrimaryButtonDisabled: true }));

    const buttonConfirm = (await screen.findByRole("button", {
      name: innerContextValue.confirmButtonText,
    })) as HTMLButtonElement;
    const buttonCancel = (await screen.findByRole("button", {
      name: innerContextValue.cancelButtonText,
    })) as HTMLButtonElement;
    expect(buttonConfirm.closest("button")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(buttonCancel.closest("button")).not.toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
});
