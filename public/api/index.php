<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Allow: GET, POST, OPTIONS');
    http_response_code(204);
    exit;
}

function respond($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function request_body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function header_value(string $name): ?string {
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    return $_SERVER[$key] ?? null;
}

function request_user_key(array $body): ?string {
    $headerUser = header_value('X-Study-User');
    if ($headerUser) return $headerUser;
    if (!empty($body['user_key'])) return (string)$body['user_key'];
    return null;
}

$route = $_GET['route'] ?? null;

if (!$route) {
    $uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
    $route = substr($uriPath, strlen($scriptDir));
    $route = $route === '' ? '/' : $route;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $route === '/load-progress') {
        $userKey = header_value('X-Study-User');

        if (!$userKey) {
            respond(['progress' => null]);
        }

        $stmt = db()->prepare('SELECT progress_json FROM study_progress WHERE user_key = ? LIMIT 1');
        $stmt->execute([$userKey]);
        $row = $stmt->fetch();

        if (!$row) {
            respond(['progress' => null]);
        }

        respond(['progress' => json_decode($row['progress_json'], true)]);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $route === '/save-progress') {
        $body = request_body();
        $progress = $body['progress'] ?? null;
        $userKey = request_user_key($body);

        if (!is_array($progress)) {
            respond(['error' => 'Missing progress payload'], 400);
        }

        if (!$userKey) {
            respond(['ok' => true, 'warning' => 'No user key; progress not persisted']);
        }

        $stmt = db()->prepare(
            'INSERT INTO study_progress (user_key, progress_json)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE
             progress_json = VALUES(progress_json),
             updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([$userKey, json_encode($progress, JSON_UNESCAPED_SLASHES)]);

        respond(['ok' => true]);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($route === '/log-session' || $route === '/log-event')) {
        $body = request_body();
        $userKey = request_user_key($body);
        $sessionId = $body['session_id'] ?? null;
        $eventType = $body['event_type'] ?? ($route === '/log-session' ? 'session' : 'event');
        $eventTimestamp = $body['timestamp'] ?? null;

        $stmt = db()->prepare(
            'INSERT INTO study_logs (user_key, session_id, event_type, event_timestamp, payload_json)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userKey,
            $sessionId,
            $eventType,
            $eventTimestamp,
            json_encode($body, JSON_UNESCAPED_SLASHES)
        ]);

        respond(['ok' => true]);
    }

    respond(['error' => 'Not found', 'route' => $route], 404);

} catch (Throwable $e) {
    respond(['error' => 'Server error', 'message' => $e->getMessage()], 500);
}
