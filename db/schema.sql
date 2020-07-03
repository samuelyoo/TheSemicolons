DROP DATABASE IF EXISTS mylibrary;

CREATE DATABASE mylibrary;

USE mylibrary;

CREATE TABLE users (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
auth_id VARCHAR (255) NOT NULL
);

CREATE TABLE books (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
title VARCHAR (255),
author VARCHAR (255),
genre VARCHAR (255),
description VARCHAR (255),
page_count INTEGER,
book_cover VARCHAR (255),
user_added INTEGER,
date_added INTEGER,
FOREIGN KEY (user_added) REFERENCES users(id)
);