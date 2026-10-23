FROM php:8.2-apache
RUN apt-get update && apt-get install -y --no-install-recommends libpng-dev libjpeg62-turbo-dev libwebp-dev libonig-dev openssl && docker-php-ext-configure gd --with-jpeg --with-webp && docker-php-ext-install pdo_mysql gd mbstring && a2enmod ssl proxy proxy_http headers && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /srv/Bagration/releases/local/preview /srv/Bagration/shared /etc/apache2/local && openssl req -x509 -newkey rsa:2048 -nodes -keyout /etc/apache2/local/key.pem -out /etc/apache2/local/cert.pem -days 365 -subj '/CN=localhost' -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1'
COPY apache.conf /etc/apache2/sites-available/000-default.conf
COPY start.sh /usr/local/bin/local-start
COPY setup.php /usr/local/bin/local-setup.php
COPY account.php /usr/local/bin/local-account.php
RUN printf 'upload_max_filesize=8M\npost_max_size=10M\ndisplay_errors=Off\n' > /usr/local/etc/php/conf.d/local.ini
CMD ["sh", "/usr/local/bin/local-start"]
