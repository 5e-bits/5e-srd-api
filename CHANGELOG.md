# [3.23.0](https://github.com/5e-bits/5e-srd-api/compare/v3.22.0...v3.23.0) (2025-05-04)


### Features

* **images:** Add /api/images endpoint and use fetch for image fetching ([#750](https://github.com/5e-bits/5e-srd-api/issues/750)) ([fec63b7](https://github.com/5e-bits/5e-srd-api/commit/fec63b78ac075ca8c093896f6bd6c8519ac9870b))

# [3.22.0](https://github.com/5e-bits/5e-srd-api/compare/v3.21.0...v3.22.0) (2025-04-28)


### Features

* **node:** Bump to Node 22 ([#742](https://github.com/5e-bits/5e-srd-api/issues/742)) ([8c27177](https://github.com/5e-bits/5e-srd-api/commit/8c271775661473764295d71bc681a31bda6dd01c))

# [3.21.0](https://github.com/5e-bits/5e-srd-api/compare/v3.20.1...v3.21.0) (2025-04-27)


### Features

* **release:** Convert semver release to use App instead of PAT ([#736](https://github.com/5e-bits/5e-srd-api/issues/736)) ([aad1a29](https://github.com/5e-bits/5e-srd-api/commit/aad1a29c459bed41daa73af09c4d64db9dcab770))

## [3.20.1](https://github.com/5e-bits/5e-srd-api/compare/v3.20.0...v3.20.1) (2025-04-27)


### Bug Fixes

* :bug: Resolve full `Option` objects in `subrace.language_options` resolver ([#735](https://github.com/5e-bits/5e-srd-api/issues/735)) ([ef37127](https://github.com/5e-bits/5e-srd-api/commit/ef37127a68c0303c51d62d21835baa595b742435))

# [3.20.0](https://github.com/5e-bits/5e-srd-api/compare/v3.19.0...v3.20.0) (2025-04-25)


### Bug Fixes

* **release:** Give workflow write permissions ([6c50c47](https://github.com/5e-bits/5e-srd-api/commit/6c50c47f0a599967c8e0ac6cea271452cbf696f9))
* **release:** Set token on checkout ([158dc35](https://github.com/5e-bits/5e-srd-api/commit/158dc35bde5efb687e7c937c038e7ba54e9bc352))
* **release:** Use PAT instead of normal GITHUB_TOKEN ([d518a8d](https://github.com/5e-bits/5e-srd-api/commit/d518a8d8eb1cca5ea399fb3d3ce97c7bd0fba618))


### Features

* **semver:** Updates changelog and npm version on release ([#733](https://github.com/5e-bits/5e-srd-api/issues/733)) ([40f60f3](https://github.com/5e-bits/5e-srd-api/commit/40f60f39ea1ed10d1b2b27f7e53c3d0fe6a7a9be))

# Changelog

## 2020-01-12

- Make GET queries case insensitive for `name` where supported.
- Fix Home link to work when you're on the Docs page

## 2020-01-11

- 100% Test coverage between unit and integration tests
- Overloaded routes will be removed and moved onto routes that make sense.
- General cleanup of the code base and breakup to make testing easier.

## 2020-01-09

- Add in Docker Compose

## 2020-01-08

- Add Prettier for auto formatting
- Add in 404 support to stop timeouts
- Add Heroku badge
- Add in Jest testing framework
- Add Bugsnag for error reporting

## 2020-01-06

- Update current docs to match new database changes

## 2020-01-05

- Fix race and subrace routes (#33)

## 2020-01-04

- Converted number indices to string indices based off of name
- Added a Contribute link for the API
- Move changes to Changelog
- Fixed the navbar for the Docs to use the same partial

## 2020-01-02

- All of the database changes made in the last few months have finally landed
- Replaced Slack chat with <a href="https://discord.gg/TQuYTv7">Discord</a>
- Added some HTTPS support

## 2018-01-07

- The Database and API are now OPEN SOURCE! Find it on my <a href="http://github.com/bagelbits">github</a>
- Updated changes from DevinOchman's <a href="https://github.com/adrpadua/5e-database/pull/3">pull request</a>: New Races, Subraces, Traits

## 2017-04-17

- Created Slack chat group, which you can access <a href="http://dnd-5e-api-slack.herokuapp.com/">here</a>. A place to ask questions and make suggestions etc.
- Updated "url" members of every object to have 'www.' to avoid CORS errors
