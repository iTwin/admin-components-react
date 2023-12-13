/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ThemeProvider } from "@itwin/itwinui-react";
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
      <ThemeProvider>
        <BaseIModelPage onActionClick={actionMock} onClose={closeMock} />
      </ThemeProvider>
    );

    getByText("Create an iModel");

    expect(container.querySelector(".iac-inputs-container input")).toBeTruthy();
    expect(
      container.querySelector(".iac-inputs-container textarea")
    ).toBeTruthy();
    getByText("South West coordinate");
    getByText("North East coordinate");
    expect(
      container.querySelector(
        ".iac-inputs-container .iac-file-upload-container"
      )
    ).toBeTruthy();

    const confirmButton = container.querySelector(
      ".iac-button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.getAttribute("aria-disabled")).toBe("true");
    expect(confirmButton.textContent).toBe("Create");
    confirmButton.click();
    expect(actionMock).not.toHaveBeenCalled();
    const cancelButton = container.querySelector(
      ".iac-button-bar button:last-child"
    ) as HTMLButtonElement;
    cancelButton.click();
    expect(closeMock).toHaveBeenCalled();
  });

  it("should show base page with custom extent component", () => {
    const { container, getByText, queryByText } = render(
      <ThemeProvider>
        <BaseIModelPage extentComponent={<div className="test-extent-map" />} />
      </ThemeProvider>
    );

    getByText("Create an iModel");

    expect(container.querySelector(".iac-inputs-container input")).toBeTruthy();
    expect(
      container.querySelector(".iac-inputs-container textarea")
    ).toBeTruthy();
    expect(queryByText("South West coordinate")).toBeFalsy();
    expect(queryByText("North East coordinate")).toBeFalsy();
    expect(
      container.querySelector(
        ".iac-inputs-container .iac-file-upload-container"
      )
    ).toBeTruthy();

    const confirmButton = container.querySelector(
      ".iac-button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.getAttribute("aria-disabled")).toBe("true");
    expect(confirmButton.textContent).toBe("Create");

    expect(container.querySelector(".test-extent-map")).toBeTruthy();
  });

  it("should show overlay spinner", () => {
    const { container } = render(
      <ThemeProvider>
        <BaseIModelPage isLoading />
      </ThemeProvider>
    );

    expect(container.querySelector(".iac-overlay-container")).toBeTruthy();
  });

  it("should show error message for too long string", async () => {
    const { container, getByText } = render(
      <ThemeProvider>
        <BaseIModelPage />
      </ThemeProvider>
    );

    const name = container.querySelector(
      ".iac-inputs-container input"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: new Array(260).join("a") } });
    getByText("The value exceeds allowed 255 characters.");
    const confirmButton = container.querySelector(
      ".iac-button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.getAttribute("aria-disabled")).toBe("true");
  });

  it("should show base page with filled values", () => {
    const { container } = render(
      <ThemeProvider>
        <BaseIModelPage
          initialIModel={{
            name: "Some name",
            description: "Some description",
            extent: {
              southWest: { latitude: 1, longitude: 2 },
              northEast: { latitude: 3, longitude: 4 },
            },
          }}
        />
      </ThemeProvider>
    );

    const inputs = container.querySelectorAll<HTMLInputElement>(
      ".iac-inputs-container input"
    );

    const name = inputs[0];
    expect(name).toBeTruthy();
    expect(name.value).toBe("Some name");

    const description = container.querySelector(
      ".iac-inputs-container textarea"
    ) as HTMLInputElement;
    expect(description).toBeTruthy();
    expect(description.value).toBe("Some description");

    const swLatitude = inputs[1];
    expect(swLatitude).toBeTruthy();
    expect(swLatitude.value).toBe("1");

    const swLongitude = inputs[2];
    expect(swLongitude).toBeTruthy();
    expect(swLongitude.value).toBe("2");

    const neLatitude = inputs[3];
    expect(neLatitude).toBeTruthy();
    expect(neLatitude.value).toBe("3");

    const neLongitude = inputs[4];
    expect(neLongitude).toBeTruthy();
    expect(neLongitude.value).toBe("4");
  });
});
