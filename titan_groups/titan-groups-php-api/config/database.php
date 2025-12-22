<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "flutter_demo";

try {
    $dbPath = __DIR__ . '/../storage/database.sqlite';
    $conn = new PDO("sqlite:" . $dbPath);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "error" => $e->getMessage()
    ]);
    exit;
}
