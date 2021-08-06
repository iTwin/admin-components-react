/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";

import { ids } from "../../tests/helpers";
import { ProjectFull } from "../../types";
import { useProjectFilter } from "./useProjectFilter";

describe("useProjectFilter hook", () => {
  it("filter correctly with a string", () => {
    const expected = ["2", "3"];
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "NotFound",
        projectNumber: "NotFound",
      },
      {
        id: "2",
        displayName: "StringIsFoundInName",
        projectNumber: "NotFound",
      },
      {
        id: "3",
        displayName: "NotFound",
        projectNumber: "StringIsFoundInDescription",
      },
      {
        id: "4",
        displayName: "NotHere",
        projectNumber: "NorHere",
      },
      {
        id: "5",
        displayName: "c",
        projectNumber: "a",
      },
    ];
    const { result } = renderHook(() => useProjectFilter(projects, "Is"));
    expect(result.current.map(ids)).toEqual(expected);
  });

  it("do not modify input array", () => {
    const expected = ["1", "2", "3", "4", "5"];
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "c",
        status: "Active",
      },
      {
        id: "2",
        displayName: "a",
        status: "Active",
      },
      {
        id: "3",
        displayName: "e",
        status: "Trial",
      },
      {
        id: "4",
        displayName: "d",
        status: "Trial",
      },
      {
        id: "5",
        displayName: "b",
        status: "Inactive",
      },
    ];
    const { result } = renderHook(() => useProjectFilter(projects, "a"));

    expect(result.current).not.toBe(projects);
    expect(projects.map(ids)).toEqual(expected);
  });

  it("return provided array on undefined options", () => {
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "c",
        status: "Active",
      },
      {
        id: "2",
        displayName: "a",
        status: "Active",
      },
      {
        id: "3",
        displayName: "e",
        status: "Trial",
      },
      {
        id: "4",
        displayName: "d",
        status: "Trial",
      },
      {
        id: "5",
        displayName: "b",
        status: "Inactive",
      },
    ];
    const { result } = renderHook(() => useProjectFilter(projects, undefined));
    expect(result.current).toBe(projects);
  });
});
