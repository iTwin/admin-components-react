/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { IModelContext } from "../context/imodel-context";
import { IModelDescription } from "./IModelDescription";

describe("IModelDescription", () => {
  it("should show text area field", async () => {
    const { container } = render(
      <IModelContext.Provider
        value={{
          imodel: { name: "", description: "Testing" },
          onPropChange: jest.fn(),
          onImageChange: jest.fn(),
        }}
      >
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
    const callbackFun = jest.fn();
    const { container } = render(
      <IModelContext.Provider
        value={{
          imodel: { name: "", description: "Test onchange" },
          onPropChange: callbackFun,
          onImageChange: jest.fn(),
        }}
      >
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
          imodel: { name: "", description: new Array(256).join("a") },
          onPropChange: jest.fn(),
          onImageChange: jest.fn(),
        }}
      >
        <IModelDescription message="Description too long." />
      </IModelContext.Provider>
    );

    expect(getByText("Description too long.")).toBeTruthy();
  });
});
