/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ImageHelper } from "./imageHelper";

describe("ImageHelper", () => {
  it("should return invalid format error", () => {
    let mockFile = { type: "application/x-msdownload" } as File;
    const errorId = "imageWrongFormat";
    let error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(errorId);

    mockFile = { type: "" } as File;
    ImageHelper.validateImage(mockFile);
    error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(errorId);

    mockFile = { type: "application/vnd.ms-excel" } as File;
    ImageHelper.validateImage(mockFile);
    error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(errorId);

    mockFile = { type: "application/zip" } as File;
    ImageHelper.validateImage(mockFile);
    error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(errorId);
  });

  it("should return too large big", () => {
    let mockFile = { size: 5242881, type: "image/png" } as File;
    const errorId = "imageTooBig";
    let error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(errorId);

    mockFile = { size: 8242881, type: "image/jpg" } as File;
    ImageHelper.validateImage(mockFile);
    error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(errorId);
  });

  it("should return undefined on valid image", () => {
    let mockFile = { size: 46512, type: "image/png" } as File;
    let error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(undefined);

    mockFile = { size: 945324, type: "image/jpg" } as File;
    ImageHelper.validateImage(mockFile);
    error = ImageHelper.validateImage(mockFile);
    expect(error).toBe(undefined);
  });
});
