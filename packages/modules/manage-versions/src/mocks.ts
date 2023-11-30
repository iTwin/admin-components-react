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
      creator: {
        href: `https://testCreatorUrl.com/<ProjectId>/users/creatorId`,
      },
    },
    createdBy: "Test User",
    changesetIndex: index,
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
    index: index,
    displayName: `${index}`,
    description: `ch_description${index}`,
    pushDateTime: MOCKED_DATE,
    synchronizationInfo: { changedFiles: [`test-file-${index}.dgn`] },
    _links: {},
    creatorId: "creatorId",
    createdBy: "Test User",
    application: { id: `app-${index}`, name: `test-app-${index}` },
    ...props,
  };
};

export const MockedChangesetList = (count = 3) => {
  return [...new Array(count)].map((_, index) => MockedChangeset(index));
};

export const MockedVersionTableData = () => {
  return [
    {
      version: MockedVersion(),
      subRows: [MockedChangeset(1)],
      subRowsLoaded: false,
    },
  ];
};

export const MockedUsers = () => {
  return [
    {
      id: "creatorId",
      givenName: "Test",
      surname: "User",
      email: "test.user@mock.com",
      displayName: "Test User",
    },
    {
      id: "creatorId2",
      givenName: "Test",
      surname: "User2",
      email: "test.user2@mock.com",
      displayName: "Test User2",
    },
  ];
};
