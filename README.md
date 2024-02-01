*Create package (npm init -y)
 *Install needed modules like mongoose,dotenv,cors,nodemon 
 *Install docker hub 
 *Pull mysql database from dockerhub 
 *Run mysql database in dockerhub 
 *After u had run mysql in dockerhub using docker run commands , then again run (1.docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=freshkite -p 3307:3306 -v mysql_data:/var/lib/mysql mysql)

Then execute it 
(2.docker exec -it mysql-container bash)

3.mysql -p Enter password:(the password will Accept but it will not Appear) *using sql queries create database , create table and do CRUD operation for todos *After creating databases using sql query , then
 (4.Show databases;) *then the All databases will appear and to select ur database

  (5.use (your database name );) 

  *After creating table 
  (6.show tables;) 

  (7.type your table name ;) *After creating tables Write sql queris for crud operation for todo Application 

  *Command to restart :
===>$ docker restart mysql-container output : mysql-container

===>$ docker exec -it mysql-container bash ===>bash-4.4# mysql -u root -p ===>Enter password:

===>mysql> create database mysql; ===>mysql> show databases;
 output : 
      | Database |
           | freshkite | 
           | information_schema | 
           | mysql | 
           | performance_schema |
            | sys |  
5 rows in set (0.02 sec)

===>mysql> use mysql; 
output : 
    Database changed

                     SQL QUERIES
*create Databse: CREATE DATABASE IF NOT EXISTS mysql;
 *create table : CREATE TABLE IF NOT EXISTS todocollection ( id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, description TEXT );

CRUD OPERATION FOR TODO : 
          *create todo : INSERT INTO todocollection (title, description) VALUES ('Task 1', 'Description for Task 1'); 
          *get todo : SELECT * FROM todocollection; 
          *get todo by id : SELECT * FROM todocollection WHERE id = 1; 
          *Update Todo : UPDATE todocollection SET title = 'Updated Task 1', description = 'Updated Description' WHERE id = 1; 
          *Delete Todo by ID : DELETE FROM todocollection WHERE id = 1;
