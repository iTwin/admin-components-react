/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";

import { ids } from "../../tests/helpers";
import {
  ProjectFull,
  ProjectSortOptions,
  ProjectSortOptionsKeys,
} from "../../types";
import { useProjectSort } from "./useProjectSort";

describe("useProjectSort hook", () => {
  it.each([
    "displayName",
    "projectNumber",
    "registrationDateTime",
    "industry",
    "projectType",
    "geographicLocation",
    "dataCenterLocation",
    "billingCountry",
    "status",
    "allowExternalTeamMembers",
  ] as ProjectSortOptionsKeys[])("sorts correctly with %s", (sortType) => {
    const expectedSortOrder = {
      displayName: ["1", "2", "4", "5", "3"],
      projectNumber: ["2", "4", "5", "3", "1"],
      registrationDateTime: ["4", "5", "3", "1", "2"],
      industry: ["4", "3", "1", "5", "2"],
      projectType: ["1", "2", "4", "5", "3"],
      geographicLocation: ["2", "4", "5", "3", "1"],
      dataCenterLocation: ["4", "5", "3", "1", "2"],
      billingCountry: ["4", "3", "1", "5", "2"],
      status: ["1", "4", "3", "2", "5"],
      allowExternalTeamMembers: ["1", "3", "5", "2", "4"],
    }[sortType];
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "a",
        projectNumber: "e",
        registrationDateTime: "2020-09-04T12:42:51.593Z",
        industry: "c",
        projectType: "a",
        geographicLocation: "e",
        dataCenterLocation: "d",
        billingCountry: "c",
        status: "Active",
        allowExternalTeamMembers: true,
      },
      {
        id: "2",
        displayName: "b",
        projectNumber: "a",
        registrationDateTime: "2020-09-05T12:42:51.593Z",
        industry: "e",
        projectType: "b",
        geographicLocation: "a",
        dataCenterLocation: "e",
        billingCountry: "e",
        status: "Trial",
        allowExternalTeamMembers: false,
      },
      {
        id: "3",
        displayName: "e",
        projectNumber: "d",
        registrationDateTime: "2020-09-03T12:42:51.593Z",
        industry: "b",
        projectType: "e",
        geographicLocation: "d",
        dataCenterLocation: "c",
        billingCountry: "b",
        status: "Inactive",
        allowExternalTeamMembers: true,
      },
      {
        id: "4",
        displayName: "c",
        projectNumber: "b",
        registrationDateTime: "2020-09-01T12:42:51.593Z",
        industry: "a",
        projectType: "c",
        geographicLocation: "b",
        dataCenterLocation: "a",
        billingCountry: "a",
        status: "Active",
        allowExternalTeamMembers: false,
      },
      {
        id: "5",
        displayName: "d",
        projectNumber: "c",
        registrationDateTime: "2020-09-02T12:42:51.593Z",
        industry: "d",
        projectType: "d",
        geographicLocation: "c",
        dataCenterLocation: "b",
        billingCountry: "d",
        status: "Trial",
        allowExternalTeamMembers: true,
      },
    ];
    const { result, rerender } = renderHook(
      (props: { descending: boolean }) =>
        useProjectSort(projects, { sortType, descending: props.descending }),
      { initialProps: { descending: false } }
    );
    expect(result.current.map(ids)).toEqual(expectedSortOrder);

    rerender({ descending: true });
    expect(result.current.map(ids)).toEqual(expectedSortOrder.reverse());
  });

  it("sorts correctly with sortFunction", () => {
    const expectedSortOrder = ["4", "3", "2", "5", "1"];
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "c",
        allowExternalTeamMembers: true,
      },
      {
        id: "2",
        displayName: "a",
        allowExternalTeamMembers: true,
      },
      {
        id: "3",
        displayName: "e",
        allowExternalTeamMembers: false,
      },
      {
        id: "4",
        displayName: "d",
        allowExternalTeamMembers: false,
      },
      {
        id: "5",
        displayName: "b",
        allowExternalTeamMembers: true,
      },
    ];
    // no external member first, then sort by display name.
    const sortFn: ProjectSortOptions = (a, b) => {
      if (a.allowExternalTeamMembers === b.allowExternalTeamMembers) {
        return a.displayName?.localeCompare(b.displayName as string) ?? 0;
      }
      return a.allowExternalTeamMembers ? 1 : -1;
    };
    const { result } = renderHook(() => useProjectSort(projects, sortFn));
    expect(result.current.map(ids)).toEqual(expectedSortOrder);
  });

  it("do not modify input array", () => {
    const expectedSortOrder = ["1", "2", "3", "4", "5"];
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "c",
        allowExternalTeamMembers: true,
      },
      {
        id: "2",
        displayName: "a",
        allowExternalTeamMembers: true,
      },
      {
        id: "3",
        displayName: "e",
        allowExternalTeamMembers: false,
      },
      {
        id: "4",
        displayName: "d",
        allowExternalTeamMembers: false,
      },
      {
        id: "5",
        displayName: "b",
        allowExternalTeamMembers: true,
      },
    ];
    // no external member first, then sort by display name.
    const sortFn: ProjectSortOptions = (a, b) => {
      if (a.allowExternalTeamMembers === b.allowExternalTeamMembers) {
        return a.displayName?.localeCompare(b.displayName as string) ?? 0;
      }
      return a.allowExternalTeamMembers ? 1 : -1;
    };
    const { result } = renderHook(() => useProjectSort(projects, sortFn));
    expect(result.current).not.toBe(projects);
    expect(projects.map(ids)).toEqual(expectedSortOrder);
  });

  it("return provided array on undefined options", () => {
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "c",
        allowExternalTeamMembers: true,
      },
      {
        id: "2",
        displayName: "a",
        allowExternalTeamMembers: true,
      },
      {
        id: "3",
        displayName: "e",
        allowExternalTeamMembers: false,
      },
      {
        id: "4",
        displayName: "d",
        allowExternalTeamMembers: false,
      },
      {
        id: "5",
        displayName: "b",
        allowExternalTeamMembers: true,
      },
    ];
    const { result } = renderHook(() => useProjectSort(projects, undefined));
    expect(result.current).toBe(projects);
  });

  it("return provided array on unsupported sortType", () => {
    const projects: ProjectFull[] = [
      {
        id: "1",
        displayName: "c",
        allowExternalTeamMembers: true,
      },
      {
        id: "2",
        displayName: "a",
        allowExternalTeamMembers: true,
      },
      {
        id: "3",
        displayName: "e",
        allowExternalTeamMembers: false,
      },
      {
        id: "4",
        displayName: "d",
        allowExternalTeamMembers: false,
      },
      {
        id: "5",
        displayName: "b",
        allowExternalTeamMembers: true,
      },
    ];
    const { result } = renderHook(() =>
      useProjectSort(projects, {
        sortType: "thumbnail" as any,
        descending: false,
      })
    );
    expect(result.current).toBe(projects);
  });
});
