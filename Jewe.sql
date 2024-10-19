-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS JewelryStore;
GRANT ALL PRIVILEGES ON `JewelryStore`.* TO 'root'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
