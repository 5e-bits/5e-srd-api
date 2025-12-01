# [5.1.0](https://github.com/5e-bits/5e-srd-api/compare/v5.0.0...v5.1.0) (2025-09-15)


### Features

* **2024:** Add equipment and categories ([#815](https://github.com/5e-bits/5e-srd-api/issues/815)) ([81dae46](https://github.com/5e-bits/5e-srd-api/commit/81dae461faa031b93d9c0edf86a458f7c1f3f2c6))

# [5.0.0](https://github.com/5e-bits/5e-srd-api/compare/v4.2.1...v5.0.0) (2025-09-04)


* refactor(race/subrace)!: remove redundant data ([#825](https://github.com/5e-bits/5e-srd-api/issues/825)) ([043fc16](https://github.com/5e-bits/5e-srd-api/commit/043fc160c5f6d41d88a18d8cac11f66f4e2a55d9))


### BREAKING CHANGES

* dropped the `race.starting_proficiencies`,
`race.starting_proficiency_options`, `subrace.starting_proficiencies`,
`subrace.language_options`, and `subrace.languages` properties of all
races and subraces in the database. Clients can instead find this data
on the corresponding traits linked to each race or subrace.

## How was it tested?

I ran the database + API project locally with Docker and called the
endpoints of the various classes and subclasses. I also ran the unit and
integration tests in the API project.

## Is there a Github issue this is resolving?

https://github.com/5e-bits/5e-database/issues/874

## Was any impacted documentation updated to reflect this change?

I touched every reference of the properties in the API project. I took a
look at the docs project, but couldn't fully find my way around the
project to give a clear indication on if anything needed to change.

## Here's a fun image for your troubles
My players once sold an iron pot to well known business woman and secret
member of the Zhentarim and convinced her that it was a magic pot that
can restore spoiled food. They even sneaked into her house to cast
purify food and drink on it to make sure she believed them.
![Iron
Pot](https://github.com/user-attachments/assets/506e3b32-4093-42fd-8fa0-f8fd95bb85cb)

## [5.2.1](https://github.com/5e-bits/5e-srd-api/compare/v5.2.0...v5.2.1) (2025-12-01)


### Bug Fixes

* missing subclass features ([#946](https://github.com/5e-bits/5e-srd-api/issues/946)) ([8170142](https://github.com/5e-bits/5e-srd-api/commit/8170142dfd9cea306773d1942e21aab52d5901d6))

## [5.2.0](https://github.com/5e-bits/5e-srd-api/compare/v5.1.0...v5.2.0) (2025-10-24)


### Features

* **release:** Use release please ([#911](https://github.com/5e-bits/5e-srd-api/issues/911)) ([a8b50dd](https://github.com/5e-bits/5e-srd-api/commit/a8b50dd9256ecf0e5be8517625be839be6e6976e))


### Bug Fixes

* **dependabot:** use build instead of deps ([#920](https://github.com/5e-bits/5e-srd-api/issues/920)) ([52a439d](https://github.com/5e-bits/5e-srd-api/commit/52a439da3855b62291007ff37bfd99650e37c7cb))

## [4.2.1](https://github.com/5e-bits/5e-srd-api/compare/v4.2.0...v4.2.1) (2025-06-23)


### Bug Fixes

* **races:** Language options is optional for graphql ([#807](https://github.com/5e-bits/5e-srd-api/issues/807)) ([2715e0f](https://github.com/5e-bits/5e-srd-api/commit/2715e0f457cc1404b870e4284b53e2ca227a8355))

# [4.2.0](https://github.com/5e-bits/5e-srd-api/compare/v4.1.1...v4.2.0) (2025-06-13)


### Features

* **2024:** Add a bunch of easy endpoints to 2024 ([#800](https://github.com/5e-bits/5e-srd-api/issues/800)) ([2b4871d](https://github.com/5e-bits/5e-srd-api/commit/2b4871da07bea5f8e9d9e907e37e8c4124254cea))

## [4.1.1](https://github.com/5e-bits/5e-srd-api/compare/v4.1.0...v4.1.1) (2025-06-11)


### Bug Fixes

* **graphql:** Spell DC now resolves to Ability Score ([#798](https://github.com/5e-bits/5e-srd-api/issues/798)) ([ddb5c26](https://github.com/5e-bits/5e-srd-api/commit/ddb5c26e7dc1794534bd364bcfa20386793dd35d))

# [4.1.0](https://github.com/5e-bits/5e-srd-api/compare/v4.0.3...v4.1.0) (2025-06-11)


### Features

* **graphql:** Sets up /graphql/2024 endpoint and abstracts shared code ([#790](https://github.com/5e-bits/5e-srd-api/issues/790)) ([acf7780](https://github.com/5e-bits/5e-srd-api/commit/acf7780e301cf1fb2a166eeefd177a8f4225af3b))

## [4.0.3](https://github.com/5e-bits/5e-srd-api/compare/v4.0.2...v4.0.3) (2025-06-05)


### Bug Fixes

* **graphql:** Fix the endpoint for deprecated graphql endpoint ([#791](https://github.com/5e-bits/5e-srd-api/issues/791)) ([2139389](https://github.com/5e-bits/5e-srd-api/commit/2139389d91bfb264acb1929e36a3ebd9ea5b19c2))

## [4.0.2](https://github.com/5e-bits/5e-srd-api/compare/v4.0.1...v4.0.2) (2025-06-02)


### Bug Fixes

* **prettier:** Run prettier against everything ([#780](https://github.com/5e-bits/5e-srd-api/issues/780)) ([01905b2](https://github.com/5e-bits/5e-srd-api/commit/01905b2be462990966e7790b2897aebb1cbe578a))

## [4.0.1](https://github.com/5e-bits/5e-srd-api/compare/v4.0.0...v4.0.1) (2025-06-02)


### Bug Fixes

* **lint:** Fix simple linting rules ([#778](https://github.com/5e-bits/5e-srd-api/issues/778)) ([3c6cc95](https://github.com/5e-bits/5e-srd-api/commit/3c6cc95753f3f485a58f2e2dfe93cebd1de614d2))

# [4.0.0](https://github.com/5e-bits/5e-srd-api/compare/v3.24.0...v4.0.0) (2025-06-01)


* feat(graphql)!: Migrate to typegraphql ([#752](https://github.com/5e-bits/5e-srd-api/issues/752)) ([6bb9e75](https://github.com/5e-bits/5e-srd-api/commit/6bb9e755ea0e35aebe8f2f3bdae0362fa77694e6))


### BREAKING CHANGES

* Some fields are now different but more consistent
across the graphql endpoints.

## What does this do?

* Completely rewrites our entire GraphQL endpoint using `type-graphql`
and `zod`
* Fixes migration errors from the typegoose migration

## How was it tested?

Locally, there are numerous side-by-side comparisons with production.
But it is possible I missed something.

## Is there a Github issue this is resolving?

Nope. I'm just insane.

## Was any impacted documentation updated to reflect this change?

Luckily, GraphQL introspection is self-documenting.

## Here's a fun image for your troubles


![image](https://github.com/user-attachments/assets/22bfa110-aeac-4625-99c6-d57bbc00c4d1)

# [3.24.0](https://github.com/5e-bits/5e-srd-api/compare/v3.23.7...v3.24.0) (2025-05-30)


### Features

* **class:** Add `level` query for class spells for filtering spell level ([#776](https://github.com/5e-bits/5e-srd-api/issues/776)) ([0c41457](https://github.com/5e-bits/5e-srd-api/commit/0c414571ea409c37c15d1b82d1da86844cf18ba9))

## [3.23.7](https://github.com/5e-bits/5e-srd-api/compare/v3.23.6...v3.23.7) (2025-05-08)


### Bug Fixes

* **deploy:** Undo everything from before ([c3c84d1](https://github.com/5e-bits/5e-srd-api/commit/c3c84d1b20ce930ed1afb558c26955a049ca9560))

## [3.23.6](https://github.com/5e-bits/5e-srd-api/compare/v3.23.5...v3.23.6) (2025-05-08)


### Bug Fixes

* **deploy:** Let's try this one more time ([5c5c1cf](https://github.com/5e-bits/5e-srd-api/commit/5c5c1cfa774826837114014e7dbdf9e150e865d3))

## [3.23.5](https://github.com/5e-bits/5e-srd-api/compare/v3.23.4...v3.23.5) (2025-05-08)


### Bug Fixes

* **deploy:** Let's try that again. Now using deploy bot as author ([3f5dfa0](https://github.com/5e-bits/5e-srd-api/commit/3f5dfa04c60144c82086829039edb73a8bc9055e))

## [3.23.4](https://github.com/5e-bits/5e-srd-api/compare/v3.23.3...v3.23.4) (2025-05-08)


### Bug Fixes

* **deploy:** Use deploy bot for authoring commits ([1f62894](https://github.com/5e-bits/5e-srd-api/commit/1f628949cd218d5939dd8b6f68c702f2355761ba))

## [3.23.3](https://github.com/5e-bits/5e-srd-api/compare/v3.23.2...v3.23.3) (2025-05-06)


### Bug Fixes

* **class:** showSpellsForClassAndLevel now gives the spells available at that class level ([#758](https://github.com/5e-bits/5e-srd-api/issues/758)) ([22b1b35](https://github.com/5e-bits/5e-srd-api/commit/22b1b351e7355bcdde04c5fd2fee0c967fb4f2f5))

## [3.23.2](https://github.com/5e-bits/5e-srd-api/compare/v3.23.1...v3.23.2) (2025-05-04)


### Bug Fixes

* **desc:** Fix models to match data reality for desc ([#751](https://github.com/5e-bits/5e-srd-api/issues/751)) ([6bcd610](https://github.com/5e-bits/5e-srd-api/commit/6bcd610df4cccc57d79e8ff3b075fee356c34f04))

## [3.23.1](https://github.com/5e-bits/5e-srd-api/compare/v3.23.0...v3.23.1) (2025-05-04)


### Bug Fixes

* **images:** Fix key for regex ([6f8a99d](https://github.com/5e-bits/5e-srd-api/commit/6f8a99da050ff4ce0c57bfc5377fcdf57b42f60c))

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
