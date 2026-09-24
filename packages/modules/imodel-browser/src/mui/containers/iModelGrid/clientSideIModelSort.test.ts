/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { IModelFull, IModelSortOptions } from "../../../types";
import { clientSideIModelSort } from "./clientSideIModelSort";

const iModel = (props: Partial<IModelFull> & { id: string }): IModelFull =>
  props;

const options = (
  sort: IModelSortOptions,
  requestType: "favorites" | "recents" | "" | undefined = "recents",
  viewMode: "cells" | "tile" | undefined = "tile"
) => ({ viewMode, requestType, sort });

const ids = (iModels: IModelFull[]) => iModels.map((m) => m.id);

describe("clientSideIModelSort", () => {
  describe("name sort", () => {
    const models = [
      iModel({ id: "1", displayName: "Charlie" }),
      iModel({ id: "2", name: "bravo" }), // no displayName, falls back to name
      iModel({ id: "3", displayName: "Alpha" }),
      iModel({ id: "4" }), // no displayName or name, falls back to ""
    ];

    it("sorts ascending by displayName, falling back to name then empty string", () => {
      const result = clientSideIModelSort(
        models,
        options({ sortType: "name", descending: false })
      );

      expect(ids(result)).toEqual(["4", "3", "2", "1"]);
    });

    it("sorts descending", () => {
      const result = clientSideIModelSort(
        models,
        options({ sortType: "name", descending: true })
      );

      expect(ids(result)).toEqual(["1", "2", "3", "4"]);
    });

    it("compares names case-insensitively", () => {
      const result = clientSideIModelSort(
        [
          iModel({ id: "1", displayName: "banana" }),
          iModel({ id: "2", displayName: "APPLE" }),
          iModel({ id: "3", displayName: "Apricot" }),
        ],
        options({ sortType: "name", descending: false })
      );

      expect(ids(result)).toEqual(["2", "3", "1"]);
    });

    it("prefers displayName over name when both are present", () => {
      const result = clientSideIModelSort(
        [
          iModel({ id: "1", displayName: "zulu", name: "alpha" }),
          iModel({ id: "2", displayName: "alpha", name: "zulu" }),
        ],
        options({ sortType: "name", descending: false })
      );

      expect(ids(result)).toEqual(["2", "1"]);
    });
  });

  describe("lastChangesetPushDateTime sort", () => {
    const models = [
      iModel({ id: "1", lastChangesetPushDateTime: "2023-06-15T00:00:00Z" }),
      // no lastChangesetPushDateTime, falls back to createdDateTime
      iModel({
        id: "2",
        lastChangesetPushDateTime: null,
        createdDateTime: "2021-01-01T00:00:00Z",
      }),
      iModel({ id: "3", lastChangesetPushDateTime: "2024-02-01T00:00:00Z" }),
      iModel({ id: "4" }), // neither date, falls back to ""
    ];

    it("sorts ascending by lastChangesetPushDateTime, falling back to createdDateTime then empty string", () => {
      const result = clientSideIModelSort(
        models,
        options({ sortType: "lastChangesetPushDateTime", descending: false })
      );

      expect(ids(result)).toEqual(["4", "2", "1", "3"]);
    });

    it("sorts descending", () => {
      const result = clientSideIModelSort(
        models,
        options({ sortType: "lastChangesetPushDateTime", descending: true })
      );

      expect(ids(result)).toEqual(["3", "1", "2", "4"]);
    });

    it("prefers lastChangesetPushDateTime over createdDateTime when both are present", () => {
      const result = clientSideIModelSort(
        [
          iModel({
            id: "1",
            lastChangesetPushDateTime: "2024-01-01T00:00:00Z",
            createdDateTime: "2020-01-01T00:00:00Z",
          }),
          iModel({
            id: "2",
            lastChangesetPushDateTime: "2022-01-01T00:00:00Z",
            createdDateTime: "2025-01-01T00:00:00Z",
          }),
        ],
        options({ sortType: "lastChangesetPushDateTime", descending: false })
      );

      expect(ids(result)).toEqual(["2", "1"]);
    });
  });

  describe("createdDateTime sort", () => {
    const models = [
      iModel({ id: "1", createdDateTime: "2023-06-15T00:00:00Z" }),
      iModel({ id: "2", createdDateTime: "2021-01-01T00:00:00Z" }),
      iModel({ id: "3" }), // no createdDateTime, falls back to ""
      iModel({ id: "4", createdDateTime: "2024-02-01T00:00:00Z" }),
    ];

    it("sorts ascending by createdDateTime, falling back to empty string", () => {
      const result = clientSideIModelSort(
        models,
        options({ sortType: "createdDateTime", descending: false })
      );

      expect(ids(result)).toEqual(["3", "2", "1", "4"]);
    });

    it("sorts descending", () => {
      const result = clientSideIModelSort(
        models,
        options({ sortType: "createdDateTime", descending: true })
      );

      expect(ids(result)).toEqual(["4", "1", "2", "3"]);
    });

    it("ignores lastChangesetPushDateTime when sorting by createdDateTime", () => {
      const result = clientSideIModelSort(
        [
          iModel({
            id: "1",
            createdDateTime: "2024-01-01T00:00:00Z",
            lastChangesetPushDateTime: "2020-01-01T00:00:00Z",
          }),
          iModel({
            id: "2",
            createdDateTime: "2022-01-01T00:00:00Z",
            lastChangesetPushDateTime: "2025-01-01T00:00:00Z",
          }),
        ],
        options({ sortType: "createdDateTime", descending: false })
      );

      expect(ids(result)).toEqual(["2", "1"]);
    });
  });

  describe("guards", () => {
    const unsorted = [
      iModel({ id: "1", displayName: "zulu" }),
      iModel({ id: "2", displayName: "alpha" }),
    ];
    const sort: IModelSortOptions = { sortType: "name", descending: false };

    it("returns the input unchanged when viewMode is 'cells'", () => {
      const result = clientSideIModelSort(
        unsorted,
        options(sort, "recents", "cells")
      );

      expect(result).toBe(unsorted);
      expect(ids(result)).toEqual(["1", "2"]);
    });

    it.each(["", undefined] as const)(
      "returns the input unchanged when requestType is %p",
      (requestType) => {
        const result = clientSideIModelSort(unsorted, {
          viewMode: "tile",
          requestType,
          sort,
        });

        expect(result).toBe(unsorted);
        expect(ids(result)).toEqual(["1", "2"]);
      }
    );

    it("does not mutate the input array when sorting", () => {
      const input = [...unsorted];

      const result = clientSideIModelSort(input, options(sort, "favorites"));

      expect(result).not.toBe(input);
      expect(ids(input)).toEqual(["1", "2"]);
      expect(ids(result)).toEqual(["2", "1"]);
    });
  });
});
