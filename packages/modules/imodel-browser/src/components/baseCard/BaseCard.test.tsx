/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import { fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";

import { BaseCard } from "./BaseCard";

jest.mock("@stratakit/mui", () => ({
  Icon: () => null,
}));

describe("BaseCard - context menu vs single action", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("clicking a moreActions item does NOT trigger the single (actions[0]) action", () => {
    const singleActionClick = jest.fn();
    const moreActionClick = jest.fn();

    render(
      <BaseCard
        title="Test Card"
        actions={[{ key: "open", label: "Open", onClick: singleActionClick }]}
        moreActions={[
          { key: "remove", label: "Remove", onClick: moreActionClick },
        ]}
      />
    );

    // Open the three-dot menu.
    fireEvent.click(screen.getByTestId("more-options-button"));

    // Click the menu item.
    const menu = screen.getByTestId("more-options-menu");
    fireEvent.click(within(menu).getByText("Remove"));

    expect(moreActionClick).toHaveBeenCalledTimes(1);
    expect(singleActionClick).not.toHaveBeenCalled();
  });
});
