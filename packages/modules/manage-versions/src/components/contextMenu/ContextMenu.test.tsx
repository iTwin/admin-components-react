/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { ConfigProvider } from "../../common/configContext";
import { MOCKED_CONFIG_PROPS } from "../../mocks";
import { ContextMenu, ContextMenuProps } from "./ContextMenu";

describe("ContextMenu", () => {
  const mockActionClick = jest.fn();

  const defaultProps: ContextMenuProps = {
    menuActions: [
      {
        icon: <svg></svg>,
        onClick: mockActionClick,
        title: "Action 1",
        label: "Perform Action 1",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with provided menu actions", async () => {
    render(
      <ConfigProvider {...MOCKED_CONFIG_PROPS}>
        <ContextMenu {...defaultProps} />
      </ConfigProvider>
    );
    await waitFor(() => fireEvent.click(screen.getByText("More")));
    expect(screen.queryByText("Perform Action 1")).not.toBeNull();
  });

  it("does not trigger onClick for disabled menu actions", async () => {
    const disabledActionProps = {
      ...defaultProps,
      menuActions: [
        {
          ...defaultProps.menuActions[0],
          disabled: true,
        },
      ],
    };
    render(
      <ConfigProvider {...MOCKED_CONFIG_PROPS}>
        <ContextMenu {...disabledActionProps} />
      </ConfigProvider>
    );
    await waitFor(() => fireEvent.click(screen.getByText("More")));
    const menuItem = screen.getByTitle("Action 1");
    await waitFor(() => fireEvent.click(menuItem));
    expect(mockActionClick).not.toHaveBeenCalled();
  });
});
