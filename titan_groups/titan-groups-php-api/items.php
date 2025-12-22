<?php
header("Content-Type: application/json");
include 'config.php';

$result = $conn->query("SELECT * FROM items");
$items = [];

while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode([
    "status" => true,
    "data" => $items
]);
?>