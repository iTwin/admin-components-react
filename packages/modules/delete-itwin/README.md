# @itwin/delete-itwin-react

## Description

Contains a component to delete an iTwin.

### iTwinUI V3 breaking change

Starting with 1.1.0, the components in this package uses iTwinUI V3.

The styles must be imported separately in the consuming application at the root of the application.
If these styles are not imported, none of the component will be styled as iTwinUI V3 do not fallback on iTwinUI V2 styles. So this step is mandatory.

```tsx
import "@itwin/itwinui-react/styles.css";
```

Please refer to <https://github.com/iTwin/iTwinUI/wiki/iTwinUI-react-v3-migration-guide#styles>, __1322__/_Application using an older version?_  for more details if your application is using iTwinUI V2.

## Development

When making changes to the src, run `rushx start` in the dev folder to enable source watching and rebuild, so the storybook dev-server will have access to updated code on successful code compilation.

## Changelog

See complete CHANGELOG [here](https://github.com/iTwin/admin-components-react/blob/main/packages/modules/delete-itwin/CHANGELOG.md)
