<?php

declare(strict_types=1);

return [
    'smtp_host' => 'smtp.yandex.ru',
    'smtp_port' => 587,
    'smtp_encryption' => 'tls',
    'smtp_user' => 'kyokushinprofi@yandex.ru',
    'smtp_password' => 'PASTE_YANDEX_APP_PASSWORD_HERE',
    'recipient' => 'kyokushinprofi@yandex.ru',
    'allowed_origins' => [
        'https://cp29116.tw1.ru',
    ],
    // Сгенерируйте отдельную случайную строку длиной не менее 32 символов.
    'rate_limit_salt' => 'REPLACE_WITH_A_LONG_RANDOM_VALUE',
];
