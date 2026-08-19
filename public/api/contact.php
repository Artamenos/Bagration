<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

const MAX_REQUEST_BYTES = 8192;
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_SECONDS = 900;

function respond(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function rateLimit(string $ipAddress, string $salt): string
{
    $directory = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'bagration-contact-rate-limit';

    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        return 'error';
    }

    $filePath = $directory . DIRECTORY_SEPARATOR . hash('sha256', $salt . '|' . $ipAddress) . '.json';
    $handle = fopen($filePath, 'c+');

    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }

        return 'error';
    }

    $contents = stream_get_contents($handle);
    $stored = is_string($contents) && $contents !== '' ? json_decode($contents, true) : [];
    $now = time();
    $cutoff = $now - RATE_LIMIT_WINDOW_SECONDS;
    $timestamps = [];

    if (is_array($stored)) {
        foreach ($stored as $timestamp) {
            if (is_int($timestamp) && $timestamp > $cutoff) {
                $timestamps[] = $timestamp;
            }
        }
    }

    if (count($timestamps) >= RATE_LIMIT_MAX_REQUESTS) {
        flock($handle, LOCK_UN);
        fclose($handle);
        return 'limited';
    }

    $timestamps[] = $now;
    rewind($handle);
    ftruncate($handle, 0);
    $written = fwrite($handle, json_encode($timestamps));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    @chmod($filePath, 0600);

    return $written === false ? 'error' : 'allowed';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Метод запроса не поддерживается.']);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength <= 0 || $contentLength > MAX_REQUEST_BYTES) {
    respond(413, ['ok' => false, 'message' => 'Некорректный размер запроса.']);
}

$contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
if ($contentType !== 'application/json') {
    respond(415, ['ok' => false, 'message' => 'Формат запроса не поддерживается.']);
}

$documentRoot = realpath((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''));
if ($documentRoot === false) {
    respond(503, ['ok' => false, 'message' => 'Сервис временно недоступен.']);
}

$configPath = getenv('BAGRATION_CONTACT_CONFIG');
if (!is_string($configPath) || $configPath === '') {
    $configPath = dirname($documentRoot) . DIRECTORY_SEPARATOR . 'bagration-contact.php';
}

if (!is_file($configPath) || !is_readable($configPath)) {
    error_log('[bagration-contact] Server configuration is unavailable.');
    respond(503, ['ok' => false, 'message' => 'Форма пока не настроена. Позвоните нам по телефону.']);
}

$config = require $configPath;
if (!is_array($config)) {
    error_log('[bagration-contact] Server configuration has an invalid format.');
    respond(503, ['ok' => false, 'message' => 'Форма пока не настроена. Позвоните нам по телефону.']);
}

$requiredConfigKeys = ['smtp_host', 'smtp_port', 'smtp_encryption', 'smtp_user', 'smtp_password', 'recipient', 'rate_limit_salt'];
foreach ($requiredConfigKeys as $key) {
    if (!isset($config[$key]) || (is_string($config[$key]) && trim($config[$key]) === '')) {
        error_log('[bagration-contact] Required server configuration is missing.');
        respond(503, ['ok' => false, 'message' => 'Форма пока не настроена. Позвоните нам по телефону.']);
    }
}

$allowedOrigins = $config['allowed_origins'] ?? [];
$origin = rtrim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''), '/');
if ($origin === '' || !is_array($allowedOrigins) || !in_array($origin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'message' => 'Источник запроса не разрешён.']);
}

$rawBody = file_get_contents('php://input');
if (!is_string($rawBody) || $rawBody === '') {
    respond(400, ['ok' => false, 'message' => 'Не удалось прочитать данные формы.']);
}

