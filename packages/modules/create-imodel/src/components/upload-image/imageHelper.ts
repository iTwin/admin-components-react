/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export type ImageValidationError = "imageWrongFormat" | "imageTooBig";

export class ImageHelper {
  private static readonly supportedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
  ];
  private static readonly maxFileSize = 5242880;
  private static readonly jpgBeginning = 0xffd8;
  private static readonly exifAPP1Marker = 0xffe1;
  private static readonly intelTypeByteAlign = 0x4949;
  private static readonly exifOrientation = 0x0112;

  public static validateImage(file: File): ImageValidationError | undefined {
    const mimeType = file.type;
    if (!this.supportedTypes.some((type) => type === mimeType)) {
      return "imageWrongFormat";
    }

    if (file.size > this.maxFileSize) {
      return "imageTooBig";
    }

    return undefined;
  }

  // reference https://gist.github.com/diegocr/7dc8bdd02d933afb705c119017aaf601
  public static getOrientation(
    file: File,
    callback: (orientation: number, fileBytes: ArrayBuffer) => void
  ) {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      if (!!fileReader.error) {
        return;
      }

      const fileArray = fileReader.result as ArrayBuffer;
      const scanner = new DataView(fileArray);
      let value = 1; // Non-rotated is the default
      if (
        scanner.byteLength < 2 ||
        scanner.getUint16(0) !== this.jpgBeginning
      ) {
        // Not a JPG
        callback(value, fileArray);
        return;
      }
      let idx = 2;
      let maxBytes = scanner.byteLength;
      let littleEndian = false;
      let foundExif = false;
      while (idx < maxBytes - 2) {
        const uint16 = scanner.getUint16(idx, littleEndian);
        idx += 2;
        // Start of EXIF
        if (uint16 === this.exifAPP1Marker) {
          foundExif = true;
          const endianNess = scanner.getUint16(idx + 8);
          // II (0x4949) Indicates Intel format - Little Endian
          // MM (0x4D4D) Indicates Motorola format - Big Endian
          littleEndian = endianNess === this.intelTypeByteAlign;
          const exifLength = scanner.getUint16(idx, littleEndian);
          maxBytes = exifLength - idx;
          idx += 2;
        } else if (uint16 === this.exifOrientation && foundExif) {
          // Read the value, its 6 bytes further out
          value = scanner.getUint16(idx + 6, littleEndian);
          break;
        }
      }
      if (callback) {
        callback(value, fileArray);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }

  public static convertRotationToDegrees(rotation: number): number {
    let rotationInDegrees = 0;
    switch (rotation) {
      case 8:
        rotationInDegrees = 270;
        break;
      case 6:
        rotationInDegrees = 90;
        break;
      case 3:
        rotationInDegrees = 180;
        break;
      default:
        rotationInDegrees = 0;
    }
    return rotationInDegrees;
  }
}
