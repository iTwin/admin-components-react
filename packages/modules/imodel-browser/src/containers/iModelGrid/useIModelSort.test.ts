/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";

import {
  IModelFull,
  IModelSortOptions,
  IModelSortOptionsKeys,
} from "../../types";
import { useIModelSort } from "./useIModelSort";

describe("useIModelSort hook", () => {
  it.each([
    "displayName",
    "name",
    "description",
    "state",
    "createdDateTime",
  ] as IModelSortOptionsKeys[])("sorts correctly with %s", (sortType) => {
    const expectedSortOrder = {
      displayName: ["2", "4", "5", "1", "3"],
      name: ["3", "4", "1", "2", "5"],
      description: ["5", "4", "3", "2", "1"],
      state: ["1", "2", "5", "3", "4"],
      createdDateTime: ["4", "5", "2", "3", "1"],
    }[sortType];
    const iModels: IModelFull[] = [
      {
        id: "1",
        displayName: "d",
        name: "c",
        description: "e",
        state: "initialized",
        createdDateTime: "2020-09-05T12:42:51.593Z",
      },
      {
        id: "2",
        displayName: "a",
        name: "d",
        description: "d",
        state: "initialized",
        createdDateTime: "2020-09-03T12:42:51.593Z",
      },
      {
        id: "3",
        displayName: "e",
        name: "a",
        description: "c",
        state: "notInitialized",
        createdDateTime: "2020-09-04T12:42:51.593Z",
      },
      {
        id: "4",
        displayName: "b",
        name: "b",
        description: "b",
        state: "notInitialized",
        createdDateTime: "2020-09-01T12:42:51.593Z",
      },
      {
        id: "5",
        displayName: "c",
        name: "d",
        description: "a",
        state: "initialized",
        createdDateTime: "2020-09-02T12:42:51.593Z",
      },
    ];
    const { result, rerender } = renderHook(
      (props: { descending: boolean }) =>
        useIModelSort(iModels, { sortType, descending: props.descending }),
      { initialProps: { descending: false } }
    );
    expect(result.current.map((iModel) => iModel.id)).toEqual(
      expectedSortOrder
    );

    rerender({ descending: true });
    expect(result.current.map((iModel) => iModel.id)).toEqual(
      expectedSortOrder.reverse()
    );
  });

  it("sorts correctly with sortFunction", () => {
    const expectedSortOrder = ["4", "3", "2", "5", "1"];
    const iModels: IModelFull[] = [
      {
        id: "1",
        displayName: "c",
        state: "initialized",
      },
      {
        id: "2",
        displayName: "a",
        state: "initialized",
      },
      {
        id: "3",
        displayName: "e",
        state: "notInitialized",
      },
      {
        id: "4",
        displayName: "d",
        state: "notInitialized",
      },
      {
        id: "5",
        displayName: "b",
        state: "initialized",
      },
    ];
    // uninitialized first, then sort by display name.
    const sortFn: IModelSortOptions = (a, b) => {
      if (a.state === b.state) {
        return a.displayName?.localeCompare(b.displayName as string) ?? 0;
      }
      return b.state?.localeCompare(a.state as string) ?? 0;
    };
    const { result } = renderHook(() => useIModelSort(iModels, sortFn));
    expect(result.current.map((iModel) => iModel.id)).toEqual(
      expectedSortOrder
    );
  });

  it("do not modify input array", () => {
    const expectedSortOrder = ["1", "2", "3", "4", "5"];
    const iModels: IModelFull[] = [
      {
        id: "1",
        displayName: "c",
        state: "initialized",
      },
      {
        id: "2",
        displayName: "a",
        state: "initialized",
      },
      {
        id: "3",
        displayName: "e",
        state: "notInitialized",
      },
      {
        id: "4",
        displayName: "d",
        state: "notInitialized",
      },
      {
        id: "5",
        displayName: "b",
        state: "initialized",
      },
    ];
    // uninitialized first, then sort by display name.
    const sortFn: IModelSortOptions = (a, b) => {
      if (a.state === b.state) {
        return a.displayName?.localeCompare(b.displayName as string) ?? 0;
      }
      return b.state?.localeCompare(a.state as string) ?? 0;
    };
    const { result } = renderHook(() => useIModelSort(iModels, sortFn));
    expect(result.current).not.toBe(iModels);
    expect(iModels.map((iModel) => iModel.id)).toEqual(expectedSortOrder);
  });

  it("return provided array on undefined options", () => {
    const iModels: IModelFull[] = [
      {
        id: "1",
        displayName: "c",
        state: "initialized",
      },
      {
        id: "2",
        displayName: "a",
        state: "initialized",
      },
      {
        id: "3",
        displayName: "e",
        state: "notInitialized",
      },
      {
        id: "4",
        displayName: "d",
        state: "notInitialized",
      },
      {
        id: "5",
        displayName: "b",
        state: "initialized",
      },
    ];
    const { result } = renderHook(() => useIModelSort(iModels, undefined));
    expect(result.current).toBe(iModels);
  });

  it("return provided array on unsupported sortType", () => {
    const iModels: IModelFull[] = [
      {
        id: "1",
        displayName: "c",
        state: "initialized",
      },
      {
        id: "2",
        displayName: "a",
        state: "initialized",
      },
      {
        id: "3",
        displayName: "e",
        state: "notInitialized",
      },
      {
        id: "4",
        displayName: "d",
        state: "notInitialized",
      },
      {
        id: "5",
        displayName: "b",
        state: "initialized",
      },
    ];
    const { result } = renderHook(() =>
      useIModelSort(iModels, {
        sortType: "thumbnail" as any,
        descending: false,
      })
    );
    expect(result.current).toBe(iModels);
  });
});
