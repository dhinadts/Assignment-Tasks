<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../app/core/Router.php';

$router = new Router();

$router->get('/api/users', 'UserController@index');

$router->dispatch();
