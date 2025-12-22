<?php
require_once __DIR__ . '/../models/Item.php';

class ItemController {

    public static function index() {
        $items = Item::getAll();

        echo json_encode([
            "status" => true,
            "data" => $items
        ]);
    }
}
