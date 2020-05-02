-- MySQL/MariaDB dump 10.11
--
-- Host: localhost    Database: ray
-- ------------------------------------------------------
-- Server version	5.0.45
DROP DATABASE IF EXISTS OAKLAND_STREET_SWEEPING;
CREATE DATABASE OAKLAND_STREET_SWEEPING;

USE OAKLAND_STREET_SWEEPING;
--
-- Table structure for table `ROUTES`
--

DROP TABLE IF EXISTS `ROUTES`;
CREATE TABLE `ROUTES` (
  `route_id` varchar(255) NOT NULL,
  `shift_AM` varchar(255) default NULL,
  `shift_PM` varchar(255) default NULL,
  `shift_night1` varchar(255) default NULL,
  `shift_night2` varchar(255) default NULL,
  `Mon1_AM` smallint(6) default 0,
`Mon1_PM` smallint(6) default 0,
`Mon1_night` smallint(6) default 0,
`Mon2_AM` smallint(6) default 0,
`Mon2_PM` smallint(6) default 0,
`Mon2_night` smallint(6) default 0,
`Mon3_AM` smallint(6) default 0,
`Mon3_PM` smallint(6) default 0,
`Mon3_night` smallint(6) default 0,
`Mon4_AM` smallint(6) default 0,
`Mon4_PM` smallint(6) default 0,
`Mon4_night` smallint(6) default 0,
`Mon5_AM` smallint(6) default 0,
`Mon5_PM` smallint(6) default 0,
`Mon5_night` smallint(6) default 0,
`Tue1_AM` smallint(6) default 0,
`Tue1_PM` smallint(6) default 0,
`Tue1_night` smallint(6) default 0,
`Tue2_AM` smallint(6) default 0,
`Tue2_PM` smallint(6) default 0,
`Tue2_night` smallint(6) default 0,
`Tue3_AM` smallint(6) default 0,
`Tue3_PM` smallint(6) default 0,
`Tue3_night` smallint(6) default 0,
`Tue4_AM` smallint(6) default 0,
`Tue4_PM` smallint(6) default 0,
`Tue4_night` smallint(6) default 0,
`Tue5_AM` smallint(6) default 0,
`Tue5_PM` smallint(6) default 0,
`Tue5_night` smallint(6) default 0,
`Wed1_AM` smallint(6) default 0,
`Wed1_PM` smallint(6) default 0,
`Wed1_night` smallint(6) default 0,
`Wed2_AM` smallint(6) default 0,
`Wed2_PM` smallint(6) default 0,
`Wed2_night` smallint(6) default 0,
`Wed3_AM` smallint(6) default 0,
`Wed3_PM` smallint(6) default 0,
`Wed3_night` smallint(6) default 0,
`Wed4_AM` smallint(6) default 0,
`Wed4_PM` smallint(6) default 0,
`Wed4_night` smallint(6) default 0,
`Wed5_AM` smallint(6) default 0,
`Wed5_PM` smallint(6) default 0,
`Wed5_night` smallint(6) default 0,
`Thu1_AM` smallint(6) default 0,
`Thu1_PM` smallint(6) default 0,
`Thu1_night` smallint(6) default 0,
`Thu2_AM` smallint(6) default 0,
`Thu2_PM` smallint(6) default 0,
`Thu2_night` smallint(6) default 0,
`Thu3_AM` smallint(6) default 0,
`Thu3_PM` smallint(6) default 0,
`Thu3_night` smallint(6) default 0,
`Thu4_AM` smallint(6) default 0,
`Thu4_PM` smallint(6) default 0,
`Thu4_night` smallint(6) default 0,
`Thu5_AM` smallint(6) default 0,
`Thu5_PM` smallint(6) default 0,
`Thu5_night` smallint(6) default 0,
`Fri1_AM` smallint(6) default 0,
`Fri1_PM` smallint(6) default 0,
`Fri1_night` smallint(6) default 0,
`Fri2_AM` smallint(6) default 0,
`Fri2_PM` smallint(6) default 0,
`Fri2_night` smallint(6) default 0,
`Fri3_AM` smallint(6) default 0,
`Fri3_PM` smallint(6) default 0,
`Fri3_night` smallint(6) default 0,
`Fri4_AM` smallint(6) default 0,
`Fri4_PM` smallint(6) default 0,
`Fri4_night` smallint(6) default 0,
`Fri5_AM` smallint(6) default 0,
`Fri5_PM` smallint(6) default 0,
`Fri5_night` smallint(6) default 0,
`Sat1_AM` smallint(6) default 0,
`Sat1_PM` smallint(6) default 0,
`Sat1_night` smallint(6) default 0,
`Sat2_AM` smallint(6) default 0,
`Sat2_PM` smallint(6) default 0,
`Sat2_night` smallint(6) default 0,
`Sat3_AM` smallint(6) default 0,
`Sat3_PM` smallint(6) default 0,
`Sat3_night` smallint(6) default 0,
`Sat4_AM` smallint(6) default 0,
`Sat4_PM` smallint(6) default 0,
`Sat4_night` smallint(6) default 0,
`Sat5_AM` smallint(6) default 0,
`Sat5_PM` smallint(6) default 0,
`Sat5_night` smallint(6) default 0,
`Sun1_AM` smallint(6) default 0,
`Sun1_PM` smallint(6) default 0,
`Sun1_night` smallint(6) default 0,
`Sun2_AM` smallint(6) default 0,
`Sun2_PM` smallint(6) default 0,
`Sun2_night` smallint(6) default 0,
`Sun3_AM` smallint(6) default 0,
`Sun3_PM` smallint(6) default 0,
`Sun3_night` smallint(6) default 0,
`Sun4_AM` smallint(6) default 0,
`Sun4_PM` smallint(6) default 0,
`Sun4_night` smallint(6) default 0,
`Sun5_AM` smallint(6) default 0,
`Sun5_PM` smallint(6) default 0,
`Sun5_night` smallint(6) default 0,
`monthly_freq` int(11) AS (Mon1_AM+Mon1_PM+Mon1_night+Tue1_AM+Tue1_PM+Tue1_night+Wed1_AM+Wed1_PM+Wed1_night+Thu1_AM+Thu1_PM+Thu1_night+Fri1_AM+Fri1_PM+Fri1_night+Sat1_AM+Sat1_PM+Sat1_night+Sun1_AM+Sun1_PM+Sun1_night+Mon2_AM+Mon2_PM+Mon2_night+Tue2_AM+Tue2_PM+Tue2_night+Wed2_AM+Wed2_PM+Wed2_night+Thu2_AM+Thu2_PM+Thu2_night+Fri2_AM+Fri2_PM+Fri2_night+Sat2_AM+Sat2_PM+Sat2_night+Sun2_AM+Sun2_PM+Sun2_night+Mon3_AM+Mon3_PM+Mon3_night+Tue3_AM+Tue3_PM+Tue3_night+Wed3_AM+Wed3_PM+Wed3_night+Thu3_AM+Thu3_PM+Thu3_night+Fri3_AM+Fri3_PM+Fri3_night+Sat3_AM+Sat3_PM+Sat3_night+Sun3_AM+Sun3_PM+Sun3_night+Mon4_AM+Mon4_PM+Mon4_night+Tue4_AM+Tue4_PM+Tue4_night+Wed4_AM+Wed4_PM+Wed4_night+Thu4_AM+Thu4_PM+Thu4_night+Fri4_AM+Fri4_PM+Fri4_night+Sat4_AM+Sat4_PM+Sat4_night+Sun4_AM+Sun4_PM+Sun4_night+Mon5_AM+Mon5_PM+Mon5_night+Tue5_AM+Tue5_PM+Tue5_night+Wed5_AM+Wed5_PM+Wed5_night+Thu5_AM+Thu5_PM+Thu5_night+Fri5_AM+Fri5_PM+Fri5_night+Sat5_AM+Sat5_PM+Sat5_night+Sun5_AM+Sun5_PM+Sun5_night),
  PRIMARY KEY  (`route_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ROUTES`
-- `route_id` varchar(11) NOT NULL,
--  `shift_AM` varchar(255) default NULL,
--  `shift_PM` varchar(255) default NULL,
--  `shift_night` varchar(255) default NULL,
--  `Mon1_AM` smallint(6) default 0,
-- `Mon1_PM` smallint(6) default 0,
--

LOCK TABLES `ROUTES` WRITE;
/*!40000 ALTER TABLE `ROUTES` DISABLE KEYS */;
INSERT INTO `ROUTES` (route_id, Mon1_AM, Mon3_AM, Thu1_AM, Thu3_AM)VALUES ('1A_dummy',1,1,1,1);
INSERT INTO `ROUTES` (route_id, Mon1_AM, Mon2_AM, Mon3_AM, Mon4_AM, Thu1_AM, Thu2_AM, Thu3_AM, Thu4_AM)VALUES ('1A_dummy3',1,1,1,1,1,1,1,1);
INSERT INTO `ROUTES` (route_id, Mon2_PM, Mon4_PM, Thu2_PM, Thu4_PM)VALUES ('1A_dummy2',1,1,1,1);
/*!40000 ALTER TABLE `ROUTES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STREETS`
--

DROP TABLE IF EXISTS `STREETS`;
CREATE TABLE `STREETS` (
    `street_id` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` varchar(255) NOT NULL,
  `street_name` varchar(255) default NULL,
  PRIMARY KEY (`street_id`),
  KEY `route_id` (`route_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `STREETS`
--

LOCK TABLES `STREETS` WRITE;
/*!40000 ALTER TABLE `STREETS` DISABLE KEYS */;
#INSERT INTO `STREETS` VALUES ('sid_1234','1A_dummy','Test Street'),
#                             ('sid_4557','1A_dummy2','Fake Street');
INSERT INTO `STREETS` ( route_id, street_name) VALUES ('1A_dummy','One Street');
INSERT INTO `STREETS` ( route_id, street_name) VALUES ('1A_dummy2','Two Ave');
INSERT INTO `STREETS` ( route_id, street_name) VALUES ('1A_dummy','Three Blvd');

/*!40000 ALTER TABLE `STREETS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DYNAMAPS`
--

DROP TABLE IF EXISTS `DYNAMAPS`;
CREATE TABLE `DYNAMAPS` (
  `dynamap_id` int(11) NOT NULL,
  `route_id` varchar(255) NOT NULL,
  `street_id` varchar(255) default NULL,
  `addr_odd_start` int default NULL,
  `addr_odd_end` int default NULL,
  `addr_even_start` int default NULL,
  `addr_even_end` int default NULL,
  `time_odd_start` time default NULL,
  `time_odd_end` time default NULL,
  `time_even_start` time default NULL,
  `time_even_end` time default NULL,
  `coordinates` linestring default NULL,
  `street_name` varchar(255) default NULL,
  PRIMARY KEY  (`dynamap_id`),
  KEY `route_id` (`route_id`),
  KEY `street_id` (`street_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `DYNAMAPS`
--

#LOCK TABLES `DYNAMAPS` WRITE;
#/*!40000 ALTER TABLE `DYNAMAPS` DISABLE KEYS */;
#INSERT INTO `DYNAMAPS` (dynamap_id,route_id,street_id,addr_odd_start,addr_odd_end,addr_even_start,addr_even_end) VALUES (123456789,'1A_dummy','sid_1234',1,11,0,10);
#/*!40000 ALTER TABLE `DYNAMAPS` ENABLE KEYS */;
#UNLOCK TABLES;

--
-- Table structure for table `ROUTE_LOG`
--

DROP TABLE IF EXISTS `ROUTE_LOG`;
CREATE TABLE `ROUTE_LOG` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` varchar(255) NOT NULL,
  `employee_id` int(11) default NULL,
  `employee_status` varchar(255) default NULL,
  `vehicle_id` varchar(255) NOT NULL,
  `date_swept` date NOT NULL,
  `shift` varchar(255) default NULL,
  `notes` varchar(255) default NULL,
  `completion` varchar(255) default NULL,
  `disabled` smallint(6) default 0,
  PRIMARY KEY  (`log_id`),
  KEY `route_id` (`route_id`),
  KEY `employee_id` (`employee_id`),
  KEY `vehicle_id` (`vehicle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ROUTE_LOG`
--

LOCK TABLES `ROUTE_LOG` WRITE;
/*!40000 ALTER TABLE `ROUTE_LOG` DISABLE KEYS */;
INSERT INTO `ROUTE_LOG` (route_id,employee_id,vehicle_id,date_swept,shift,completion) VALUES ('1A_dummy',1234,'vid_1234','2020-03-15','AM','completed');
INSERT INTO `ROUTE_LOG` (route_id,employee_id,vehicle_id,date_swept,shift,completion) VALUES ('1A_dummy2',1234,'vid_1234','2020-03-15','PM','completed');
INSERT INTO `ROUTE_LOG` (route_id,employee_id,vehicle_id,date_swept,shift,completion) VALUES ('1A_dummy',4567,'vid_1234','2020-03-20','AM','completed');

/*!40000 ALTER TABLE `ROUTE_LOG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DAY_LOG`
--

DROP TABLE IF EXISTS `DAY_LOG`;
CREATE TABLE `DAY_LOG` (
    #log_id_day				weather	logs	holiday
  `log_id_day` int(11) NOT NULL AUTO_INCREMENT,
  `log_date` date default NULL,
  `logs` varchar(255) default NULL,
  `weather` varchar(255) default 'Sunny',
  `holiday` smallint(6) default 0,
  PRIMARY KEY `log_id_day` (`log_id_day`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `DAY_LOG`
--

LOCK TABLES `DAY_LOG` WRITE;
/*!40000 ALTER TABLE `DAY_LOG` DISABLE KEYS */;
INSERT INTO `DAY_LOG` (logs,log_date,weather) VALUES ('lid_1234,lid_5678','2020-04-13','Cloudy');
/*!40000 ALTER TABLE `DAY_LOG` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `VEHICLE_DAY_LOG`
--

DROP TABLE IF EXISTS `VEHICLE_DAY_LOG`;
CREATE TABLE `VEHICLE_DAY_LOG` (
    #log_id_day				weather	logs	holiday
  `vehicle_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `log_date` date default NULL,
  `shift` varchar(11) default NULL,
  `vehicle_id` int(11) default NULL,
  `comment` varchar(255) default NULL,
  PRIMARY KEY `vehicle_log_id` (`vehicle_log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


--
-- Table structure for table `DRIVERS`
--

DROP TABLE IF EXISTS `DRIVERS`;
CREATE TABLE `DRIVERS` (
  `employee_id` int(11) NOT NULL,
  `employee_name` varchar(255) default NULL,
  `hours` int(11) default 40, #weekly hours
  `daily_hours` int(11) default 8,
  `shift` varchar(11) default 'day',
  `shift_mon` smallint(6) default 0,
  `shift_tue` smallint(6) default 0,
  `shift_wed` smallint(6) default 0,
  `shift_thu` smallint(6) default 0,
  `shift_fri` smallint(6) default 0,
  `shift_sat` smallint(6) default 0,
  `shift_sun` smallint(6) default 0,
  `shift_mon_pm` smallint(6) default 0,
  `shift_tue_pm` smallint(6) default 0,
  `shift_wed_pm` smallint(6) default 0,
  `shift_thu_pm` smallint(6) default 0,
  `shift_fri_pm` smallint(6) default 0,
  `shift_sat_pm` smallint(6) default 0,
  `shift_sun_pm` smallint(6) default 0,
  `route_id_Mon1_AM` varchar(11) default NULL,
`route_id_Mon1_PM` varchar(11) default NULL,
`route_id_Mon1_night` varchar(11) default NULL,
`route_id_Mon2_AM` varchar(11) default NULL,
`route_id_Mon2_PM` varchar(11) default NULL,
`route_id_Mon2_night` varchar(11) default NULL,
`route_id_Mon3_AM` varchar(11) default NULL,
`route_id_Mon3_PM` varchar(11) default NULL,
`route_id_Mon3_night` varchar(11) default NULL,
`route_id_Mon4_AM` varchar(11) default NULL,
`route_id_Mon4_PM` varchar(11) default NULL,
`route_id_Mon4_night` varchar(11) default NULL,
`route_id_Mon5_AM` varchar(11) default NULL,
`route_id_Mon5_PM` varchar(11) default NULL,
`route_id_Mon5_night` varchar(11) default NULL,
`route_id_Tue1_AM` varchar(11) default NULL,
`route_id_Tue1_PM` varchar(11) default NULL,
`route_id_Tue1_night` varchar(11) default NULL,
`route_id_Tue2_AM` varchar(11) default NULL,
`route_id_Tue2_PM` varchar(11) default NULL,
`route_id_Tue2_night` varchar(11) default NULL,
`route_id_Tue3_AM` varchar(11) default NULL,
`route_id_Tue3_PM` varchar(11) default NULL,
`route_id_Tue3_night` varchar(11) default NULL,
`route_id_Tue4_AM` varchar(11) default NULL,
`route_id_Tue4_PM` varchar(11) default NULL,
`route_id_Tue4_night` varchar(11) default NULL,
`route_id_Tue5_AM` varchar(11) default NULL,
`route_id_Tue5_PM` varchar(11) default NULL,
`route_id_Tue5_night` varchar(11) default NULL,
`route_id_Wed1_AM` varchar(11) default NULL,
`route_id_Wed1_PM` varchar(11) default NULL,
`route_id_Wed1_night` varchar(11) default NULL,
`route_id_Wed2_AM` varchar(11) default NULL,
`route_id_Wed2_PM` varchar(11) default NULL,
`route_id_Wed2_night` varchar(11) default NULL,
`route_id_Wed3_AM` varchar(11) default NULL,
`route_id_Wed3_PM` varchar(11) default NULL,
`route_id_Wed3_night` varchar(11) default NULL,
`route_id_Wed4_AM` varchar(11) default NULL,
`route_id_Wed4_PM` varchar(11) default NULL,
`route_id_Wed4_night` varchar(11) default NULL,
`route_id_Wed5_AM` varchar(11) default NULL,
`route_id_Wed5_PM` varchar(11) default NULL,
`route_id_Wed5_night` varchar(11) default NULL,
`route_id_Thu1_AM` varchar(11) default NULL,
`route_id_Thu1_PM` varchar(11) default NULL,
`route_id_Thu1_night` varchar(11) default NULL,
`route_id_Thu2_AM` varchar(11) default NULL,
`route_id_Thu2_PM` varchar(11) default NULL,
`route_id_Thu2_night` varchar(11) default NULL,
`route_id_Thu3_AM` varchar(11) default NULL,
`route_id_Thu3_PM` varchar(11) default NULL,
`route_id_Thu3_night` varchar(11) default NULL,
`route_id_Thu4_AM` varchar(11) default NULL,
`route_id_Thu4_PM` varchar(11) default NULL,
`route_id_Thu4_night` varchar(11) default NULL,
`route_id_Thu5_AM` varchar(11) default NULL,
`route_id_Thu5_PM` varchar(11) default NULL,
`route_id_Thu5_night` varchar(11) default NULL,
`route_id_Fri1_AM` varchar(11) default NULL,
`route_id_Fri1_PM` varchar(11) default NULL,
`route_id_Fri1_night` varchar(11) default NULL,
`route_id_Fri2_AM` varchar(11) default NULL,
`route_id_Fri2_PM` varchar(11) default NULL,
`route_id_Fri2_night` varchar(11) default NULL,
`route_id_Fri3_AM` varchar(11) default NULL,
`route_id_Fri3_PM` varchar(11) default NULL,
`route_id_Fri3_night` varchar(11) default NULL,
`route_id_Fri4_AM` varchar(11) default NULL,
`route_id_Fri4_PM` varchar(11) default NULL,
`route_id_Fri4_night` varchar(11) default NULL,
`route_id_Fri5_AM` varchar(11) default NULL,
`route_id_Fri5_PM` varchar(11) default NULL,
`route_id_Fri5_night` varchar(11) default NULL,
`route_id_Sat1_AM` varchar(11) default NULL,
`route_id_Sat1_PM` varchar(11) default NULL,
`route_id_Sat1_night` varchar(11) default NULL,
`route_id_Sat2_AM` varchar(11) default NULL,
`route_id_Sat2_PM` varchar(11) default NULL,
`route_id_Sat2_night` varchar(11) default NULL,
`route_id_Sat3_AM` varchar(11) default NULL,
`route_id_Sat3_PM` varchar(11) default NULL,
`route_id_Sat3_night` varchar(11) default NULL,
`route_id_Sat4_AM` varchar(11) default NULL,
`route_id_Sat4_PM` varchar(11) default NULL,
`route_id_Sat4_night` varchar(11) default NULL,
`route_id_Sat5_AM` varchar(11) default NULL,
`route_id_Sat5_PM` varchar(11) default NULL,
`route_id_Sat5_night` varchar(11) default NULL,
`route_id_Sun1_AM` varchar(11) default NULL,
`route_id_Sun1_PM` varchar(11) default NULL,
`route_id_Sun1_night` varchar(11) default NULL,
`route_id_Sun2_AM` varchar(11) default NULL,
`route_id_Sun2_PM` varchar(11) default NULL,
`route_id_Sun2_night` varchar(11) default NULL,
`route_id_Sun3_AM` varchar(11) default NULL,
`route_id_Sun3_PM` varchar(11) default NULL,
`route_id_Sun3_night` varchar(11) default NULL,
`route_id_Sun4_AM` varchar(11) default NULL,
`route_id_Sun4_PM` varchar(11) default NULL,
`route_id_Sun4_night` varchar(11) default NULL,
`route_id_Sun5_AM` varchar(11) default NULL,
`route_id_Sun5_PM` varchar(11) default NULL,
`route_id_Sun5_night` varchar(11) default NULL,
  PRIMARY KEY  (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `DRIVERS`
--

LOCK TABLES `DRIVERS` WRITE;
/*!40000 ALTER TABLE `DRIVERS` DISABLE KEYS */;
INSERT INTO `DRIVERS` (employee_id,employee_name,hours,route_id_Mon1_AM,route_id_Mon2_PM) VALUES (1234,'Fake Driver',40,'1A_dummy','1A_dummy2');
INSERT INTO `DRIVERS` (employee_id,employee_name,hours,route_id_Mon1_AM,route_id_Mon2_AM) VALUES (4567,'Bob Employee',40,'1A_dummy3','1A_dummy3');
INSERT INTO `DRIVERS` (employee_id,employee_name,hours,route_id_Thu1_AM,route_id_Thu2_AM) VALUES (1111,'Joe Person',40,'1A_dummy3','1A_dummy3');

/*!40000 ALTER TABLE `DRIVERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VEHICLES`
--

DROP TABLE IF EXISTS `VEHICLES`;
CREATE TABLE `VEHICLES` (
  `vehicle_id` int(11) NOT NULL,
  `status_am` int(11) default 1,
  `status_pm` int(11) default 1,
  `status_night` int(11) default 1,
  `make` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `cng` varchar(255) default NULL,
  `vehicle_year` int(11) default NULL,
  `license` varchar(255) default NULL,
  `v_id_no` varchar(255) default NULL,
  PRIMARY KEY  (`vehicle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `VEHICLES`
--

LOCK TABLES `VEHICLES` WRITE;
/*!40000 ALTER TABLE `VEHICLES` DISABLE KEYS */;
INSERT INTO `VEHICLES` (vehicle_id) VALUES (1234);
/*!40000 ALTER TABLE `VEHICLES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VEHICLE_MAINTENANCE`
--

DROP TABLE IF EXISTS `VEHICLE_MAINTENANCE`;
CREATE TABLE `VEHICLE_MAINTENANCE` (
    #maint_id	vehicle_id			date_service	date_end	hours_service	type	comment
  `maint_id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(11) NOT NULL,
  `date_service` date default NULL,
  `date_end` date default (date_service),#NULL,
  `hours_service` int(11) default NULL,
  `type` varchar(255) default NULL,
  `comment` varchar(255) default NULL,
  PRIMARY KEY  (`maint_id`),
  KEY `vehicle_id` (`vehicle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `VEHICLE_MAINTENANCE`
--

LOCK TABLES `VEHICLE_MAINTENANCE` WRITE;
/*!40000 ALTER TABLE `VEHICLE_MAINTENANCE` DISABLE KEYS */;
INSERT INTO `VEHICLE_MAINTENANCE` (vehicle_id,date_service,date_end,hours_service) VALUES (1,'2020-03-01','2020-03-02',20);
/*!40000 ALTER TABLE `VEHICLE_MAINTENANCE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ABSENCES`
--

DROP TABLE IF EXISTS `ABSENCES`;
CREATE TABLE `ABSENCES` (
    #absence_id	employee_id			date_absence	shift	hours		comment	type_absence_1
  `absence_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `date_absence` date default NULL,
  `shift` varchar(255) default NULL,
  #`hours` int(11) default NULL,
  `time_start` time default NULL,
  `time_end` time default NULL,
  `time_missed` time AS (time_end-time_start),
  `comment` varchar(255) default NULL,
  `type` varchar(255) default NULL, # type of absence, e.g. sick, family, etc.
  # TODO add other absence types

  PRIMARY KEY  (`absence_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ABSENCES`
--

LOCK TABLES `ABSENCES` WRITE;
/*!40000 ALTER TABLE `ABSENCES` DISABLE KEYS */;
INSERT INTO `ABSENCES` ( employee_id,date_absence,shift,comment) VALUES (1111,'2020-03-04','PM','an absence');
INSERT INTO `ABSENCES` ( employee_id,date_absence,shift,type,time_start,time_end) VALUES (2882,'2020-03-04','PM','sick','8:00','12:00');
/*!40000 ALTER TABLE `ABSENCES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HOLIDAY`
--

DROP TABLE IF EXISTS `HOLIDAY`;
CREATE TABLE `HOLIDAY` (
  `holiday_date` date NOT NULL,
  PRIMARY KEY  (`holiday_date`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `OVERTIME`
--

DROP TABLE IF EXISTS `OVERTIME`;
CREATE TABLE `OVERTIME` (
    #absence_id	employee_id			date_absence	shift	hours		comment	type_absence_1
  `overtime_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `date_overtime` date default NULL,
  `time_start` time default NULL,
  `time_end` time default NULL,
  `time_over` time AS (time_end-time_start),
  `comment` varchar(255) default NULL,

  PRIMARY KEY  (`overtime_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `OVERTIME`
--

LOCK TABLES `OVERTIME` WRITE;
/*!40000 ALTER TABLE `OVERTIME` DISABLE KEYS */;
INSERT INTO `OVERTIME` (overtime_id, employee_id,date_overtime,time_start,time_end) VALUES (0,1111,'2020-03-04','16:00','18:00');
/*!40000 ALTER TABLE `OVERTIME` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `CITATIONS`
--

DROP TABLE IF EXISTS `CITATIONS`;
CREATE TABLE `CITATIONS` (
    #ticket_id	dynamap_id			issue_date	issue_time	address	street_name
  `ticket_id` int(11) NOT NULL,
  `dynamap_id` int(11) default NULL,
  `issue_date` date default NULL,
  `issue_time` time default NULL,
  `address` int(11) default NULL,
  `street_name` varchar(255) default NULL,
  PRIMARY KEY  (`ticket_id`),
  KEY `dynamap_id` (`dynamap_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `CITATIONS`
--

LOCK TABLES `CITATIONS` WRITE;
/*!40000 ALTER TABLE `CITATIONS` DISABLE KEYS */;
INSERT INTO `CITATIONS` (ticket_id, dynamap_id, issue_date, issue_time, address, street_name) VALUES (987654321,123456789,'2020-03-07','9:00',100,'Test Street');
/*!40000 ALTER TABLE `CITATIONS` ENABLE KEYS */;
UNLOCK TABLES;





/* Add SQL STATEMENTS BELOW  */

select * from ROUTES;
select route_id from ROUTES where Mon1_AM=1;
select route_id from ROUTES where Mon1_PM=1;
select route_id from ROUTES where Tue1_night=1;


select * from STREETS;
select * from STREETS where route_id in (select route_id from ROUTES where Mon1_AM=1);

select * from DRIVERS;
select employee_id,employee_name from DRIVERS where shift_mon_pm =1;


select * from ROUTE_LOG;
select * from ROUTE_LOG where date_swept='2020-03-15';
select * from ROUTE_LOG where route_id='1A_dummy';
select distinct(employee_id) from ROUTE_LOG where route_id='1A_dummy';

