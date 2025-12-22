<?php
header("Content-Type: application/json");

require_once '../app/core/Router.php';

$router = new Router();

// User APIs
$router->get('/users', 'UserController@index');
$router->get('/users/show', 'UserController@show');

// Items API (MVC, legacy URL preserved)
$router->get('/php-api/items.php', 'ItemController@index');

$router->dispatch();
