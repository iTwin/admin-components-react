# Change Log - @itwin/imodel-browser-react

This log was last generated on Wed, 06 Dec 2023 19:34:14 GMT and should not be manually modified.

## 1.2.0
Wed, 06 Dec 2023 19:34:14 GMT

### Minor changes

- Updated itwinui-react to 3.x

## 1.1.1
Thu, 14 Sep 2023 16:51:06 GMT

### Patches

- Adding default iModel thumbnail for iModel grids in case API fails.

## 1.1.0
Thu, 07 Sep 2023 20:13:33 GMT

### Minor changes

- Ability to limit iModel tiles
- Added table view for itwin grid

## 1.0.1
Wed, 02 Aug 2023 21:41:58 GMT

### Patches

- ThemeProvider fix for Table view

## 1.0.0
Wed, 21 Jun 2023 16:43:17 GMT

### Breaking changes

- Upgraded projects api to iTwins api

### Minor changes

- Added cells view for iModel grid.

## 0.13.3
Thu, 30 Mar 2023 16:02:00 GMT

### Patches

- ProjectGrid - Bug fix for loading skeleton when passing data as props

## 0.13.2
Tue, 21 Feb 2023 20:11:46 GMT

### Patches

- Update @itwin/itwinui-react version

## 0.13.1
Wed, 15 Feb 2023 17:36:15 GMT

### Patches

- Added registeredBy to ProjectFull

## 0.13.0
Fri, 23 Dec 2022 09:19:54 GMT

### Minor changes

- Added new optional property in iModelGrid props to override default no state component

## 0.12.3
Fri, 03 Jun 2022 16:33:25 GMT

### Patches

- Fix trailing ghost cards when using `apiOverrides.data` prop.

## 0.12.2
Fri, 28 Jan 2022 10:41:27 GMT

### Patches

- Upgrade to React 17

## 0.12.1
Wed, 11 Aug 2021 20:01:30 GMT

### Patches

- Use @itwin/itwinui-icons-react instead of @bentley/icons-generic-webfont

## 0.12.0
Tue, 10 Aug 2021 13:28:56 GMT

### Minor changes

- Add `postProcessingCallback` property to `*Grid` components

## 0.11.0
Fri, 06 Aug 2021 13:03:18 GMT

### Minor changes

- iModels API change: property `state` replaces `initialized`

- BREAKING: IModelGrid only support rest API features to reduce complexity; Now only supports `sortOptions` with `sortType: 'name'` (function or other types no longer available), removed `assetId`, `filterOptions`, `iModelOptions` (previously replaced by `iModelActions`)
- IModelGrid will now fetch all iModels with infinite scrolling (previously only top 100)
- BREAKING: ProjectGrid only support rest API features to reduce complexity; Now only supports `filterOptions` with a string (function no longer available), removed `sortOptions`, `projectOptions` (previously replaced by `projectActions`)
- ProjectGrid will now fetch all projects with infinite scrolling (previously only top 100)

## 0.10.4
Wed, 04 Aug 2021 15:08:37 GMT

### Patches

- Disable iModel thumbnail caching and leave it to the network

## 0.10.3
Tue, 08 Jun 2021 16:27:51 GMT

### Patches

- Update serverEnvironmentPrefix to not require the "-"

## 0.10.2
Thu, 27 May 2021 18:16:45 GMT

### Patches

- Add `IModelThumbnail` `classname` prop, remove default `iui-picture` class.

## 0.10.1
Thu, 20 May 2021 18:18:30 GMT

### Patches

- Support progressive Project status API changes

## 0.10.0
Tue, 18 May 2021 20:16:18 GMT

### Minor changes

- Rename iModelOptions and projectOptions to iModelActions and projectActions

## 0.9.0
Fri, 30 Apr 2021 00:07:09 GMT

### Minor changes

- Fix `ProjectGrid`.`onThumbnailClick` argument type.

## 0.8.1
Wed, 21 Apr 2021 19:27:23 GMT

### Patches

- Only download thumbnails if tile is in view
- Abort `fetch` request when unmounting components

## 0.8.0
Tue, 20 Apr 2021 16:34:50 GMT

### Minor changes

- Updated dependency to use @itwin/iTwinUi-* packages

## 0.7.0
Tue, 20 Apr 2021 13:30:06 GMT

### Minor changes

- Add `ProjectGrid` (same features as IModelGrid)

## 0.6.0
Fri, 16 Apr 2021 13:59:05 GMT

### Minor changes

- Add `IModelGrid` filter options

## 0.5.0
Wed, 14 Apr 2021 17:50:21 GMT

### Minor changes

- Add `IModelGrid` sort options

## 0.4.0
Tue, 13 Apr 2021 19:09:57 GMT

### Minor changes

- Add possibility to configure each Tiles in the `IModelGrid`
- Add possibility to configure `Tile` used by `IModelTile` with `tileProps` new prop

## 0.3.0
Fri, 09 Apr 2021 15:38:33 GMT

### Minor changes

- Made `IModelGrid` props `accessToken`, `projectId` and `assetId` not required

## 0.2.1
Thu, 08 Apr 2021 18:18:13 GMT

### Patches

- Add comment

## 0.2.0
Wed, 07 Apr 2021 20:49:45 GMT

### Minor changes

- Add empty state messages to `IModelGrid`
- Add `NoResults` component
- Add `IModelGhostTile` component

## 0.1.1
Wed, 07 Apr 2021 17:37:55 GMT

### Patches

- Initial publish

