# Proposal: Standardizing Commits and Merge Strategy

**Goal:** To improve repository history clarity, enable automated tooling (like automated releases and changelogs), and streamline the integration process.

**Motivation:** Currently, inconsistent commit messages across projects make it difficult to track changes effectively and hinder automated release processes. Additionally, navigating the main branch history can be challenging due to varied merge strategies. This proposal addresses these issues by establishing clear commit messages and branch merging standards.

## 1. Adopt Conventional Commits

**Proposal:** Require all commit messages merged into the main branch to follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Benefits:**

- Clear, readable Git history.
- Enables automated generation of changelogs.
- Enables automated determination of semantic version bumps (MAJOR, MINOR, PATCH).
- Simpler communication about the nature of changes.

**Format:**

```plaintext
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **type:** Must be one of the allowed types (see below).
- **scope (optional):** A noun specifying the section of the codebase affected (e.g., `api`, `ui`, `deps`, `config`). Helps provide context.
  - **Soft Recommendation:** Teams should agree on a set of common scopes relevant to their specific project to ensure consistency (e.g., `auth`, `payments`, `admin-ui`, `docs`, `ci`).
- **description:** A short summary of the code change.
- **body (optional):** A longer description providing context, motivation, etc.
- **footer(s) (optional):** Used for metadata like **BREAKING CHANGES** or linking to issues in tracking systems.

### **Linking Issues (e.g., Linear):**

Effectively linking commits and Pull Requests to issues in tracking systems like Linear is crucial for visibility and automation. Here are common ways to achieve this:

1. **Using Keywords in Commit Footers (via PR Description):**
    - This is the primary method for enabling automated status updates in Linear (and similar tools) when using Conventional Commits and squash merging.
    - Include a footer in your commit message (which, when squash merging, is typically derived from the PR title and description) using specific keywords.
    - **Closing Keywords:** Use these to automatically move the linked Linear issue to "Done" (or your configured completed status) when the commit is merged to the default branch.
        - Examples: `Closes APP-123`, `Fixes LIN-789`
        - Keywords: `close`, `closes`, `closed`, `closing`, `fix`, `fixes`, `fixed`, `fixing`, `resolve`, `resolves`, `resolved`, `resolving`, `complete`, `completes`, `completed`, `completing`
    - **Non-Closing Keywords:** Use these to link the commit/PR to the issue for reference without automatically changing its status.
        - Examples: `Refs APP-456`, `Related to LIN-101`
        - Keywords: `ref`, `references`, `part of`, `related to`, `contributes to`, `towards`
    - *(Multiple issues can be referenced by using separate footers for each, e.g.:)*

        ```plaintext
        feat: implement user profile page

        This new page allows users to view and edit their profiles.

        Closes APP-123
        Refs APP-450

        ```

2. **Referencing Issues in PR Titles or Branch Names:**
    - **PR Titles:** Including an issue ID (e.g., `feat: Implement user profile APP-123`) in the PR title helps visually link the PR to the issue in GitHub. If squash merging using the PR title, this ID can become part of the commit subject.
    - **Branch Names:** Linear often suggests branch names that include the issue ID (e.g., `app-123-add-user-profile` or `username/lin-456-fix-login-bug`). While GitHub and Linear will typically link these branches to the issues automatically, relying solely on the branch name might not trigger automated status changes upon merge. The keywords in the commit message (via PR description) are generally more reliable for automation.

**Recommendation:** For robust automation and clear linking, prioritize using the keyword-based footers in your commit messages (derived from PR descriptions). Using issue IDs in branch names and PR titles is a good secondary practice for visibility.

### Indicating Breaking Changes

A breaking change MUST be indicated in one of two ways:

1. Appending `!` after the `type` and `scope`: `feat(api)!: change user ID format from int to uuid`
2. Adding a footer starting with `BREAKING CHANGE:` (note the space after the colon):

    ```plaintext
    feat(api): change user ID format

    BREAKING CHANGE: User IDs are now UUIDs instead of integers.
    Existing clients querying by integer ID will need to be updated.

    ```

**Common Types:**

- `feat`: A new feature for the user.
- `fix`: A bug fix for the user.
- `build`: Changes that affect the build system or external dependencies.
- `chore`: Other changes that don't modify src or test files (e.g., config, setup).
- `ci`: Changes to CI configuration files and scripts.
- `docs`: Documentation only changes.
- `perf`: A code change that improves performance.
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- `test`: Adding missing tests or correcting existing tests.

### **Enforcement (Optional):**

- Consider adding a PR check using a GitHub Action like [`amannn/action-semantic-pull-request`](https://github.com/amannn/action-semantic-pull-request) to validate PR titles and/or commits against the Conventional Commits format before merging. This is especially useful when squash merging using the PR title.
  - **Example Workflow Snippet (`.github/workflows/pr-lint.yml`):**

      ```yaml
      name: Lint PR

      on:
        pull_request_target:
          types:
            - opened
            - edited
            - synchronize

      permissions:
        pull-requests: read # Needed to read PR title/commits

      jobs:
        lint-pr-title:
          name: Lint PR Title
          runs-on: ubuntu-latest
          steps:
            - uses: amannn/action-semantic-pull-request@v5 # Use specific version
              env:
                GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
              with:
                # Configure types/scopes as needed, defaults are usually fine
                # types: |
                #   feat
                #   fix
                #   chore
                #   ci
                #   docs
                #   perf
                #   refactor
                #   style
                #   test
                #   build
                # requireScope: false
                # Configure which checks to perform (default is title and commits)
                # WIKI: <https://github.com/amannn/action-semantic-pull-request?tab=readme-ov-file#configuration>

      ```

- Optionally, also implement [`commitlint`](https://commitlint.js.org/) with [`husky`](https://typicode.github.io/husky/) for local pre-commit checks to provide earlier feedback to developers.

## 2. Adopt Squash Merging for Pull Requests

**Proposal:** Use the "Squash and merge" strategy as the default (or required) method for merging Pull Requests into the main branch. **Crucially, configure repositories to use the *"Pull request title and description"* option for the automatically generated squash commit message.** This ensures the PR's description, potentially containing `BREAKING CHANGE:` details, is included in the final commit.

**Benefits:**

- Keeps the main branch history linear and clean, with each commit representing a complete feature or fix.
- Combines potentially messy intermediate commits from a feature branch into a single, well-formed commit.
- Works seamlessly with Conventional Commits (the final squashed commit message should follow the convention).

**How it works:**

- All commits from the PR's feature branch are combined into one commit on the base branch (`main`).
- GitHub provides an opportunity to edit the final commit message before merging.
  - **Responsibility:** The person merging the PR should review and potentially edit this message to ensure it accurately reflects the changes and adheres to the Conventional Commit standard (especially the `<type>`, `[optional scope]`, and `<description>`).
- **Tip:** When using the GitHub option to populate the squashed commit message with the PR title and description, starting the PR description (body) with `BREAKING CHANGE: <details>` is a convenient way to ensure the final squashed commit correctly indicates a breaking change.

**Considerations:**

- Loss of granular commit history *within* the feature branch once merged (though the PR itself retains this history).

### Alternatives Considered

Other merge strategies were considered:

- **Merge Commit (no fast-forward):** Preserves all commits from the feature branch along with a merge commit. While retaining full history, it can lead to a complex, non-linear history on the `main` branch, making it harder to navigate and potentially complicating processes like `git bisect`.
- **Rebase and Merge:** Replays feature branch commits onto the `main` branch, creating a linear history *without* a merge commit. This keeps history linear but can obscure the context of which commits belonged to a specific Pull Request.

**Squash and Merge** was chosen for this proposal due to its balance of maintaining a clean, linear, and easily navigable `main` branch history (ideal for understanding deployed changes) while still working effectively with Conventional Commits for automated releases.

## Implementation Recommendations

- **Establish a Rollout Plan:** Define whether this standard applies immediately to new projects and create a timeline for potentially migrating key existing projects.
- **Implement Enforcement Tooling:** Integrate automated checks (e.g., `action-semantic-pull-request` in CI) early to ensure compliance and provide consistent feedback. Consider local hooks (`commitlint`/`husky`) for faster developer feedback loops.
- **Education:** Ensure developers understand the Conventional Commits format and the squash merge workflow. Provide links to documentation and potentially hold brief training sessions.
- **Repository Settings & Enforcement:**
  - Configure individual repository merge settings to default to or require squash merging. Crucially, ensure the repository is set to use the *"Pull request title and description"* option for the automatically generated squash commit message to capture full Conventional Commit details.
  - For broader enforcement at the organization level, utilize GitHub branch rulesets. Create or modify a ruleset that targets your main branches across repositories. Within this ruleset:
    - Enable "Require a pull request before merging."
    - Under "Restrict merge types," select only "Squash and merge." This provides a centralized way to enforce the desired merge strategy.
  - Unfortunately, I’m not sure if there is a way to set using *“Pull request title and description”* at an org level.
