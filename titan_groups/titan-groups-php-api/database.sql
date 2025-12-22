CREATE DATABASE flutter_demo;
USE flutter_demo;

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

INSERT INTO items (name, description) VALUES
('Laptop', 'Dell Inspiron 15'),
('Mobile', 'Samsung Galaxy S22'),
('Tablet', 'iPad Air');