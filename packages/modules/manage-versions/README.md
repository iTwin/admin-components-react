# @itwin/manage-versions-react

## Description

Contains a component that allows a user to manage Named Versions and Changesets.

## Install

```
npm install @itwin/manage-versions-react
```

```
yarn add @itwin/manage-versions-react
```

## Use

```jsx
import { ManageVersions } from "@itwin/manage-versions-react";

const App = () => (
  <ManageVersions
    accessToken="Bearer ..."
    imodelId="d667d711-a0ee-4843-957b-a8c3ed1caad2"
  />
);
```

## Download action

`enableDownload` controls the Download action in a named version's More menu.
It defaults to `true`, preserving existing behavior. Set it to `false` for
experiences that should not offer named-version downloads:

```jsx
<ManageVersions
  accessToken={accessToken}
  imodelId={imodelId}
  enableDownload={false}
/>
```

This only removes the UI action; it does not change API permissions or the
availability of other named-version actions.

## Development

When making changes to the src, run `rushx start` in the dev folder to enable source watching and rebuild, so the storybook dev-server will have access to updated code on successful code compilation.

## Changelog

See complete CHANGELOG [here](https://github.com/iTwin/admin-components-react/blob/main/packages/modules/manage-versions/CHANGELOG.md)
