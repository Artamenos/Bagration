#!/bin/sh
set -eu
php /usr/local/bin/local-setup.php
attempt=0
until php /srv/Bagration/releases/local/admin/cli.php check; do
  attempt=$((attempt + 1))
  [ "$attempt" -lt 30 ] || exit 1
  sleep 2
done
php /srv/Bagration/releases/local/admin/cli.php install
php /srv/Bagration/releases/local/admin/test.php
cp /srv/Bagration/releases/local/admin/preview.php /srv/Bagration/releases/local/preview/index.php
cp /srv/Bagration/releases/local/admin/runtime.php /srv/Bagration/releases/local/preview/runtime.php
cp /srv/Bagration/releases/local/admin/.htaccess /srv/Bagration/releases/local/preview/.htaccess
chown -R www-data:www-data /srv/Bagration/shared
exec apache2-foreground
