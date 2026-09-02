/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import { Root } from "@stratakit/mui";
import { render } from "@testing-library/react";
import React from "react";

import * as useITwinData from "../../../containers/ITwinGrid/useITwinData";
import { DataStatus } from "../../../types";
import { ITwinGridMUI } from "./ITwinGridMUI";

// The real DataGrid needs a TextEncoder that jsdom does not provide.
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: () => <div data-testid="data-grid" />,
}));

describe("ITwinGridMUI", () => {
  beforeEach(() => {
    jest.spyOn(useITwinData, "useITwinData").mockReturnValue({
      iTwins: [],
      status: DataStatus.Complete,
      totalCount: 0,
      fetchMore: undefined,
      refetchITwins: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should hand onDataStateChange to the data hook", () => {
    const onDataStateChange = jest.fn();

    render(
      <Root colorScheme="light">
        <ITwinGridMUI onDataStateChange={onDataStateChange} />
      </Root>
    );

    expect(useITwinData.useITwinData).toHaveBeenCalledWith(
      expect.objectContaining({ onDataStateChange })
    );
  });
});
