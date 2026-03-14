<?php
header('Content-Type: application/json; charset=utf-8');

$result = [
    'php' => 'ok',
    'db' => 'not_tested',
];

try {
    require_once __DIR__ . '/db.php';
    $pdo = db();
    $stmt = $pdo->query('SELECT DATABASE() AS db_name');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $result['db'] = 'ok';
    $result['database'] = $row['db_name'] ?? null;
} catch (Throwable $e) {
    http_response_code(500);
    $result['db'] = 'fail';
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
