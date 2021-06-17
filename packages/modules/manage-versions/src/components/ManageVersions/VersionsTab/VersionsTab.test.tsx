/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render, screen } from "@testing-library/react";
import React from "react";

import { ConfigProvider } from "../../../common/configContext";
import {
  MOCKED_CONFIG_PROPS,
  MockedVersion,
  MockedVersionList,
} from "../../../mocks";
import { defaultStrings } from "../ManageVersions";
import { RequestStatus } from "../types";
import VersionsTab, { VersionsTabProps } from "./VersionsTab";

const renderComponent = (initialProps?: Partial<VersionsTabProps>) => {
  const props: VersionsTabProps = {
    versions: MockedVersionList(),
    status: RequestStatus.Finished,
    onVersionUpdated: jest.fn(),
    loadMoreVersions: jest.fn(),
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <VersionsTab {...props} />
    </ConfigProvider>
  );
};

describe("VersionsTab", () => {
  it("should show data in versions table", () => {
    const { container } = renderComponent();
    const rows = container.querySelectorAll(".iui-tables-body .iui-tables-row");
    expect(rows.length).toBe(3);

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-tables-cell");
      expect(cells.length).toBe(4);
      expect(cells[0].textContent).toContain(MockedVersion(index).name);
      expect(cells[1].textContent).toContain(MockedVersion(index).description);
      expect(cells[2].textContent).toContain(
        new Date(MockedVersion(index).createdDateTime).toLocaleString()
      );
      expect(cells[3].querySelector(".iac-update-version-icon")).toBeTruthy();
    });
  });

  it("should show empty data message", () => {
    renderComponent({ versions: [] });
    screen.getByText(defaultStrings.messageNoNamedVersions);
  });

  it("should show error message that failed to fetch named versions", () => {
    renderComponent({ versions: [], status: RequestStatus.Failed });
    screen.getByText(defaultStrings.messageFailedGetNamedVersions);
  });

  it("should show spinner when data is loading", () => {
    const { container } = renderComponent({
      versions: [],
      status: RequestStatus.InProgress,
    });
    expect(
      container.querySelector(".iui-progress-indicator-radial")
    ).toBeTruthy();
  });
});
