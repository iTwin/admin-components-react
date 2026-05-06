/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DataStatus, ITwinCellColumn } from "@itwin/imodel-browser-react";
import {
  ITwinGridMUI as ExternalComponent,
  IndividualITwinStateHookMUI,
  ITwinGridMUIProps,
} from "@itwin/imodel-browser-react/src/containers/ITwinGrid/ITwinGridMUI";
import { SvgHeart } from "@itwin/itwinui-icons-react";
import {
  Code,
  DropdownButton,
  IconButton,
  MenuItemSkeleton,
} from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React, { PropsWithChildren } from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";
import { ITwinFull } from "@itwin/imodel-browser-react/src";
import { actions } from "@storybook/addon-actions";
import {
  Button,
  Chip,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { ITwinTileMUI } from "@itwin/imodel-browser-react/src/containers/ITwinGrid/ITwinTileMUI";

interface IModelMinimal {
  id: string;
  displayName: string;
}
interface IModelsFetchData {
  iModels: IModelMinimal[];
  _links: {
    prev: { href: string };
    next: { href: string };
    self: { href: string };
  };
}

/** Function used in useIndividualState */
const buildMenuItems =
  (
    close: () => void,
    setVersion: React.Dispatch<React.SetStateAction<IModelMinimal | undefined>>
  ) =>
  (v: IModelMinimal) => (
    <span
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {v.id === "loading" ? (
        <MenuItem>
          <Skeleton variant="rectangular" width="100%" height={24} />
        </MenuItem>
      ) : (
        <MenuItem
          key={v.id}
          onClick={() => {
            close();
            v.id !== "loading" && setVersion(v);
          }}
        >
          {v.displayName}
        </MenuItem>
      )}
    </span>
  );

type ITwinTileMUIProps = React.ComponentPropsWithoutRef<typeof ITwinTileMUI>;

/** Hook used in StatefulPropsOverrides.args, the function itself must be a stable reference as it is a hook. */
export const useIndividualState: IndividualITwinStateHookMUI = (
  iTwin,
  props
) => {
  const [selection, setSelection] = React.useState<IModelMinimal | undefined>();
  const [imodels, setIModels] = React.useState<IModelMinimal[] | undefined>();

  // We delay network call until the user wants to query the data, this could be in an effect
  // but would automatically trigger for EVERY project, causing potentially huge network traffic at startup.
  const fetchIModelList = React.useCallback(
    async (
      url = `https://${
        props.gridProps.apiOverrides?.serverEnvironmentPrefix
          ? `${props.gridProps.apiOverrides?.serverEnvironmentPrefix}-`
          : ""
      }api.bentley.com/imodels/?iTwinId=${iTwin.id}&$top=10`
    ) => {
      try {
        // Show the skeleton, plus prevent further calls to this function.
        setIModels([
          {
            id: "loading",
            displayName: "",
          },
        ]);

        // Start the fetch
        const response = await fetch(url, {
          headers: {
            Authorization: (props.gridProps.accessToken as string) ?? "",
            Prefer: "return=minimal",
          },
        });
        if (response.ok) {
          const data: IModelsFetchData = await response.json();
          setIModels(data.iModels);

          if (data.iModels.length === 0) {
            setSelection({ displayName: "No iModels created", id: "none" });
          }
        }
      } catch (error) {
        // If an error occurs, clear the versions so they will be fetched again.
        setIModels(undefined);
        console.error(error);
      }
    },
    [
      iTwin.id,
      props.gridProps.accessToken,
      props.gridProps.apiOverrides?.serverEnvironmentPrefix,
    ]
  );
  // Create a memo of the tileProps we want to override, depending on the state.
  const tileProps = React.useMemo<Partial<ITwinTileMUIProps>>(
    () => ({
      actions:
        selection && selection.id !== "none" ? (
          <>
            <Button key="Create">Create IModel</Button>,
            <Button key="Open">Open IModel</Button>,
          </>
        ) : (
          <Button key="Create">Create IModel</Button>
        ),
      additionalContent: (
        <span
          onClick={() => {
            imodels === undefined && fetchIModelList();
          }}
        >
          <Select
            label="Select iModel..."
            displayEmpty
            value={selection?.id ?? ""}
          >
            {imodels?.map(buildMenuItems(() => {}, setSelection)) ?? []}
          </Select>
        </span>
      ),
    }),
    [selection, imodels, fetchIModelList]
  );
  // TODO: verify
  return {
    ...props,
    ...tileProps,
  };
};
