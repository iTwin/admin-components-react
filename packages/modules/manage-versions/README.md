# @itwin/manage-versions-react

## Description

Contains a component that allows a user to manage Named Versions and Changesets.

Consider this package as unstable until 1.0 release.

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

## Development

When making changes to the src, run `rushx start` in the dev folder to enable source watching and rebuild, so the storybook dev-server will have access to updated code on successful code compilation.

## Changelog

See complete CHANGELOG [here](./CHANGELOG.md)
