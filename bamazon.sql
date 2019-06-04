DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity DECIMAL(10,2) NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Macbook Pro", "electronics", 2200, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iMac", "electronics", 1400, 120);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apple TV", "electronics", 149, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Honda Lawn Mower", "Lawn Care", 400, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blacl and Decker Weed Wacker", "Lawn Care", 135, 125);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Craftsman Leaf Blower", "Lawn Care", 99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Zinus Office Desk", "Office", 70.99, 250);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Saudeer Coffee Table", "Office", 54.95, 130);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Oceanstar Wine Rack", "Home", 17.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Armen Living Chair", "Home", 91.99, 300);