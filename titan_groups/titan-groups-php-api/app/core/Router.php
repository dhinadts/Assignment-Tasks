<?php
class Router {
    private $routes = [];

    public function get($uri, $action) {
        $this->routes['GET'][$uri] = $action;
    }

    public function dispatch() {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];

        if (!isset($this->routes[$method][$uri])) {
            http_response_code(404);
            echo json_encode(["error" => "Route not found"]);
            return;
        }

        list($controller, $methodName) =
            explode('@', $this->routes[$method][$uri]);

        require_once "../app/controllers/$controller.php";

        $controllerObj = new $controller;
        $controllerObj->$methodName();
    }
}
