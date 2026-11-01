#!/usr/bin/env bash
# Release Please skips rewriting an open release PR whose notes and version are
# unchanged ("PR #N remained the same"). If it built the PR from a stale read of
# main, package.json dependency changes get reverted and never repaired,
# leaving pnpm-lock.yaml out of sync.
#
# Restore each package.json from main, then re-apply the version Release Please
# recorded in the manifest. Release Please owns only the version, CHANGELOG.md
# and the manifest, so those are left alone.
#
# Expects `origin` to be pushable and a git identity to be configured.
set -euo pipefail

# Wrapped in a function so bash parses the whole script before the checkout
# below swaps the working tree (the release branch may not contain this file).
main() {
  BASE_BRANCH="${BASE_BRANCH:-main}"
  RELEASE_BRANCH="${RELEASE_BRANCH:-release-please--branches--main}"

  git fetch --quiet origin "$BASE_BRANCH"
  if ! git fetch --quiet origin "$RELEASE_BRANCH" 2>/dev/null; then
    echo "No $RELEASE_BRANCH branch, nothing to repair."
    exit 0
  fi

  git checkout --quiet -B "$RELEASE_BRANCH" "origin/$RELEASE_BRANCH"

  # "<path> <version>" per package in the release branch's manifest.
  packages="$(node -e '
    const manifest = require("./.release-please-manifest.json");
    for (const [path, version] of Object.entries(manifest)) console.log(path, version);
  ')"

  while read -r path version; do
    pkg="$path/package.json"
    git checkout "origin/$BASE_BRANCH" -- "$pkg"
    (cd "$path" && npm pkg set "version=$version" >/dev/null)
  done <<< "$packages"

  if git diff --quiet HEAD; then
    echo "$RELEASE_BRANCH matches $BASE_BRANCH apart from versions, nothing to repair."
    exit 0
  fi

  git diff --stat HEAD
  git commit --quiet -a \
    -m "fix: restore package.json dependencies from $BASE_BRANCH" \
    -m "Release Please built this branch from a stale read of $BASE_BRANCH and does not rewrite an unchanged release PR, so the stale package.json stuck."
  git push origin "HEAD:$RELEASE_BRANCH"
}

main "$@"
