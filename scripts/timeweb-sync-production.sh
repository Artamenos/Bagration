#!/bin/sh

set -eu
umask 077

base="$HOME/Bagration"
public="$base/public_html"
repository="$base/.production.git"
releases="$base/releases"
remote="https://github.com/Artamenos/Bagration.git"
lock_file="$base/.production-deploy.lock"

mkdir -p "$base" "$releases"

if command -v flock >/dev/null 2>&1; then
  exec 9>"$lock_file"
  flock -n 9 || exit 0
fi

if [ ! -d "$repository" ]; then
  git init --bare "$repository" >/dev/null
  git --git-dir="$repository" remote add origin "$remote"
fi

configured_remote="$(git --git-dir="$repository" remote get-url origin)"
if [ "$configured_remote" != "$remote" ]; then
  echo "Deployment repository points to an unexpected remote." >&2
  exit 1
fi

git --git-dir="$repository" fetch --quiet --prune \
  origin production:refs/remotes/origin/production

commit="$(git --git-dir="$repository" rev-parse refs/remotes/origin/production)"
case "$commit" in
  ""|*[!0-9a-f]*)
    echo "GitHub returned an invalid production commit." >&2
    exit 1
    ;;
esac

release="$releases/$commit"

if [ ! -d "$release" ]; then
  temporary_release="$(mktemp -d "$releases/.deploy.XXXXXX")"

  cleanup() {
    if [ -n "${temporary_release:-}" ] && [ -d "$temporary_release" ]; then
      rm -rf -- "$temporary_release"
    fi
  }
  trap cleanup EXIT HUP INT TERM

  git --git-dir="$repository" archive "$commit" | tar -xf - -C "$temporary_release"

  test -f "$temporary_release/index.html"
  test -f "$temporary_release/.htaccess"
  test -f "$temporary_release/robots.txt"
  test -f "$temporary_release/sitemap.xml"

  mv "$temporary_release" "$release"
  temporary_release=""
  trap - EXIT HUP INT TERM
fi

current_target="$(readlink -f "$public" 2>/dev/null || true)"
release_target="$(readlink -f "$release")"

if [ "$current_target" = "$release_target" ]; then
  echo "Production is already up to date: $commit"
  exit 0
fi

if [ -e "$public" ] && [ ! -L "$public" ]; then
  backup="$releases/manual-before-$(date -u +%Y%m%dT%H%M%SZ)"
  mv "$public" "$backup"
  echo "Previous public_html saved as: $backup"
fi

next_link="$base/.public_html.next"
rm -f -- "$next_link"
ln -s "$release" "$next_link"
mv -Tf "$next_link" "$public"

echo "Production deployed successfully: $commit"
