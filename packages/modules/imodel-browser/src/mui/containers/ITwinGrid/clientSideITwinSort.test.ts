/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { ITwinFull } from "../../../types";
import type { ITwinSortOptionsMUI } from "../../types";
import { clientSideITwinSort } from "./clientSideITwinSort";

const iTwin = (props: Partial<ITwinFull> & { id: string }): ITwinFull => props;

const options = (
  sort: ITwinSortOptionsMUI | undefined,
  requestType: "favorites" | "recents" | "" | undefined = "recents",
  viewMode: "cells" | "tile" | undefined = "tile"
) => ({ viewMode, requestType, sort });

const ids = (iTwins: ITwinFull[]) => iTwins.map((t) => t.id);

describe("clientSideITwinSort", () => {
  describe("displayName sort", () => {
    const iTwins = [
      iTwin({ id: "1", displayName: "Charlie" }),
      iTwin({ id: "2", displayName: "bravo" }),
      iTwin({ id: "3", displayName: "Alpha" }),
      iTwin({ id: "4" }), // no displayName, falls back to ""
    ];

    it("sorts ascending case-insensitively, falling back to empty string", () => {
      const result = clientSideITwinSort(
        iTwins,
        options({ field: "displayName", direction: "asc" })
      );

      expect(ids(result)).toEqual(["4", "3", "2", "1"]);
    });

    it("sorts descending", () => {
      const result = clientSideITwinSort(
        iTwins,
        options({ field: "displayName", direction: "desc" })
      );

      expect(ids(result)).toEqual(["1", "2", "3", "4"]);
    });
  });

  describe("number sort", () => {
    it("sorts by number", () => {
      const result = clientSideITwinSort(
        [
          iTwin({ id: "1", number: "300" }),
          iTwin({ id: "2", number: "100" }),
          iTwin({ id: "3", number: "200" }),
        ],
        options({ field: "number", direction: "asc" })
      );

      expect(ids(result)).toEqual(["2", "3", "1"]);
    });
  });

  describe("lastModifiedDateTime sort", () => {
    it("sorts by lastModifiedDateTime", () => {
      const result = clientSideITwinSort(
        [
          iTwin({ id: "1", lastModifiedDateTime: "2024-03-01T00:00:00Z" }),
          iTwin({ id: "2", lastModifiedDateTime: "2024-01-01T00:00:00Z" }),
          iTwin({ id: "3", lastModifiedDateTime: "2024-02-01T00:00:00Z" }),
        ],
        options({ field: "lastModifiedDateTime", direction: "desc" })
      );

      expect(ids(result)).toEqual(["1", "3", "2"]);
    });
  });

  describe("skip conditions", () => {
    const unsorted = [
      iTwin({ id: "1", displayName: "b" }),
      iTwin({ id: "2", displayName: "a" }),
    ];
    const sort: ITwinSortOptionsMUI = {
      field: "displayName",
      direction: "asc",
    };

    it("does not sort in cells view", () => {
      const result = clientSideITwinSort(
        unsorted,
        options(sort, "recents", "cells")
      );

      expect(ids(result)).toEqual(["1", "2"]);
    });

    it.each(["", undefined] as const)(
      "does not sort when requestType is %p",
      (requestType) => {
        const result = clientSideITwinSort(unsorted, {
          viewMode: "tile",
          requestType,
          sort,
        });

        expect(ids(result)).toEqual(["1", "2"]);
      }
    );

    it("does not sort when sort is undefined", () => {
      const result = clientSideITwinSort(unsorted, options(undefined));

      expect(ids(result)).toEqual(["1", "2"]);
    });

    it("sorts for favorites", () => {
      const result = clientSideITwinSort(unsorted, options(sort, "favorites"));

      expect(ids(result)).toEqual(["2", "1"]);
    });

    it("does not mutate the input array", () => {
      const input = [...unsorted];
      clientSideITwinSort(input, options(sort));

      expect(ids(input)).toEqual(["1", "2"]);
    });
  });
});
