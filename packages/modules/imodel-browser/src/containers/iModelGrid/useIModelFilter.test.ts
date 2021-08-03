/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";

import { IModelFull } from "../../types";
import { useIModelFilter } from "./useIModelFilter";

describe("useIModelFilter hook", () => {
  it("filter correctly with a string", () => {
    const expected = ["2", "3"];
    const iModels: IModelFull[] = [
      {
        id: "1",
        displayName: "NotFound",
        description: "NotFound",
      },
      {
        id: "2",
        displayName: "StringIsFoundInName",
        description: "NotFound",
      },
      {
        id: "3",
        displayName: "NotFound",
        description: "StringIsFoundInDescription",
      },
      {
        id: "4",
        displayName: "NotHere",
        description: "NorHere",
      },
      {
        id: "5",
        displayName: "c",
        description: "a",
      },
    ];
    const { result } = renderHook(() => useIModelFilter(iModels, "Is"));
    expect(result.current.map((iModel) => iModel.id)).toEqual(expected);
  });

  it("filter correctly with filter function", () => {
    const expected = ["3", "4"];
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
    // Show only uninitialized.
    const filterFn = (a: IModelFull) => a.state === "notInitialized";
    const { result } = renderHook(() => useIModelFilter(iModels, filterFn));
    expect(result.current.map((iModel) => iModel.id)).toEqual(expected);
  });

  it("do not modify input array", () => {
    const expected = ["1", "2", "3", "4", "5"];
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
    // Show only uninitialized
    const filterFn = (a: IModelFull) => a.state === "notInitialized";
    const { result } = renderHook(() => useIModelFilter(iModels, filterFn));

    expect(result.current).not.toBe(iModels);
    expect(iModels.map((iModel) => iModel.id)).toEqual(expected);
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
    const { result } = renderHook(() => useIModelFilter(iModels, undefined));
    expect(result.current).toBe(iModels);
  });
});
