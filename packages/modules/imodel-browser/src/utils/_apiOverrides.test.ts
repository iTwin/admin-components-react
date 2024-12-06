/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { _getAPIServer, _mergeStrings } from "./_apiOverrides";

describe("apiOverrides", () => {
  describe("getAPIServer", () => {
    it("returns https://api.bentley.com with empty serverEnvironmentPrefix", () => {
      const result = _getAPIServer("");

      expect(result).toEqual("https://api.bentley.com");
    });
    it("returns https://[prefix]-api.bentley.com when provided with [prefix]", () => {
      const result = _getAPIServer("qa");

      expect(result).toEqual("https://qa-api.bentley.com");
    });
    it("handles undefined overrides", () => {
      const result = _getAPIServer(undefined);

      expect(result).toEqual("https://api.bentley.com");
    });
  });
  describe("mergeStrings", () => {
    it("overrides all provided string with a value", () => {
      const overrides = {
        a: "a",
        b: "b",
      };
      const defaults = {
        a: "defaultA",
        b: "defaultB",
      };
      const results = _mergeStrings(defaults, overrides);
      expect(results.a).toEqual("a");
      expect(results.b).toEqual("b");
    });
    it("keep original when provided a null/undefined value", () => {
      const overrides = {
        a: undefined,
        b: "b",
      };
      const defaults = {
        a: "defaultA",
        b: "defaultB",
      };
      const results = _mergeStrings(defaults, overrides);
      expect(results.a).toEqual("defaultA");
      expect(results.b).toEqual("b");
    });
    it("keep original if property is not provided", () => {
      const overrides = {
        b: "b",
      };
      const defaults = {
        a: "defaultA",
        b: "defaultB",
      };
      const results = _mergeStrings(defaults, overrides);
      expect(results.a).toEqual("defaultA");
      expect(results.b).toEqual("b");
    });
    it("handles undefined override", () => {
      const defaults = {
        a: "defaultA",
        b: "defaultB",
      };
      const results = _mergeStrings(defaults, undefined);
      expect(results.a).toEqual("defaultA");
      expect(results.b).toEqual("defaultB");
    });
    it("do not modify inputs", () => {
      const overrides = {
        a: "a",
        b: "b",
      };
      const defaults = {
        a: "defaultA",
        b: "defaultB",
      };
      _mergeStrings(defaults, overrides);
      expect(overrides.a).toEqual("a");
      expect(overrides.b).toEqual("b");
      expect(defaults.a).toEqual("defaultA");
      expect(defaults.b).toEqual("defaultB");
    });
  });
});
