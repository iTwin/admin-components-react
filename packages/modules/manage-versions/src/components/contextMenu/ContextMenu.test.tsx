/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ContextMenu, ContextMenuProps } from "./ContextMenu";

describe("ContextMenu", () => {
  const mockToggleMenu = jest.fn();
  const mockOnClose = jest.fn();
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
    isMenuOpen: false,
    toggleMenu: mockToggleMenu,
    rowId: "row1",
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with provided menu actions", () => {
    render(<ContextMenu {...defaultProps} />);
    fireEvent.click(screen.getByTitle("More"));
    expect(screen.queryByText("Perform Action 1")).not.toBeNull();
  });

  it("should toggle menu visibility on button click", () => {
    render(<ContextMenu {...defaultProps} />);
    const button = screen.getByTitle("More");
    fireEvent.click(button);
    expect(mockToggleMenu).toHaveBeenCalledWith("row1");
  });

  it("should call action onClick and closes menu when a menu item is clicked", () => {
    render(<ContextMenu {...{ ...defaultProps, isMenuOpen: true }} />);
    const menuItem = screen.getByTitle("Action 1");
    fireEvent.click(menuItem);
    expect(mockActionClick).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onClick for disabled menu actions", () => {
    const disabledActionProps = {
      ...defaultProps,
      menuActions: [
        {
          ...defaultProps.menuActions[0],
          disabled: true,
        },
      ],
    };
    render(<ContextMenu {...disabledActionProps} />);
    fireEvent.click(screen.getByTitle("More"));
    const menuItem = screen.getByTitle("Action 1");
    fireEvent.click(menuItem);
    expect(mockActionClick).not.toHaveBeenCalled();
  });
});
