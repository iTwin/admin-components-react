# @itwin/imodel-browser-react

## Description

Contains components that let the user browse the iModels of a context and select one.

## Development

When making changes to the src, run `rushx start` in the dev folder to enable source watching and rebuild, so the storybook dev-server will have access to updated code on successful code compilation.

## Content Security Policy for MUI Components

Some MUI components create runtime style elements. Applications with a nonce-based Content Security Policy can pass the current document nonce to `ITwinGridMUI` or `IModelGridMUI`:

```tsx
<IModelGridMUI {...props} nonce={cspNonce} />
```

The nonce must match the value in the document's `style-src` or `style-src-elem` directive..

## Changelog

See complete CHANGELOG [here](https://github.com/iTwin/admin-components-react/blob/main/packages/modules/imodel-browser/CHANGELOG.md)
