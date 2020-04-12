Files to be run (either in DataGrip or command line, datagrip is easier, just File-> Open, highlight the whole file and click the green execute button):

oakland_create_db.sql: Creates the tables - Run this first

db_create_drivers.sql: Populates DRIVERS table with employee info: employee_id, employee_name, and shifts

db_create_routes_day.sql: Populates ROUTES table with route info (both day and night despite name): route_id and scheduled day of week/week of month

db_create_vehicles.sql: Populates VEHICLES table with vehicle info: vehicle_id, status_am/pm/night, and other vehicle info as provided



-------

1.	Install Docker https://www.docker.com/get-started

a.	Requires DockerID account which will also allow access to docker hub



2.	Build and Run docker, use terminal to execute commands:

a.	docker build -t mariadb-local .

b.	docker run -d --name mariadb-bcot -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mypass --mount type=volume,source=mysqlDB,target=/var/lib/mysql --mount type=bind,source="${PWD}"/datadir,target=/home/ --restart always mariadb-local



3.	Install SQL client of your choice. (DataGrip from JetBrains is available for free with student email: https://www.jetbrains.com/student/ )

a.	Create JetBrains account and use login credentials to activate license after download

b.	Set dialect to mariaDB



4.	Connect to mariaDB database using your database client

a.	Host: localhost

b.	User: root

c.	Password: mypass or whatever you replaced mypass with when the docker run command was ran

d.	If using DataGrip, create new Data Source and select mariaDB 

e.	When prompted, Download “missing driver files” to extend DataGrip to support full mariaDB



5.	Import the database file then execute 


-------


To run the API container, we need to make sure both database and API containers are in the same network, so run this to create a network:
docker network create db-network

Connect the database to the network:
docker network connect db-network mariadb-bcot

Then cd to the 2_API folder to build and run the API container.

1. Build docker image:
docker build -t python-flask .

2. Run docker container:
docker run -e FLASK_APP=webserver.py -p 5000:5000 --network db-network --name server-bcot python-flask

If you kill the container and want to restart it, run:
docker start server-bcot

To follow the logs of the container:
docker logs -f server-bcot

