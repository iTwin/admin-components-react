/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ConfigProviderProps } from "./common/configContext";
import { defaultStrings } from "./components/ManageVersions/ManageVersions";
import { Changeset, NamedVersion } from "./models";

export const MOCKED_DATE = new Date(2019, 8, 9).toISOString();
export const MOCKED_IMODEL_ID = "80abe4ef-e2cc-4ade-8fad-14546af23fbd";

export const MOCKED_CONFIG_PROPS = {
  accessToken: "Bearer test",
  imodelId: MOCKED_IMODEL_ID,
  stringsOverrides: defaultStrings,
} as ConfigProviderProps;

export const MockedVersion = (
  index = 1,
  props?: Partial<NamedVersion>
): NamedVersion => {
  return {
    id: `nv${index}`,
    displayName: `nv_name${index}`,
    name: `nv_name${index}`,
    description: `nv_description${index}`,
    createdDateTime: MOCKED_DATE,
    _links: {
      changeSet: {
        href: "https://someChangesetUrl.com",
      },
    },
    ...props,
  };
};

export const MockedVersionList = (count = 3) => {
  return [...new Array(count)].map((_, index) => MockedVersion(index));
};

export const MockedChangeset = (
  index = 1,
  props?: Partial<Changeset>
): Changeset => {
  return {
    id: `ch${index}`,
    index: `${index}`,
    displayName: `${index}`,
    description: `ch_description${index}`,
    pushDateTime: MOCKED_DATE,
    synchronizationInfo: { changedFiles: ["test"] },
    _links: {},
    ...props,
  };
};

export const MockedChangesetList = (count = 3) => {
  return [...new Array(count)].map((_, index) => MockedChangeset(index));
};
