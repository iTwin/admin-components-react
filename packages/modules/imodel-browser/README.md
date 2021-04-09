# Description

Contains components that let the user browse the iModels of a context and select one.

Consider this package as unstable until 1.0 release.

Note: this package is published internally but with the @itwin scope, it might be required to add the following lines to a `.npmrc` file.

    @itwin:registry=https://pkgs.dev.azure.com/bentleycs/_packaging/Packages/npm/registry/
    always-auth=true

# Development

When making changes to the src, run `rushx start` in the dev folder to enable source watching and rebuild, so the storybook dev-server will have access to updated code on succesful code compilation.

# Changelog

See complete CHANGELOG [here](./CHANGELOG.md)
