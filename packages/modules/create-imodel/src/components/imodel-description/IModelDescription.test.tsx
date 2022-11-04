/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { IModelContext } from "../context/imodel-context";
import { IModelDescription } from "./IModelDescription";

const callbackFun = jest.fn();
const contextValue = {
  imodel: { name: "", description: "Testing" },
  onPropChange: callbackFun,
  onImageChange: callbackFun,
  nameString: "name",
  nameTooLong: "The value exceeds allowed 255 characters.",
  descriptionString: "Description",
  descriptionTooLong: "The value exceeds allowed 255 characters.",
};

describe("IModelDescription", () => {
  it("should show text area field", async () => {
    const { container } = render(
      <IModelContext.Provider value={contextValue}>
        <IModelDescription />
      </IModelContext.Provider>
    );

    const description = container.querySelector(
      '[name="description"]'
    ) as HTMLTextAreaElement;

    expect(description).toBeTruthy();
    expect(description.value).toEqual("Testing");
  });

  it("should call onPropsChange when value is changed", async () => {
    const { container } = render(
      <IModelContext.Provider value={contextValue}>
        <IModelDescription />
      </IModelContext.Provider>
    );

    const description = container.querySelector(
      '[name="description"]'
    ) as HTMLTextAreaElement;
    fireEvent.change(description, { target: { value: "changed" } });
    expect(callbackFun).toHaveBeenCalled();
  });

  it("should show error when value exceeds the max limit", async () => {
    const { getByText } = render(
      <IModelContext.Provider
        value={{
          ...contextValue,
          ...{ imodel: { name: "", description: new Array(257).join("a") } },
        }}
      >
        <IModelDescription />
      </IModelContext.Provider>
    );

    expect(getByText("The value exceeds allowed 255 characters.")).toBeTruthy();
  });
});
