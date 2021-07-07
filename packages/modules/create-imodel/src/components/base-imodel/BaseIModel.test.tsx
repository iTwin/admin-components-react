/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { BaseIModelPage } from "./BaseIModel";

describe("BaseIModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show base page", () => {
    const actionMock = jest.fn();
    const closeMock = jest.fn();

    const { container, getByText } = render(
      <BaseIModelPage onActionClick={actionMock} onClose={closeMock} />
    );

    getByText("Create an iModel");

    expect(container.querySelector(".iac-inputs-container input")).toBeTruthy();
    expect(
      container.querySelector(".iac-inputs-container textarea")
    ).toBeTruthy();
    expect(
      container.querySelector(
        ".iac-inputs-container .iac-file-upload-container"
      )
    ).toBeTruthy();

    const confirmButton = container.querySelector(
      ".iac-button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
    expect(confirmButton.textContent).toBe("Create");
    confirmButton.click();
    expect(actionMock).not.toHaveBeenCalled();
    const cancelButton = container.querySelector(
      ".iac-button-bar button:last-child"
    ) as HTMLButtonElement;
    cancelButton.click();
    expect(closeMock).toHaveBeenCalled();
  });

  it("should show overlay spinner", () => {
    const { container } = render(<BaseIModelPage isLoading />);

    expect(container.querySelector(".iac-overlay-container")).toBeTruthy();
  });

  it("should show error message for too long string", async () => {
    const { container, getByText } = render(<BaseIModelPage />);

    const name = container.querySelector(
      ".iac-inputs-container input"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: new Array(260).join("a") } });
    getByText("The value exceeds allowed 255 characters.");
    const confirmButton = container.querySelector(
      ".iac-button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
  });

  it("should show base page with filled values", () => {
    const { container } = render(
      <BaseIModelPage
        initialIModel={{
          name: "Some name",
          description: "Some description",
        }}
      />
    );

    const name = container.querySelector(
      ".iac-inputs-container input"
    ) as HTMLInputElement;
    expect(name).toBeTruthy();
    expect(name.value).toBe("Some name");

    const description = container.querySelector(
      ".iac-inputs-container textarea"
    ) as HTMLInputElement;
    expect(description).toBeTruthy();
    expect(description.value).toBe("Some description");
  });
});
