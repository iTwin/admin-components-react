/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ButtonBar as ButtonBarDefault } from "./components/button-bar";
import { CreateIModel as CreateIModelDefault } from "./components/create-imodel/CreateIModel";
import { IModelDescription as IModelDescriptionDefault } from "./components/imodel-description/IModelDescription";
import { IModelName as IModelNameDefault } from "./components/imodel-name/IModelName";
import { UpdateIModel as UpdateIModelDefault } from "./components/update-imodel/UpdateIModel";
import { UploadImage as UploadImageDefault } from "./components/upload-image/UploadImage";
import { withThemeProvider } from "./utils/WithThemeProvider";

export const CreateIModel = withThemeProvider(CreateIModelDefault);
export type { CreateIModelProps } from "./components/create-imodel/CreateIModel";

export const UpdateIModel = withThemeProvider(UpdateIModelDefault);
export type { UpdateIModelProps } from "./components/update-imodel/UpdateIModel";

export { IModelFull } from "./types";
export type { BaseIModel, iModelExtent, ExtentPoint } from "./types";

export const IModelName = withThemeProvider(IModelNameDefault);

export const IModelDescription = withThemeProvider(IModelDescriptionDefault);

export const UploadImage = withThemeProvider(UploadImageDefault);
export type { UploadImageProps } from "./components/upload-image/UploadImage";

export const ButtonBar = withThemeProvider(ButtonBarDefault);
export type { ButtonBarProps } from "./components/button-bar";

export { useIModelContext } from "./components/context/imodel-context";
