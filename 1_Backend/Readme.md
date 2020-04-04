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
