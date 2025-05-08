# Proposal: Automatic Semantic Versioning and Changelog Generation

**Goal:** To automate the process of versioning, changelog creation, and release tagging based on commit history, reducing manual effort and ensuring consistency.

## Prerequisites

* **Standardized Commits and Merge Strategy:** The practices outlined in `PROPOSAL_COMMITS_MERGE.md` (Standardizing Commits and Merge Strategyg) must be adopted. `semantic-release` relies entirely on the commit messages on the main branch history.
  * Additionally, the optional Enforcement must be enabled.
* **Main Branch Protection:** The main branch should be protected, requiring status checks to pass before merging (this ensures only validated code triggers releases).

## 1. Adopt Semantic Release

**Proposal:** Implement the [`semantic-release`](https://github.com/semantic-release/semantic-release) tool suite to manage releases.

**Benefits:**

* Fully automated version calculation (MAJOR.MINOR.PATCH) based on Conventional Commits.
* Automatic generation of `CHANGELOG.md` entries from commit messages.
* Automatic Git tagging of releases.
* Automatic creation of GitHub Releases with release notes.
* Reduces human error in versioning and changelog maintenance.
* Enforces SemVer compliance.

## 2. Proposed Implementation (using GitHub App)

**Steps:**

1. **Setup GitHub App:** Create a dedicated GitHub App with necessary permissions (`contents: write`, `metadata: read`). (Reference a detailed setup guide if available).
2. **Store Credentials:** Store App ID and Private Key as Organization or Repository Secrets (`APP_ID`, `APP_PRIVATE_KEY`).
3. **Install App:** Install the App on the target repository/repositories.
4. **Configure `semantic-release`:**
    * Install necessary dev dependencies (`semantic-release`, `@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`, `@semantic-release/changelog`, `@semantic-release/npm`, `@semantic-release/git`, `@semantic-release/github`).
    * Create `.releaserc.json` (or equivalent) defining the plugin pipeline (analyze, notes, changelog, npm update, git commit, github release).
5. **Update CI Workflow:**
    * Add a release job triggered on push to the main branch.
    * Use `tibdex/github-app-token` action to generate an App token using secrets.
    * Use the App token for `actions/checkout` and `cycjimmy/semantic-release-action`.
    * Ensure `npm ci` runs before the release action.
6. **Configure Branch Protection/Ruleset Bypass:** Allow the specific GitHub App to bypass required PRs and status checks on the main branch.

## Implementation Considerations

* **Integration with existing build/deploy steps:** Ensure the release job fits correctly within the overall CI/CD pipeline.
* **Handling of pre-releases (optional):** `semantic-release` supports alpha/beta releases on branches other than the main release branch, requiring additional configuration if needed.
* **Monorepo support (if applicable):** Requires additional tooling (e.g., `lerna`, `nx`, `pnpm`) and potentially specific plugins like `semantic-release-monorepo` to manage releases for multiple packages within one repository.
* **Updating Helm Charts:**
  * Chart versions (`appVersion`, potentially `version` in `Chart.yaml`) can be updated automatically.
  * Typically achieved using the `@semantic-release/exec` plugin in the `prepare` step to run a script (e.g., using `yq` or `sed`) that modifies `Chart.yaml` based on the `${nextRelease.version}`.
  * The modified `Chart.yaml` must be included in the `assets` array of the `@semantic-release/git` plugin configuration to be committed.
* **Use with Non-Node.js Projects (e.g., Python):**
  * `semantic-release` (and its plugins) are Node.js applications and **require Node.js/npm in the CI execution environment**.
  * The core principles (Conventional Commits, Git analysis) are language-agnostic.
  * Language-specific packaging steps require replacing or supplementing Node.js plugins:
    * Replace `@semantic-release/npm` with `@semantic-release/exec` to run commands for updating Python version files (e.g., `pyproject.toml`, `setup.py`, `__init__.py`) and for triggering build (`python -m build`) and publish (`twine upload`) commands.
    * Alternatively, investigate community plugins specific to Python packaging (e.g., `semantic-release-pypi`), ensuring they are well-maintained.
    * Plugins like `@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`, `@semantic-release/changelog`, `@semantic-release/git`, and `@semantic-release/github` function normally.
    * Ensure `@semantic-release/git` is configured to commit the language-specific version files.

## Live Examples

For reference, here are some live examples of repositories using `semantic-release`:

* **[5e-srd-api](https://github.com/5e-bits/5e-srd-api)**: This repository itself uses `semantic-release` with GitHub App authentication. You can see:
  * The [CI workflow](https://github.com/5e-bits/5e-srd-api/blob/main/.github/workflows/ci.yml) implementing semantic release
  * The [releases page](https://github.com/5e-bits/5e-srd-api/releases) showing automatically generated releases
  * The [CHANGELOG.md](https://github.com/5e-bits/5e-srd-api/blob/main/CHANGELOG.md) maintained by semantic-release

* **[semantic-release/semantic-release](https://github.com/semantic-release/semantic-release)**: The official repository uses semantic-release to release itself, providing a meta-example of the tool in action.

---
*(This is a starting point - we can add more detail)*
