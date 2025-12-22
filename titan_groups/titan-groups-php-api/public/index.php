<?php
header("Content-Type: application/json");
require_once '../app/core/Router.php';

$router = new Router();
$router->get('/users', 'UserController@index');
$router->get('/users/show', 'UserController@show');
$router->dispatch();
