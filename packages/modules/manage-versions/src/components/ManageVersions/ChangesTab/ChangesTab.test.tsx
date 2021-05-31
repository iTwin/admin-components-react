/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render, screen } from "@testing-library/react";
import React from "react";

import { ConfigProvider } from "../../../common/configContext";
import {
  MOCKED_CONFIG_PROPS,
  MockedChangeset,
  MockedChangesetList,
} from "../../../mocks";
import { defaultStrings } from "../ManageVersions";
import { RequestStatus } from "../types";
import ChangesTab, { ChangesTabProps } from "./ChangesTab";

const renderComponent = (initialProps?: Partial<ChangesTabProps>) => {
  const props: ChangesTabProps = {
    changesets: MockedChangesetList(),
    status: RequestStatus.Finished,
    loadMoreChanges: jest.fn(),
    canCreateVersion: () => true,
    latestVersion: undefined,
    onVersionCreated: jest.fn(),
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <ChangesTab {...props} />
    </ConfigProvider>
  );
};

describe("ChangesTab", () => {
  it("should show data in versions table", () => {
    const { container } = renderComponent();
    const rows = container.querySelectorAll(".iui-tables-body .iui-tables-row");
    expect(rows.length).toBe(3);

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-tables-cell");
      expect(cells.length).toBe(4);
      expect(cells[0].textContent).toContain(MockedChangeset(index).index);
      expect(cells[1].textContent).toContain(
        MockedChangeset(index).description
      );
      expect(cells[2].textContent).toContain(
        new Date(MockedChangeset(index).pushDateTime).toLocaleString()
      );
      expect(cells[3].querySelector(".iac-create-version-icon")).toBeTruthy();
    });
  });

  it("should show empty data message", () => {
    renderComponent({ changesets: [] });
    screen.getByText(defaultStrings.messageNoChanges);
  });

  it("should show error message that failed to fetch changesets", () => {
    renderComponent({ changesets: [], status: RequestStatus.Failed });
    screen.getByText(defaultStrings.messageFailedGetChanges);
  });

  it("should show spinner when data is loading", () => {
    const { container } = renderComponent({
      changesets: [],
      status: RequestStatus.InProgress,
    });
    expect(
      container.querySelector(".iui-progress-indicator-radial")
    ).toBeTruthy();
  });

  it("should not show create version icon when can not create version", () => {
    const { container } = renderComponent({ canCreateVersion: () => false });
    const rows = container.querySelectorAll(".iui-tables-body .iui-tables-row");
    expect(rows.length).toBe(3);

    const createVersionicons = container.querySelectorAll(
      ".iac-create-version-icon"
    );
    expect(createVersionicons.length).toBe(0);
  });
});
