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

### iTwinUI V3 breaking change

Starting with 1.3.0, the components in this package uses iTwinUI V3.

The styles must be imported separately in the consuming application at the root of the application.

```tsx
import "@itwin/itwinui-react/styles.css";
```

Importing styles is straightforward if the application migrates to v3 first. However if the application is using an older version of iTwinUI, then you might need to use npm aliases to install `npm:@itwin/itwinui-react@3` under a different name and import `styles.css` from the aliased package.

```tsx
npm install itwinui-react-v3@npm:@itwin/itwinui-react@3
```

```tsx
import 'itwinui-react-v3/styles.css';
```

If these styles are not imported, none of the component will be styled as iTwinUI V3 do not fallback on iTwinUI V2 styles. So this step is mandatory.

## Development

When making changes to the src, run `rushx start` in the dev folder to enable source watching and rebuild, so the storybook dev-server will have access to updated code on successful code compilation.

## Changelog

See complete CHANGELOG [here](https://github.com/iTwin/admin-components-react/blob/main/packages/modules/manage-versions/CHANGELOG.md)