try {
    $payload = json_decode($rawBody, true, 16, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    respond(400, ['ok' => false, 'message' => 'Некорректные данные формы.']);
}

if (!is_array($payload)) {
    respond(400, ['ok' => false, 'message' => 'Некорректные данные формы.']);
}

if (trim((string) ($payload['website'] ?? '')) !== '') {
    respond(200, ['ok' => true, 'message' => 'Спасибо! Заявка отправлена.']);
}

$elapsedMs = filter_var($payload['elapsedMs'] ?? null, FILTER_VALIDATE_INT);
if ($elapsedMs === false || $elapsedMs < 2500 || $elapsedMs > 7200000) {
    respond(400, ['ok' => false, 'message' => 'Обновите страницу и заполните форму ещё раз.']);
}

$name = preg_replace('/\s+/u', ' ', trim((string) ($payload['name'] ?? '')));
$phoneInput = trim((string) ($payload['phone'] ?? ''));
$groupKey = (string) ($payload['group'] ?? '');
$gymKey = (string) ($payload['gym'] ?? '');
$hasConsent = ($payload['consent'] ?? false) === true;

if (!is_string($name) || textLength($name) < 2 || textLength($name) > 80 || !preg_match("/^[\p{L}\s\-'.]+$/u", $name)) {
    respond(422, ['ok' => false, 'message' => 'Проверьте имя.']);
}

$phoneDigits = preg_replace('/\D+/', '', $phoneInput);
if (!is_string($phoneDigits)) {
    respond(422, ['ok' => false, 'message' => 'Проверьте номер телефона.']);
}

if (strlen($phoneDigits) === 11 && $phoneDigits[0] === '8') {
    $phoneDigits = '7' . substr($phoneDigits, 1);
}

if (!preg_match('/^7\d{10}$/', $phoneDigits)) {
    respond(422, ['ok' => false, 'message' => 'Введите российский номер телефона полностью.']);
}

$groups = [
    'kids' => 'Детская группа',
    'adult' => 'Взрослая группа',
];

$gyms = [
    'astradamsky' => 'Москва, Астрадамский проезд, 5',
    'timiryazevo' => 'Москва, Тимирязевская улица, 16',
    'lobnya' => 'Лобня, улица Чехова, 3А',
    'vernadskogo' => 'Москва, проспект Вернадского, 94к7',
    'raspletina' => 'Москва, улица Расплетина, 1',
    'zhasminovaya' => 'Апрелевка, Жасминовая улица, 10',
    'aprelevka' => 'Апрелевка, Августовская улица, 14',
    'izvarino' => 'Изварино',
    'yablochkova' => 'Москва, улица Яблочкова, 7',
    'unsure' => 'Нужна помощь с выбором зала',
];

if (!array_key_exists($groupKey, $groups)) {
    respond(422, ['ok' => false, 'message' => 'Выберите группу.']);
}

if (!array_key_exists($gymKey, $gyms)) {
    respond(422, ['ok' => false, 'message' => 'Выберите зал.']);
}

if (!$hasConsent) {
    respond(422, ['ok' => false, 'message' => 'Необходимо согласие на обработку персональных данных.']);
}

$rateLimitResult = rateLimit(
    (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
    (string) $config['rate_limit_salt'],
);

if ($rateLimitResult === 'limited') {
    respond(429, ['ok' => false, 'message' => 'Слишком много попыток. Попробуйте снова через 15 минут.']);
}

if ($rateLimitResult === 'error') {
    error_log('[bagration-contact] Rate-limit storage is unavailable.');
    respond(503, ['ok' => false, 'message' => 'Сервис временно недоступен. Позвоните нам по телефону.']);
}

$formattedPhone = sprintf(
    '+7 (%s) %s-%s-%s',
    substr($phoneDigits, 1, 3),
    substr($phoneDigits, 4, 3),
    substr($phoneDigits, 7, 2),
    substr($phoneDigits, 9, 2),
);

$submittedAt = (new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow')))->format('d.m.Y H:i:s');
$messageBody = implode("\n", [
    'Новая заявка на пробную тренировку',
    '',
    'Имя: ' . $name,
    'Телефон: ' . $formattedPhone,
    'Группа: ' . $groups[$groupKey],
    'Зал: ' . $gyms[$gymKey],
    'Время отправки: ' . $submittedAt . ' МСК',
    'Согласие на обработку данных: получено',
]);

try {
    $mailer = new PHPMailer(true);
    $smtpEncryption = (string) $config['smtp_encryption'];

    if (!in_array($smtpEncryption, ['ssl', 'tls'], true)) {
        throw new MailException('Invalid SMTP encryption configuration.');
    }

    $mailer->isSMTP();
    $mailer->Host = (string) $config['smtp_host'];
    $mailer->Port = (int) $config['smtp_port'];
    $mailer->SMTPAuth = true;
    $mailer->SMTPSecure = $smtpEncryption === 'ssl'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->Username = (string) $config['smtp_user'];
    $mailer->Password = (string) $config['smtp_password'];
    $mailer->Timeout = 12;
    $mailer->CharSet = PHPMailer::CHARSET_UTF8;
    $mailer->setFrom((string) $config['smtp_user'], 'Сайт клуба «Багратион»');
    $mailer->addAddress((string) $config['recipient']);
    $mailer->Subject = 'Новая заявка на пробную тренировку';
    $mailer->Body = $messageBody;
    $mailer->AltBody = $messageBody;
    $mailer->send();
} catch (MailException) {
    error_log('[bagration-contact] SMTP delivery failed.');
    respond(502, ['ok' => false, 'message' => 'Не удалось отправить заявку. Позвоните нам или попробуйте позже.']);
}

respond(200, ['ok' => true, 'message' => 'Спасибо! Заявка отправлена. Мы свяжемся с вами.']);
