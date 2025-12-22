<?php

class Router
{
    private array $routes = [];

    // Register GET route
    public function get(string $path, string $action): void
    {
        $this->routes['GET'][$path] = $action;
    }

    // Dispatch request
    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Normalize URI (remove trailing slash)
        $uri = rtrim($uri, '/') ?: '/';

        if (!isset($this->routes[$method])) {
            $this->sendNotFound();
            return;
        }

        foreach ($this->routes[$method] as $route => $action) {
            if ($route === $uri) {
                $this->callAction($action);
                return;
            }
        }

        // Dynamic route: /api/users/{id}
        if (preg_match('#^/api/users/(\d+)$#', $uri, $matches)) {
            require_once __DIR__ . '/../controllers/UserController.php';
            (new UserController())->show($matches[1]);
            return;
        }

        $this->sendNotFound();
    }

    private function callAction(string $action): void
    {
        [$controller, $method] = explode('@', $action);

        $controllerPath = __DIR__ . '/../controllers/' . $controller . '.php';

        if (!file_exists($controllerPath)) {
            $this->sendError("Controller not found");
            return;
        }

        require_once $controllerPath;

        if (!method_exists($controller, $method)) {
            $this->sendError("Method not found");
            return;
        }

        (new $controller())->$method();
    }

    private function sendNotFound(): void
    {
        http_response_code(404);
        echo json_encode([
            "status" => false,
            "message" => "Route not found"
        ]);
    }

    private function sendError(string $message): void
    {
        http_response_code(500);
        echo json_encode([
            "status" => false,
            "message" => $message
        ]);
    }
}
