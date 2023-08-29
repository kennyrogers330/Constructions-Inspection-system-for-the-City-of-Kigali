-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: homemade
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `description` text,
  `expected_duration` int DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `project_manager` varchar(255) DEFAULT NULL,
  `project_type` varchar(255) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `weather_conditions` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'kennyrogers330@gmail.com','0781882335','The proposed lighting project in Kimihurura Sector aims to improve visibility and enhance night clarity in the area. By adding new light poles and repairing damaged ones, the project aims to provide adequate lighting infrastructure to ensure the safety and convenience of residents and visitors during nighttime hours. This project will contribute to creating a well-lit and secure environment for the Kimihurura community in Kigali City.',27,'KN 345 ST','Munyaneza Kenny','utility','2023-06-30 10:52:33.891000','Kimihurura lighting','Cloudy'),(2,'willy@gmail.com','0781882335','The Pele Stadium, located in Kigali City\'s Nyamirambo sector, is a remarkable sports facility that has become a significant landmark in the region. The construction of Pele Stadium was a collaborative effort between the government of Rwanda and private investors, aiming to create a state-of-the-art sports arena to host various events and promote sports in the community.',16,'KN 345 ST','Hirwa Willy','building','2023-06-30 17:36:03.159000','pele stadium','Cloudy'),(3,'kennyrogers330@gmail.com','0781882335','The construction of the road from RwanDEX to downtown in Kigali City is an infrastructure development project aimed at improving transportation connectivity and accessibility within the city. The project involves the planning, design, and construction of a new road that will connect the RwanDEX area to the downtown area of Kigali.',27,'KG 345 ST','Munyaneza Kenny','road','2023-07-06 14:09:11.083000','Rwandex-town main road','Sunny');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-19 20:30:22
