# Change Log - @itwin/manage-versions-react

This log was last generated on Thu, 30 Nov 2023 12:17:00 GMT and should not be manually modified.

## 1.2.0
Thu, 30 Nov 2023 12:17:00 GMT

### Minor changes

- Show included changesets in Named versions table on expand rows

## 1.1.0
Thu, 16 Nov 2023 11:52:43 GMT

### Minor changes

- Added user column to Named versions and Changeset tables
- Added information panel for changeset

## 1.0.0
Wed, 21 Jun 2023 16:43:17 GMT

### Breaking changes

- iTwinui-react update to 2.x

## 0.8.0
Mon, 27 Feb 2023 09:10:34 GMT

### Minor changes

- Added changed files column in changes tab table

## 0.7.3
Tue, 21 Feb 2023 20:11:46 GMT

### Patches

- Update @itwin/itwinui-react version

## 0.7.2
Fri, 28 Jan 2022 10:41:27 GMT

### Patches

- Upgrade to React 17

## 0.7.1
Thu, 30 Sep 2021 07:34:27 GMT

### Patches

- Moved `ManageVersionsTabs` to regular exports so it could be used when setting `currentTab`.

## 0.7.0
Fri, 30 Jul 2021 05:20:04 GMT

### Minor changes

- Allowing to control current opened tab.

## 0.6.2
Wed, 28 Jul 2021 05:23:14 GMT

### Patches

- Turned off autocomplete, removed workaround for APIM bug when wrong cached changesets were returned, using IconButton in Tables.

## 0.6.1
Thu, 01 Jul 2021 12:45:44 GMT

### Patches

- Fix when old changesets list is returned after Named Version creation.

## 0.6.0
Wed, 30 Jun 2021 12:19:08 GMT

### Minor changes

- Added View column and click handler prop. Currently allowing to view all Named Versions as APIM is missing Checkpoints API.

## 0.5.0
Tue, 22 Jun 2021 07:28:46 GMT

### Minor changes

- Ordering changesets from the newest, changed create version icon, added lazy-loading to versions, other APIM related changes.

## 0.4.1
Fri, 11 Jun 2021 16:24:41 GMT

### Patches

- update license extension

## 0.4.0
Tue, 08 Jun 2021 05:57:26 GMT

### Minor changes

- Added create and update Named Version functionality.

## 0.3.0
Tue, 25 May 2021 12:22:38 GMT

### Minor changes

- Loading all Named Versions and lazy-loading Changesets

## 0.2.0
Tue, 04 May 2021 09:25:11 GMT

### Minor changes

- Initial implementation of manage-versions package. Currently only fetches and shows Named Versions and Changesets.

