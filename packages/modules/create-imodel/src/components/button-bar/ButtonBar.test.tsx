/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { IModelContext } from "../context/imodel-context";
import { ButtonBar } from "./ButtonBar";

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
  confirmButtonText: "Create",
  cancelButtonText: "Cancel",
};

describe("ButtonBar", () => {
  it("should show buttons with value from context API", async () => {
    const { getByText } = render(
      <IModelContext.Provider value={contextValue}>
        <ButtonBar />
      </IModelContext.Provider>
    );

    fireEvent.click(getByText(contextValue.confirmButtonText));
    expect(mockFunc).toHaveBeenCalled();
  });

  it("should disable create button if isPrimaryButtonDisabled context prop is true", async () => {
    const { getByText } = render(
      <IModelContext.Provider
        value={{
          ...contextValue,
          ...{ isPrimaryButtonDisabled: true },
        }}
      >
        <ButtonBar />
      </IModelContext.Provider>
    );

    const buttonConfirm = getByText(
      contextValue.confirmButtonText
    ) as HTMLInputElement;
    const buttonCancel = getByText(
      contextValue.cancelButtonText
    ) as HTMLInputElement;
    expect(buttonConfirm.closest("button")).toHaveProperty("disabled", true);
    expect(buttonCancel.closest("button")).toHaveProperty("disabled", false);
  });

  it("should disable cancel button if isCancelDisabled prop passed to true", async () => {
    const { getByText } = render(
      <IModelContext.Provider value={contextValue}>
        <ButtonBar isCancelDisabled={true} />
      </IModelContext.Provider>
    );

    const buttonCancel = getByText(
      contextValue.cancelButtonText
    ) as HTMLInputElement;
    expect(buttonCancel.closest("button")).toHaveProperty("disabled", true);
  });
});
