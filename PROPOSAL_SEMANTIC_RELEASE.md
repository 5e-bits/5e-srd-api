# Proposal: Automatic Semantic Versioning and Changelog Generation

**Goal:** To automate the process of versioning, changelog creation, and release tagging based on commit history, reducing manual effort and ensuring consistency.

**Motivation:** Picking the correct version number and keeping the changelog up to date are annoying and error-prone. This proposal automates that process.

## Prerequisites

- **Standardized Commits and Merge Strategy:** The practices outlined in [Standardizing Commits and Merge Strategy](https://www.notion.so/Standardize-Commits-and-Merge-Strategy-1e0c967bdf0980ff9b2dfe429f4f9f15?pvs=21) must be adopted. `semantic-release` relies entirely on the commit messages in the main branch history.
    - Additionally, the optional Enforcement must be enabled.
- **Main Branch Protection:** The main branch should be protected, requiring status checks to pass before merging (this ensures only validated code triggers releases).

## Proposal

### 1. Adopt Semantic Release

**Proposal:** Implement the [`semantic-release`](https://github.com/semantic-release/semantic-release) tool suite to manage releases.

**Benefits:**

- Fully automated version calculation (MAJOR.MINOR.PATCH) based on Conventional Commits.
- Automatic generation of `CHANGELOG.md` entries from commit messages.
- Automatic Git tagging of releases.
- Automatic creation of GitHub Releases with release notes.
- Reduces human error in versioning and changelog maintenance.
- Enforces SemVer compliance.

### 2. Proposed Implementation (using GitHub App)

**Steps:**

1. **Setup GitHub App:** Create a dedicated GitHub App with necessary permissions (`contents: write`, `metadata: read`).
2. **Store Credentials:** Store App ID and Private Key as Organization or Repository Secrets (`SEMANTIC_RELEASE_APP_ID`, `SEMANTIC_RELEASE_APP_PRIVATE_KEY`).
3. **Install App:** Install the App on the target repository/repositories.
4. **Configure `semantic-release`:**
    - Install necessary dev dependencies (`semantic-release`, `@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`, `@semantic-release/changelog`, `@semantic-release/npm`, `@semantic-release/git`, `@semantic-release/github`).
    - Create `.releaserc.json` (or equivalent) defining the plugin pipeline (analyze, notes, changelog, npm update, git commit, github release).
5. **Update CI Workflow:**
    - Add a release job triggered manually via workflow_dispatch
    - Use `tibdex/github-app-token` action to generate an App token using secrets.
    - Use the App token for `actions/checkout` and `cycjimmy/semantic-release-action`.
    - Ensure `npm ci` runs before the release action.
6. **Configure Branch Protection/Ruleset Bypass:** Allow the specific GitHub App to bypass required PRs and status checks on the main branch. This is necessary to allow the release job to push no CI version commits to the main branch.

## Implementation Considerations

- **Integration with existing build/deploy steps:** Ensure the release job fits correctly within the overall CI/CD pipeline.
- **Handling of pre-releases (optional):** `semantic-release` supports alpha/beta releases on branches other than the main release branch, requiring additional configuration if needed.
- **Monorepo support (if applicable):** This requires additional tooling (e.g., Lerna, nx, p`pm`) and potentially specific plugins like `semantic-release-monorepo` to manage releases for multiple packages within one repository.
    - For monorepos, alternatives like `release, please` also offer robust, built-in support for managing independent package releases, which may be worth considering.
- **Updating Helm Charts:**
    - Chart versions (`appVersion`, potentially `version` in `Chart.yaml`) can be updated automatically.
    - Typically achieved using the `@semantic-release/exec` plugin in the `prepare` step to run a script (e.g., using `yq` or `sed`) that modifies `Chart.yaml` based on the `${nextRelease.version}`.
    - To be committed, the modified Chart.yaml must be included in the assets array of the @semantic-release/git plugin configuration.
- **Use with Non-Node.js Projects (e.g., Python):**
    - `semantic-release` (and its plugins) are Node.js applications. `cycjimmy/semantic-release-action` provides the necessary Node.js execution environment, so your project does not need its own `package.json` or Node.js setup for `semantic-release` to function.
    - The core principles (Conventional Commits, Git analysis) are language-agnostic.
    - To customize the release process (e.g., versioning Python files using `@semantic-release/exec` and avoiding npm publishing), you will define your plugin pipeline in a `semantic-release` configuration file (e.g., `.releaserc.json`) in your repository.

        **Example `.releaserc.json` for a Python project:**

        ```json
        {
          "branches": ["main"], // This can also be configured via the action's `branches` input
          "plugins": [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            "@semantic-release/changelog",
            // Use @semantic-release/exec for language-specific versioning and publishing
            ["@semantic-release/exec", {
              "prepareCmd": "poetry version ${nextRelease.version} && poetry build", // Example for Poetry
              "publishCmd": "poetry publish --username __token__ --password ${process.env.PYPI_TOKEN}" // Example
            }],
            ["@semantic-release/git", {
              "assets": ["pyproject.toml", "CHANGELOG.md"], // Commit updated Python project file and changelog
              "message": "chore(release): ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}"
            }],
            "@semantic-release/github" // Create a GitHub release
          ]
        }

        ```

    - Your GitHub Actions workflow would then use `cycjimmy/semantic-release-action` like this:

        ```yaml
            # Ensure you have a step to generate the GITHUB_TOKEN if needed, e.g., from a GitHub App
            # - name: Generate GitHub App Token
            #   id: generate_token
            #   uses: tibdex/github-app-token@vX.Y.Z
            #   with:
            #     app_id: ${{ secrets.SEMANTIC_RELEASE_APP_ID }}
            #     private_key: ${{ secrets.SEMANTIC_RELEASE_APP_PRIVATE_KEY }}

            - name: Semantic Release for Python Project
              uses: cycjimmy/semantic-release-action@v4.2.0 # Specify a version
              with:
                # Pin the version of semantic-release itself
                semantic_release_version: "^23.0.0" # Specify your desired semantic-release version range
                # Ensure any plugins from .releaserc.json not bundled by the action are installed,
                # and pin their versions.
                extra_plugins: |
                  @semantic-release/changelog@^6.0.0
                  @semantic-release/git@^10.0.0
                  @semantic-release/exec@^9.0.0
                # dry_run: false # Set to true for testing
                # Action inputs can complement or override .releaserc.json settings if they map to CLI options.
                # For example, if "branches" is not in .releaserc.json or you want to override:
                # branches: main
                # dry_run: false # Set to true for testing
              env:
                GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }} # Or ${{ secrets.GITHUB_TOKEN }} if using the default token
                # PYPI_TOKEN: ${{ secrets.PYPI_TOKEN }} # Token for publishing to PyPI, used by publishCmd

        ```

    - This approach correctly separates your project's non-JS nature from the Node.js tooling of `semantic-release`, while giving you full control over the release steps via the configuration file and ensuring version stability.
    - Language-specific packaging steps require replacing or supplementing Node.js plugins (like `@semantic-release/npm`) primarily through `@semantic-release/exec` or dedicated community plugins (e.g., `semantic-release-pypi`, ensuring they are well-maintained and compatible).
- **Dry Runs for Testing:**
    - **Crucial for Setup and Changes:** Before letting `semantic-release` make any actual changes, always test your configuration using a dry run. This simulates the entire release process (analyzing commits, determining the next version, generating notes) but *does not* create tags, make commits, publish to npm, or create GitHub releases.
    - **How to Enable:**
        - In your `semantic-release` configuration file (e.g., `.releaserc.json`), set the top-level `dryRun` option: `"dryRun": true`.
        - Alternatively, if using `cycjimmy/semantic-release-action`, you can pass it as an input: `with: { dry_run: true }`.
        - When running locally for testing: `npx semantic-release --dry-run`.
    - **Verification:** Check the CI logs from the dry run to ensure the determined next version is correct, commit messages are parsed as expected, and release notes look good.
- **Initial Release and Existing Tags:**
    - **How `semantic-release` Finds the Last Release:** By default, `semantic-release` determines the last release by finding the Git tag with the highest version number on the current branch that is a valid SemVer tag (e.g., `v1.2.3`, `v2.0.0`, or a pre-release like `v2.1.0-alpha.1`). It then analyzes commits made *after* this tag to determine the next version.
    - **Impact of Existing Tags (e.g., `v2.1.81-release.1` which are SemVer pre-releases, or truly non-standard tags):**
        - **Valid Pre-release Tags:** If your latest tags are valid SemVer pre-releases (e.g., `v2.1.81-release.1`), `semantic-release` will parse them correctly.
            - On a pre-release configured branch, it may increment the pre-release identifier (e.g., to `v2.1.81-release.2`).
            - On a stable release branch (like `main`), it will typically aim to graduate to the stable version (e.g., `v2.1.81`) or a subsequent stable version (`v2.2.0`, `v3.0.0`) based on new commits since the pre-release series began for `v2.1.81`. It generally does not continue pre-release numbering on a stable branch unless explicitly configured to do so.
        - **Truly Non-Standard/Non-SemVer Tags:** If your repository has tags that *do not* conform to SemVer (e.g., `release-candidate-5`, `build-2024-05-10`), `semantic-release`'s default `tagFormat` (which expects `${version}` resolving to `v${version}`) will likely fail to parse them.
        - **Consequences of Unparsable Tags:** If `semantic-release` cannot find or parse any tags it considers valid SemVer on the branch, it may analyze *all* commits on that branch to determine the first version (often `1.0.0` if new features or breaking changes are found, or `0.1.0` for fixes).
        - The first `semantic-release` generated version might not align with your existing tagging system if it consists of unparsable tags or if you are on a stable branch with only pre-release tags.
    - **Options for Transitioning:**
        1. **For Valid Pre-Release Tags on Stable Branch:** If your `main` branch's latest tags are like `v2.1.81-release.1`, ensure your commit messages since that tag correctly signal a stable release (e.g., no pre-release identifiers in commits if you use a pre-release channel). `semantic-release` should then propose `v2.1.81` or a higher stable version. No special `tagFormat` is usually needed if the pre-release tags are standard.
        2. **For Truly Non-Standard/Non-SemVer Tags - Customize `tagFormat`:** This is advanced. You can configure `semantic-release` with a custom `tagFormat` to parse non-SemVer tags. However, this does not make them SemVer-compliant for comparison, and `semantic-release` might still struggle to determine a logical next SemVer version.
    - **Recommendation:**
        - If your latest tags are SemVer pre-releases (like `v2.1.81-release.1`) on your stable release branch, ensure subsequent commits are standard Conventional Commits and let `semantic-release` determine the next stable version. Test with a **Dry Run**.

## Live Examples

For reference, here are some live examples of repositories using `semantic-release`:

- [**5e-srd-api**](https://github.com/5e-bits/5e-srd-api): This repository itself uses `semantic-release` with GitHub App authentication. You can see:
    - The [CI workflow](https://github.com/5e-bits/5e-srd-api/blob/main/.github/workflows/ci.yml) implementing semantic release
    - The [releases page](https://github.com/5e-bits/5e-srd-api/releases) showing automatically generated releases
    - The [CHANGELOG.md](https://github.com/5e-bits/5e-srd-api/blob/main/CHANGELOG.md) maintained by semantic-release
- [**semantic-release/semantic-release**](https://github.com/semantic-release/semantic-release): The official repository uses semantic-release to release itself, providing a meta-example of the tool in action.

## Example Configurations

### `.releaserc.json`

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "CHANGELOG.md", "helm/Chart.yaml"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}"
      }
    ]
  ],
  "branches": ["main"]
}

```

### GitHub Actions Workflow Example

This example assumes your detailed plugin pipeline, asset definitions, and branch configurations are defined in your `.releaserc.json` file as shown in the section above. The workflow focuses on invoking `semantic-release` with proper authentication and version pinning.

```yaml
github-release:
  name: Github Release
  runs-on: ubuntu-latest
  needs: [deploy]
  # Manual trigger
  if: ${{ github.event_name == 'workflow_dispatch' && github.repository == '5e-bits/5e-srd-api' }}
  outputs:
    new_release_published: ${{ steps.semantic.outputs.new_release_published}}
    version: ${{ steps.semantic.outputs.new_release_version }}
  permissions:
    contents: write
  steps:
    - name: Generate GitHub App Token
      id: generate_token
      uses: tibdex/github-app-token@vX.Y.Z # Pin to a specific version
      with:
        app_id: ${{ secrets.SEMANTIC_RELEASE_APP_ID }}
        private_key: ${{ secrets.SEMANTIC_RELEASE_APP_PRIVATE_KEY }}
    - name: Checkout latest code
      uses: actions/checkout@vX.Y.Z # Pin to a specific version
      with:
        fetch-depth: 0
        token: ${{ steps.generate_token.outputs.token }}
    - name: Use Node.js 22.x
      uses: actions/setup-node@vX.Y.Z # Pin to a specific version
      with:
        node-version: 22.x
    - name: Install Dependencies
      run: npm ci
    - name: Build Artifacts
      run: |
        npm run bundle-swagger
        npm run gen-postman
    - name: Semantic Release
      id: semantic
      uses: cycjimmy/semantic-release-action@v4.2.0 # Pin to a specific version
      env:
        GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }} # Required if publishing to npm

