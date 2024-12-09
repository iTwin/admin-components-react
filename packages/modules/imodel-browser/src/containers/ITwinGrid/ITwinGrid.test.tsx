/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render } from "@testing-library/react";
import React from "react";

import { DataStatus } from "../../types";
import { ITwinGrid } from "./ITwinGrid";
import * as useITwinData from "./useITwinData";

describe("ITwinGrid", () => {
  beforeEach(() => {
    jest.spyOn(useITwinData, "useITwinData").mockReturnValue({
      iTwins: [
        {
          id: "iTwin1",
          number: "iTwinNumber1",
        },
        {
          id: "iTwin2",
          number: "iTwinNumber2",
        },
      ],
      status: DataStatus.Complete,
      fetchMore: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display the table and correct error message when no data is present", () => {
    // Arrange
    jest.spyOn(useITwinData, "useITwinData").mockReturnValue({
      iTwins: [],
      status: DataStatus.Complete,
      fetchMore: undefined,
    });

    // Act
    const wrapper = render(<ITwinGrid viewMode="cells" />);

    // Assert
    expect(wrapper.getByRole("table")).toBeDefined();
    expect(wrapper.getByText("No iTwin found.")).toBeDefined();
  });

  it("should display the table and correct rows", () => {
    // Act
    const wrapper = render(<ITwinGrid viewMode="cells" />);

    // Assert
    expect(wrapper.getByRole("table")).toBeDefined();
    expect(wrapper.getAllByRole("row").length).toEqual(3); // First row is header
  });

  it("should not refetch iTwins favorites when component rerenders", async () => {
    // Arrange
    const fetchMore = jest.fn();
    jest.spyOn(useITwinData, "useITwinData").mockReturnValue({
      iTwins: [],
      status: DataStatus.Complete,
      fetchMore,
    });
    // Act
    const signal = new AbortController().signal;
    const wrapper = render(
      <ITwinGrid
        accessToken="accessToken"
        apiOverrides={{ serverEnvironmentPrefix: "qa" }}
        viewMode="cells"
      />
    );
    wrapper.rerender(
      <ITwinGrid
        accessToken="accessToken"
        apiOverrides={{ serverEnvironmentPrefix: "qa" }}
        viewMode="tile"
      />
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://qa-api.bentley.com/itwins/favorites?subClass=Project",
      {
        headers: {
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
          "Cache-Control": "",
          authorization: "accessToken",
        },
        signal: signal,
      }
    );
  });
});
