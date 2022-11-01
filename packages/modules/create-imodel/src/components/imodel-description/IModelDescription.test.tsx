/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render, screen } from "@testing-library/react";
import React from "react";

import { IModelContext } from "../context/imodel-context";
import { IModelDescription } from "./IModelDescription";

describe("IModelDescription", () => {
  it("should show text area field", async () => {
    const { container, getByLabelText } = render(
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

    const description = container.querySelector('[name="description"]');

    expect(description).toBeTruthy();
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