```

These configurations demonstrate:

- Reliance on `.releaserc.json` for detailed plugin and asset configuration.
- GitHub App authentication for secure token generation.
- Proper artifact building and inclusion in releases
- Integration with the existing CI/CD pipeline

### NPM Publishing Configuration

To enable automatic npm publishing with semantic-release:

1. **NPM Token Setup:**
    - Create an NPM access token with publish permissions
    - Add the token as an organization or repository secret: `NPM_TOKEN`
    - The token should be scoped to the specific package(s) being published
2. **Package.json Requirements:**
    - Ensure `package.json` has:
        - `name`: The npm package name
        - `version`: Initial version (will be managed by semantic-release)
        - `private`: false (if you want to publish)
        - `publishConfig`: Optional configuration for publishing

    ```json
    {
      "name": "@5e-bits/5e-srd-api",
      "version": "1.0.0",
      "private": false,
      "publishConfig": {
        "access": "public"
      }
    }

    ```

3. **CI Workflow Updates:**
    - Add the NPM token to the semantic-release step:

    ```yaml
    - name: Semantic Release
      env:
        GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

    ```


The `@semantic-release/npm` plugin will automatically:

- Update the version in `package.json`
- Publish to npm when a new version is released
- Handle pre-releases if configured

## Alternatives Considered

Before deciding on `semantic-release`, other tools and approaches for automating versioning and changelog generation were evaluated. These included:

- **Manual Scripting:**
    - *Pros:* Full control over the process.
    - *Cons:* High maintenance overhead, error-prone, requires significant development effort to build and maintain robustly.
- **`release-please`:**
    - *Pros:* Strong built-in monorepo support.
    - *Cons:* Release PRs is a very different process than the one we use now.

**Reasoning for Choosing `semantic-release`:**

`semantic-release` was chosen for this project due to its mature and highly extensible plugin ecosystem, which offers fine-grained control over the release process. This flexibility is particularly beneficial for integrating with various project types (Node.js, Python, Helm charts as demonstrated in this proposal) and customizing steps like asset preparation, version file updates, and changelog generation to fit specific needs. The direct "push-and-release" workflow aligns well with CI/CD practices that emphasize rapid, automated deployments following merges to the main branch.

While `semantic-release` requires additional tooling or plugins for complex monorepo scenarios, its core functionality and available extensions provide a robust solution for many use cases.

It's important to note that `release-please` is a strong and viable alternative, especially for projects with complex monorepo structures where its built-in manifest-based configuration and "Release PR" workflow can offer significant advantages in managing independent package releases. For this particular proposal, the extensive plugin architecture of `semantic-release` was deemed a better fit for the immediate integration requirements. However, `release-please` remains a noteworthy option for future consideration, especially if monorepo management needs evolve.
