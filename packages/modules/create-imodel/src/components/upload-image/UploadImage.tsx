/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./UploadImage.scss";

import {
  FileUpload,
  FileUploadTemplate,
  useToaster,
} from "@itwin/itwinui-react";
import React from "react";

import { useIModelContext } from "../context/imodel-context";
import { ImageHelper } from "./imageHelper";

function convertArrayBufferToUrlBase64PNG(buffer: ArrayBuffer) {
  const byteArray = new Uint8Array(buffer);
  if (!byteArray || byteArray.length === 0) {
    throw new Error("Expected an image to be returned from the query");
  }

  const base64Data = btoa(
    byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
  );
  return `data:image/png;base64,${base64Data}`;
}

export type UploadImageProps = {
  /** On image change callback. */
  onChange?: (src: ArrayBuffer, type: string) => void;
  /** Image source. */
  src?: ArrayBuffer;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed with clickable text. */
    uploadLabel?: string;
    /** Displayed suggesting to drap and drop. */
    uploadSubLabel?: string;
    /** Error displayed with image is not png or jpg. */
    imageWrongFormat?: string;
    /** Error displayed when image is over 5MB. */
    imageTooBig?: string;
  };
};

export function UploadImage({
  stringsOverrides,
  onChange,
  src: srcProp,
}: UploadImageProps) {
  const toaster = useToaster();
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [rotation, setRotation] = React.useState(0);

  const updatedStrings = {
    uploadLabel: "Upload an image",
    uploadSubLabel: "or drag and drop it here",
    imageWrongFormat:
      "File format is not supported. Recommended formats are PNG or JPG.",
    imageTooBig: "File is too large. Maximum allowed size is 5MB.",
    ...stringsOverrides,
  };

  const context = useIModelContext();
  const src = srcProp ?? context?.imodel?.thumbnail?.src;

  React.useEffect(() => {
    if (!src) {
      return;
    }

    setImageUrl(convertArrayBufferToUrlBase64PNG(src));
  }, [src]);

  const onFileDrop = (files: FileList) => {
    const file: File = files[0];
    const error = ImageHelper.validateImage(file);
    if (!!error) {
      toaster.negative(updatedStrings[error], {
        hasCloseButton: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.error) {
        toaster.negative(error, {
          hasCloseButton: true,
        });
        return;
      }

      ImageHelper.getOrientation(file, (orientation, fileBytes) => {
        setRotation(ImageHelper.convertRotationToDegrees(orientation));
        setImageUrl(reader.result as string);
        context.onImageChange(fileBytes, file.type);
        onChange?.(fileBytes, file.type);
      });
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileDrop(event.target.files);
    }
  };

  return (
    <FileUpload
      onFileDropped={onFileDrop}
      className="iac-file-upload-container"
    >
      <div className="iac-file-upload-image">
        {imageUrl && <PreviewImage src={imageUrl} rotation={rotation} />}
      </div>
      <FileUploadTemplate
        label={updatedStrings.uploadLabel}
        subtitle={updatedStrings.uploadSubLabel}
        onChange={onFileChange}
        acceptType=".jpeg,.png"
      />
    </FileUpload>
  );
}

type PreviewImageProps = {
  src?: string;
  rotation: number;
};

const PreviewImage = (props: PreviewImageProps) => {
  const { src, rotation } = props;

  const [imageSrc, setImageSrc] = React.useState("");
  const [imageRotation, setImageRotation] = React.useState(0);
  const [fitHorizontally, setFitHorizontally] = React.useState(false);
  const [maxWidth, setMaxWidth] = React.useState<number | undefined>(undefined);
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(
    undefined
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!src) {
      setImageSrc("");
      return;
    }
    const image = new Image();
    image.onload = () => {
      setMaxWidth(undefined);
      setMaxHeight(undefined);
      setFitHorizontally(image.width < image.height);
      const parentElement = containerRef.current?.parentElement;
      if (rotation === 0 || rotation === 180) {
        setImageRotation(rotation);
        setImageSrc(src);
        return;
      }

      if (fitHorizontally) {
        setMaxWidth(parentElement?.clientHeight);
      } else {
        setMaxHeight(parentElement?.clientWidth);
      }
      setImageRotation(rotation);
      setImageSrc(src);
    };
    image.src = src;
  }, [fitHorizontally, rotation, src]);

  return (
    <>
      {imageSrc && (
        <div className="iac-image-container" ref={containerRef}>
          <img
            src={imageSrc}
            style={{
              transform:
                "translate(-50%, -50%) rotate(" + imageRotation + "deg)",
              width: "100%",
              maxHeight: maxHeight ?? !fitHorizontally ? "100%" : undefined,
              maxWidth: maxWidth ?? fitHorizontally ? "100%" : undefined,
            }}
            alt="Cover"
          />
        </div>
      )}
    </>
  );
};
