/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import React from "react";

import { DataStatus, IModelCellOverrides, IModelGrid } from "../..";
import * as useIModelData from "./useIModelData";

describe("IModelGrid", () => {
  beforeEach(() => {
    jest.spyOn(useIModelData, "useIModelData").mockReturnValue({
      iModels: [
        {
          id: "iModel1",
          name: "Test IModel",
          description: "This is a test iModel",
        },
        {
          id: "iModel2",
          name: "Test IModel 2",
          description: "This is another test iModel",
        },
      ],
      status: DataStatus.Complete,
      fetchMore: undefined,
      refetchIModels: jest.fn(),
    });
  });
  it("renders without crashing", () => {
    const wrapper = render(<IModelGrid viewMode="cells" />);
    expect(wrapper).toBeDefined();
  });
  it("should display normal name and description", () => {
    const { getByText } = render(<IModelGrid viewMode="cells" />);
    expect(getByText("Test IModel")).toBeDefined();
    expect(getByText("This is a test iModel")).toBeDefined();
  });
  it("should apply custom cell overrides", () => {
    const cellOverrides: IModelCellOverrides = {
      name: (props) => <strong>{props.value} 2</strong>,
      description: (props) => <em>{props.value} 3</em>,
    };
    const { getByText } = render(
      <IModelGrid viewMode="cells" cellOverrides={cellOverrides} />
    );
    expect(getByText("Test IModel 2")).toHaveStyle("font-weight: bold");
    expect(getByText("This is a test iModel 3")).toHaveStyle(
      "font-style: italic"
    );
  });
  it("should handle empty data correctly", () => {
    jest.spyOn(useIModelData, "useIModelData").mockReturnValue({
      iModels: [],
      status: DataStatus.Complete,
      fetchMore: undefined,
      refetchIModels: jest.fn(),
    });

    const wrapper = render(<IModelGrid viewMode="cells" />);
    expect(
      wrapper.getByText("There are no iModels in this iTwin.")
    ).toBeDefined();
  });
  it("should display overwritten empty message", () => {
    jest.spyOn(useIModelData, "useIModelData").mockReturnValue({
      iModels: [],
      status: DataStatus.Complete,
      fetchMore: undefined,
      refetchIModels: jest.fn(),
    });

    const { getByText } = render(
      <IModelGrid
        viewMode="cells"
        stringsOverrides={{
          noIModels: "No iModels available",
        }}
      />
    );
    expect(getByText("No iModels available")).toBeDefined();
  });
  it("should display the table and correct rows", () => {
    const wrapper = render(<IModelGrid viewMode="cells" />);
    expect(wrapper.getByRole("table")).toBeDefined();
    expect(wrapper.getAllByRole("row").length).toEqual(3); // Header row + 2 data rows
  });
  it("should prevent onThumbnailClick from being called when button in cell is clicked with stopPropagation", () => {
    const onClick = jest.fn();
    const onThumbnailClick = jest.fn();
    const cellOverrides: IModelCellOverrides = {
      name: (props) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Click Me
          </button>
          {props.value}
        </div>
      ),
    };

    const { getAllByText } = render(
      <IModelGrid
        viewMode="cells"
        cellOverrides={cellOverrides}
        onThumbnailClick={onThumbnailClick}
      />
    );

    const buttons = getAllByText("Click Me");
    buttons[0].click();
    expect(onClick).toHaveBeenCalled();
    expect(onThumbnailClick).not.toHaveBeenCalled();
  });
  it("shoudl call onThumbnailClick when button doesn't have stopPropagation", () => {
    const onClick = jest.fn();
    const onThumbnailClick = jest.fn();
    const cellOverrides: IModelCellOverrides = {
      name: (props) => (
        <div>
          <button
            onClick={() => {
              onClick();
            }}
          >
            Click Me
          </button>
          {props.value}
        </div>
      ),
    };

    const { getAllByText } = render(
      <IModelGrid
        viewMode="cells"
        cellOverrides={cellOverrides}
        onThumbnailClick={onThumbnailClick}
      />
    );

    const buttons = getAllByText("Click Me");
    buttons[0].click();
    expect(onClick).toHaveBeenCalled();
    expect(onThumbnailClick).toHaveBeenCalledWith({
      id: "iModel1",
      name: "Test IModel",
      description: "This is a test iModel",
    });
  });
});
