CREATE TABLE roles (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    role_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE menu_items (
    item_id INT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    staff_id INT,
    status VARCHAR(50) NOT NULL,
    pickup_time TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES users(user_id),
    FOREIGN KEY (staff_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

CREATE TABLE payment (
    payment_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);