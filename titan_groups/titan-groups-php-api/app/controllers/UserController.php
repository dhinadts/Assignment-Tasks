<?php

class UserController {

    public function index() {
        $users = require __DIR__ . '/../data/users.php';

        echo json_encode([
            "status" => true,
            "count" => count($users),
            "data" => $users
        ]);
    }

    public function show($id) {
        $users = require __DIR__ . '/../data/users.php';

        foreach ($users as $user) {
            if ($user['id'] == $id) {
                echo json_encode([
                    "status" => true,
                    "data" => $user
                ]);
                return;
            }
        }

        http_response_code(404);
        echo json_encode([
            "status" => false,
            "message" => "User not found"
        ]);
    }
}
