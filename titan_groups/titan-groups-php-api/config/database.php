<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "flutter_demo";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}
