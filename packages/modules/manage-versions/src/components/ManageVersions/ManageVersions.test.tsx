/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { ChangesetClient } from "../../clients/changesetClient";
import { NamedVersionClient } from "../../clients/namedVersionClient";
import {
  MOCKED_IMODEL_ID,
  MockedChangeset,
  MockedChangesetList,
  MockedVersion,
  MockedVersionList,
} from "../../mocks";
import {
  defaultStrings,
  ManageVersions,
  ManageVersionsProps,
} from "./ManageVersions";

const renderComponent = (initialProps?: Partial<ManageVersionsProps>) => {
  const props: ManageVersionsProps = {
    accessToken: "test_token",
    imodelId: MOCKED_IMODEL_ID,
    ...initialProps,
  };
  return render(<ManageVersions {...props} />);
};

describe("ManageVersions", () => {
  const mockGetVersions = jest.spyOn(NamedVersionClient.prototype, "get");
  const mockGetChangesets = jest.spyOn(ChangesetClient.prototype, "get");

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetVersions.mockResolvedValue(MockedVersionList());
    mockGetChangesets.mockResolvedValue(MockedChangesetList());
  });

  it("should show versions table with data", async () => {
    const { container } = renderComponent();

    await waitFor(
      () => !container.querySelector(".iui-progress-indicator-radial")
    );
    const versionRows = container.querySelectorAll(
      ".iui-tables-body .iui-tables-row"
    );
    expect(versionRows.length).toBe(3);

    versionRows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-tables-cell");
      expect(cells.length).toBe(3);
      expect(cells[0].textContent).toContain(MockedVersion(index).name);
      expect(cells[1].textContent).toContain(MockedVersion(index).description);
      expect(cells[2].textContent).toContain(
        new Date(MockedVersion(index).createdDateTime).toLocaleString()
      );
    });
    expect(mockGetVersions).toHaveBeenCalledWith(MOCKED_IMODEL_ID);
  });

  it("should show changesets table with data", async () => {
    const { container } = renderComponent();

    screen.getByText(defaultStrings.changes).click();

    await waitFor(
      () => !container.querySelector(".iui-progress-indicator-radial")
    );
    const changesetRows = container.querySelectorAll(
      ".iui-tables-body .iui-tables-row"
    );
    expect(changesetRows.length).toBe(3);

    changesetRows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-tables-cell");
      expect(cells.length).toBe(3);
      expect(cells[0].textContent).toContain(MockedChangeset(index).index);
      expect(cells[1].textContent).toContain(
        MockedChangeset(index).description
      );
      expect(cells[2].textContent).toContain(
        new Date(MockedChangeset(index).pushDateTime).toLocaleString()
      );
    });
    expect(mockGetChangesets).toHaveBeenCalledWith(MOCKED_IMODEL_ID);
  });

  it("should query data only once when switching tabs", async () => {
    const { container } = renderComponent();

    await waitFor(
      () => !container.querySelector(".iui-progress-indicator-radial")
    );

    screen.getByText(defaultStrings.changes).click();
    await waitFor(
      () => !container.querySelector(".iui-progress-indicator-radial")
    );

    expect(mockGetVersions).toHaveBeenCalledTimes(1);
    expect(mockGetChangesets).toHaveBeenCalledTimes(1);
  });

  it("should show error message in versions table when failed to fetch versions", async () => {
    mockGetVersions.mockRejectedValue("error");
    renderComponent();

    await screen.findByText(defaultStrings.messageFailedGetNamedVersions);
  });

  it("should show error message in changes table when failed to fetch changesets", async () => {
    mockGetChangesets.mockRejectedValue("error");
    renderComponent();

    screen.getByText(defaultStrings.changes).click();
    await screen.findByText(defaultStrings.messageFailedGetChanges);
  });
});
