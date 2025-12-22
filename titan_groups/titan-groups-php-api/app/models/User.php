<?php
class User {
    public static function all() {
        return [
            ["id" => 1, "name" => "Dhinakaran", "role" => "Admin"],
            ["id" => 2, "name" => "Alex", "role" => "User"]
        ];
    }

    public static function find($id) {
        foreach (self::all() as $user) {
            if ($user['id'] == $id) return $user;
        }
        return null;
    }
}
