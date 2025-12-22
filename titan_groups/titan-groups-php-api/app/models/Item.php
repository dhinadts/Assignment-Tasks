<?php
require_once '../config/database.php';

class Item {

    public static function getAll() {
        global $conn;

        $result = $conn->query("SELECT * FROM items");
        $items = [];

        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        return $items;
    }
}
