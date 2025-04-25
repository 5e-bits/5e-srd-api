# GitHub App Authentication for Semantic Release

This document outlines the steps to set up a dedicated GitHub App for authenticating the `semantic-release` process in the CI/CD workflow, allowing it to push changes to protected branches without using a Personal Access Token (PAT).

## Phase 1: Create the GitHub App

1.  **Navigate to App Settings:**
    *   Go to GitHub **Settings**.
    *   If the repository belongs to an organization: **Organization Settings** > **Developer settings** > **GitHub Apps**.
    *   If it's a personal repository: **User Settings** > **Developer settings** > **GitHub Apps**.
2.  **New GitHub App:** Click **"New GitHub App"**.
3.  **App Details:**
    *   **GitHub App name:** e.g., `[Repo Name] Semantic Release Bot` (e.g., `5e-srd-api Semantic Release Bot`)
    *   **Homepage URL:** URL of the repository (e.g., `https://github.com/5e-bits/5e-srd-api`)
    *   **Callback URL:** Leave blank.
    *   **Webhook:** **Uncheck** "Active".
4.  **Permissions:** Grant the minimum necessary repository permissions:
    *   **Contents:** `Read and write` (Allows checkout and push)
    *   **Metadata:** `Read-only` (Required by semantic-release)
    *   **Commit statuses:** `Read and write` (Helpful for plugin interactions)
    *   *(Leave all other permissions as "No access")*
5.  **Organization/User Permissions:** Leave as "No access".
6.  **Installation Scope:** Select **"Only on this account"** (or the relevant organization).
7.  **Create:** Click **"Create GitHub App"**.

## Phase 2: Generate and Store Credentials

1.  **App Settings Page:** After creation, you'll be on the App's settings page.
2.  **Generate Private Key:**
    *   Scroll down to **"Private keys"**.
    *   Click **"Generate a private key"**.
    *   A `.pem` file will download immediately. **Save this file securely.**
3.  **Store Private Key as Secret:**
    *   Go to the target repository's **Settings** > **Secrets and variables** > **Actions**.
    *   Click **"New repository secret"**.
    *   **Name:** `APP_PRIVATE_KEY`
    *   **Value:** Paste the **entire contents** of the downloaded `.pem` file (including `-----BEGIN...` and `-----END...` lines).
    *   Click **"Add secret"**.
4.  **Note App ID:** On the App's settings page, find and copy the **"App ID"** (near the top).
5.  **Store App ID as Secret:**
    *   Go back to repository **Secrets** > **Actions**.
    *   Click **"New repository secret"**.
    *   **Name:** `APP_ID`
    *   **Value:** Paste the copied App ID number.
    *   Click **"Add secret"**.

## Phase 3: Install the App on the Repository

1.  **App Settings Page:** On the App's settings page, click **"Install App"** in the sidebar.
2.  **Select Account/Org:** Click **"Install"** next to the relevant user or organization.
3.  **Repository Access:** Choose **"Only select repositories"**.
4.  **Select Repository:** Choose the target repository (e.g., `5e-bits/5e-srd-api`) from the dropdown.
5.  **Install:** Click **"Install"**. Authenticate if prompted.

The App is now created, its credentials secured, and it's installed on the repository. The next step involves modifying the GitHub Actions workflow (`.github/workflows/ci.yml`) to use these credentials for authentication.

## Phase 4: Modify GitHub Actions Workflow

Update the `github-release` job in your `.github/workflows/ci.yml` file to authenticate using the GitHub App secrets instead of the default `GITHUB_TOKEN` or a PAT.

1.  **Add Token Generation Step:** Add a step near the beginning of the `github-release` job to generate a short-lived installation access token using your App ID and private key. We'll use the `tibdex/github-app-token` action for this.
2.  **Use Token for Checkout:** Modify the `actions/checkout` step to use the generated token.
3.  **Use Token for Semantic Release:** Modify the `cycjimmy/semantic-release-action` step to use the generated token in its `GITHUB_TOKEN` environment variable.

Here's how the relevant parts of the `github-release` job should look:

```yaml
  github-release:
    name: Github Release
    runs-on: ubuntu-latest
    needs: [deploy]
    if: ${{ github.event_name == 'push' && github.repository == '5e-bits/5e-srd-api' }}
    outputs:
      new_release_published: ${{ steps.semantic.outputs.new_release_published}}
      version: ${{ steps.semantic.outputs.new_release_version }}
    # Permissions might still be needed depending on other steps,
    # but the App token itself grants necessary repository access.
    # Keep `contents: write` if other steps require it, otherwise it might
    # be removable if only checkout and semantic-release need write access.
    permissions:
      contents: write
      # Add 'id-token: write' if using other OIDC-related actions
    steps:
      # 1. Generate installation token
      - name: Generate GitHub App Token
        id: generate_token
        uses: tibdex/github-app-token@v2 # Use a specific version
        with:
          app_id: ${{ secrets.APP_ID }}
          private_key: ${{ secrets.APP_PRIVATE_KEY }}

      # 2. Use token for checkout
      - name: Checkout latest code
        uses: actions/checkout@v4 # Use a specific version
        with:
          fetch-depth: 0
          token: ${{ steps.generate_token.outputs.token }} # Use generated token

      - name: Install Dependencies
        run: npm ci

      - name: Build Artifacts
        run: |
          npm run bundle-swagger
          npm run gen-postman

      # 3. Use token for semantic-release
      - name: Semantic Release
        id: semantic
        uses: cycjimmy/semantic-release-action@v4 # Use a specific version
        env:
          # Use the generated App token here
          GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }}
          # Make sure other required env vars (like NPM_TOKEN if publishing) are set
```

## Phase 5: Configure Branch Protection / Ruleset Bypass

Finally, ensure your branch protection rule or repository ruleset for the `main` branch allows the specific **GitHub App** you created to bypass the required pull request and status check rules.

1.  Go to repository **Settings** > **Branches** (for rules) or **Settings** > **Rules** > **Rulesets**.
2.  Edit the rule/ruleset protecting the `main` branch.
3.  Find the **Bypass** settings (e.g., "Allow specified actors to bypass required pull requests").
4.  Click **Add bypass** or search the bypass list.
5.  Search for the **name of the GitHub App** you created (e.g., `5e-srd-api Semantic Release Bot`). It should appear, often categorized under "Apps".
6.  Select the App.
7.  Ensure it's allowed to bypass both **Pull request requirements** and **Required status checks**.
8.  Save the changes.

With these steps completed, your workflow will authenticate as the GitHub App, and the branch protections/rulesets will allow that specific App to push the release commit to the `main` branch.
