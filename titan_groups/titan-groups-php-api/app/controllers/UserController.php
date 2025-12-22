<?php
require_once '../app/models/User.php';

class UserController {
    public function index() {
        echo json_encode(User::all());
    }

    public function show() {
        $id = $_GET['id'] ?? null;
        echo json_encode(User::find($id));
    }
}
