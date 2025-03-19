-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: northen_treks_db
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_gear`
--

DROP TABLE IF EXISTS `booking_gear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_gear` (
  `booking_gear_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int DEFAULT NULL,
  `gear_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price_at_booking` decimal(10,2) DEFAULT NULL,
  `total_gear_cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`booking_gear_id`),
  KEY `booking_id` (`booking_id`),
  KEY `gear_id` (`gear_id`),
  CONSTRAINT `booking_gear_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `booking_gear_ibfk_2` FOREIGN KEY (`gear_id`) REFERENCES `rental_gear` (`gear_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_gear`
--

LOCK TABLES `booking_gear` WRITE;
/*!40000 ALTER TABLE `booking_gear` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_gear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `trek_id` int DEFAULT NULL,
  `slot_id` int DEFAULT NULL,
  `num_people` int DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','paid','falied') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `trek_id` (`trek_id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`trek_id`) REFERENCES `treks` (`trek_id`),
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`slot_id`) REFERENCES `trek_slots` (`slot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (22,14,3,5,2,2400.00,'','2025-03-10 01:33:54'),(23,14,3,5,2,2400.00,'paid','2025-03-10 01:46:14'),(24,14,3,5,2,2400.00,'paid','2025-03-10 02:06:23');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guides`
--

DROP TABLE IF EXISTS `guides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guides` (
  `guide_id` int NOT NULL AUTO_INCREMENT,
  `guide_name` varchar(100) NOT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `experience_years` int NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `bio` text,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`guide_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guides`
--

LOCK TABLES `guides` WRITE;
/*!40000 ALTER TABLE `guides` DISABLE KEYS */;
INSERT INTO `guides` VALUES (1,'Ramesh Patel','9876543210','ramesh@example.com',10,'Himalayan Treks, Snow Treks','Expert in high-altitude treks.','images/guides/ramesh.jpg','2025-02-19 06:33:12'),(2,'Priya Sharma','9123456789','priya@example.com',8,'Adventure & Jungle Treks','Loves exploring untouched trails.','images/guides/priya.jpg','2025-02-19 06:33:12');
/*!40000 ALTER TABLE `guides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_gear`
--

DROP TABLE IF EXISTS `rental_gear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_gear` (
  `gear_id` int NOT NULL AUTO_INCREMENT,
  `gear_name` varchar(255) NOT NULL,
  `description` text,
  `price_per_day` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  PRIMARY KEY (`gear_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_gear`
--

LOCK TABLES `rental_gear` WRITE;
/*!40000 ALTER TABLE `rental_gear` DISABLE KEYS */;
INSERT INTO `rental_gear` VALUES (3,'Rucksack (10L)','A small rucksack to put your extra items.',1000.00,43),(4,'Trekking Shoes','High grade professional trekking shoes ',300.00,73);
/*!40000 ALTER TABLE `rental_gear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` enum('pending','paid','failed') DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `booking_id` (`booking_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (12,22,14,2400.00,'upi','','INV202503092003543','2025-03-10 01:33:54'),(13,23,14,2400.00,'upi','paid','INV202503092016144','2025-03-10 01:46:14'),(14,24,14,2400.00,'upi','paid','INV202503092036237','2025-03-10 02:06:23');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trek_slots`
--

DROP TABLE IF EXISTS `trek_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trek_slots` (
  `slot_id` int NOT NULL AUTO_INCREMENT,
  `trek_id` int NOT NULL,
  `start_date` date NOT NULL,
  `total_slots` int NOT NULL,
  `available_slots` int NOT NULL,
  PRIMARY KEY (`slot_id`),
  KEY `fk_trek_slots_trek_id` (`trek_id`),
  CONSTRAINT `fk_trek_slots_trek_id` FOREIGN KEY (`trek_id`) REFERENCES `treks` (`trek_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trek_slots`
--

LOCK TABLES `trek_slots` WRITE;
/*!40000 ALTER TABLE `trek_slots` DISABLE KEYS */;
INSERT INTO `trek_slots` VALUES (1,1,'2025-03-15',15,10),(2,1,'2025-04-10',15,8),(3,2,'2025-06-05',20,12),(4,2,'2025-07-10',20,10),(5,3,'2025-10-01',10,4),(6,3,'2025-11-15',10,10),(7,4,'2025-09-10',12,6),(8,4,'2025-10-15',12,7),(9,5,'2025-07-01',15,10),(10,5,'2025-08-05',15,9),(11,6,'2025-10-10',12,10),(12,6,'2025-11-20',12,8),(13,7,'2025-12-01',20,15),(14,7,'2026-01-05',20,10),(15,8,'2025-05-20',18,12),(16,8,'2025-09-10',18,14),(17,9,'2025-06-05',15,10),(18,9,'2025-07-10',15,8),(19,10,'2025-07-15',14,10),(20,10,'2025-08-10',14,12),(21,11,'2025-05-01',10,8),(22,11,'2025-06-15',10,6),(23,12,'2025-10-20',8,5),(24,12,'2025-11-10',8,6),(25,13,'2025-09-05',10,7),(26,13,'2025-10-10',10,5),(27,14,'2025-06-10',15,12),(28,14,'2025-07-15',15,10),(29,15,'2025-12-05',12,8),(30,15,'2026-01-10',12,10),(31,16,'2025-06-15',18,15),(32,16,'2025-07-10',18,12),(33,17,'2025-04-10',10,8),(34,17,'2025-05-20',10,7),(35,18,'2025-03-15',12,9),(36,18,'2025-04-10',12,10),(37,19,'2025-09-10',10,6),(38,19,'2025-10-05',10,7),(39,20,'2025-12-10',15,12),(40,20,'2026-01-15',15,10),(41,21,'2025-09-20',10,5),(42,21,'2025-10-10',10,6),(43,22,'2025-04-15',12,10),(44,22,'2025-05-20',12,12),(45,23,'2025-01-05',18,15),(46,23,'2025-02-10',18,12),(47,24,'2025-10-01',10,8),(48,24,'2025-11-15',10,7),(49,25,'2025-05-05',12,10),(50,25,'2025-06-20',12,12),(51,26,'2025-06-10',12,8),(52,26,'2025-07-15',12,9),(53,27,'2025-07-01',15,10),(54,27,'2025-08-05',15,12);
/*!40000 ALTER TABLE `trek_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trekker_details`
--

DROP TABLE IF EXISTS `trekker_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trekker_details` (
  `trekker_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`trekker_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `trekker_details_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trekker_details`
--

LOCK TABLES `trekker_details` WRITE;
/*!40000 ALTER TABLE `trekker_details` DISABLE KEYS */;
INSERT INTO `trekker_details` VALUES (10,22,'klamar12',37,'male','9988776655'),(11,22,'shreyu',20,'Male','9537063964'),(12,23,'klamar12',37,'male','9988776655'),(13,23,'shreyu',20,'Male','9537063964'),(14,24,'klamar12',37,'male','9988776655'),(15,24,'shreyu',20,'Male','9537063964');
/*!40000 ALTER TABLE `trekker_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treks`
--

DROP TABLE IF EXISTS `treks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treks` (
  `trek_id` int NOT NULL AUTO_INCREMENT,
  `trek_name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `difficulty` enum('easy','moderate','hard') NOT NULL,
  `duration_days` varchar(50) NOT NULL,
  `price_per_person` decimal(10,2) NOT NULL,
  `description` text,
  `overview` text,
  `itinerary` text,
  `how_to_reach` text,
  `inclusions` text,
  `exclusions` text,
  `required_equipment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cover_image` text NOT NULL,
  `keywords` varchar(255) NOT NULL,
  `base_camp` varchar(100) NOT NULL,
  `accommodation` varchar(100) NOT NULL,
  `best_time` varchar(100) NOT NULL,
  `altitude` varchar(100) NOT NULL,
  `distance` varchar(100) NOT NULL,
  `guide_id` int DEFAULT NULL,
  PRIMARY KEY (`trek_id`),
  KEY `guide_id` (`guide_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21458 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treks`
--

LOCK TABLES `treks` WRITE;
/*!40000 ALTER TABLE `treks` DISABLE KEYS */;
INSERT INTO `treks` VALUES (1,'Everest Base Camp Trek','Nepal','hard','15',1200.50,'A thrilling trek to the base of the world\'s highest mountain.','Everest Base Camp Trek offers the adventure of a lifetime. Experience the majestic beauty of the Himalayas with breathtaking views of Mount Everest.\n\nPerfect for experienced trekkers seeking a challenging yet rewarding journey.','Day 1: Arrival in Kathmandu\nDay 2: Flight to Lukla and trek to Phakding\nDay 3: Trek to Namche Bazaar\nDay 4: Acclimatization at Namche Bazaar\nDay 5: Trek to Tengboche\nDay 6: Trek to Dingboche\nDay 7: Rest day at Dingboche for acclimatization\nDay 8: Trek to Lobuche\nDay 9: Trek to Gorak Shep and Everest Base Camp, then return to Gorak Shep\nDay 10: Hike to Kala Patthar and descend to Pheriche\nDay 11: Trek to Namche Bazaar\nDay 12: Trek to Lukla\nDay 13: Flight back to Kathmandu\nDay 14: Free day in Kathmandu\nDay 15: Departure from Kathmandu','Fly to Kathmandu, Nepal. From there, take a domestic flight to Lukla, which serves as the gateway to the Everest region.\n\nThe trek begins from Lukla and follows the trail through various villages and landscapes to the Everest Base Camp.','1. Airport transfers\n2. Domestic flights (Kathmandu-Lukla-Kathmandu)\n3. Accommodation in teahouses during the trek\n4. All meals during the trek\n5. Experienced trek guide and porters\n6. Sagarmatha National Park permits\n7. First aid and emergency equipment','1. International airfare\n2. Visa fees for Nepal\n3. Personal trekking gear\n4. Travel insurance\n5. Alcoholic beverages and soft drinks\n6. Tips for guides and porters\n7. Any costs not mentioned in inclusions','1. Sturdy trekking boots\n2. Warm clothing (thermal layers, down jacket)\n3. Sleeping bag (rated for sub-zero temperatures)\n4. Backpack with rain cover\n5. Water purification tablets\n6. Sunscreen and sunglasses\n7. Trekking poles\n8. Headlamp with spare batteries','2024-12-21 06:04:15','EverestBaseCampTrek.jpg','snow, north, upcoming','Lukla','Tea Houses, Tents','Mar-May, Sep-Nov','5364','130',NULL),(2,'Nafran Valley Trek','Jammu & Kashmir','moderate','6',6900.00,'A serene trek through Kashmir\'s landscapes.','The Nafran Valley Trek is an offbeat adventure offering picturesque landscapes, vibrant wildflowers, and the unique culture of nomadic Gujjar communities. Trekkers explore tranquil alpine lakes and long, untouched meadows while embracing the serene atmosphere of Kashmir.','Day 1: Arrival in Srinagar; transfer to Aru village.\r\nDay 2: Trek from Aru to Lidderwat.\r\nDay 3: Lidderwat to Nafran Valley base camp.\r\nDay 4: Exploration day in Nafran Valley.\r\nDay 5: Trek to Harnag Lake and return to base camp.\r\nDay 6: Return trek to Aru.\r\nDay 7: Departure from Aru to Srinagar.','By Air: Fly into Sheikh ul-Alam International Airport, Srinagar.\r\nBy Road: Drive from Srinagar to Pahalgam (90 km) and proceed to Aru Village (12 km from Pahalgam).','Accommodation (tents or guesthouses).\r\nMeals (breakfast, lunch, dinner) during the trek.\r\nExperienced trek leader and support staff.\r\nPermits and entry fees.\r\nFirst aid medical kits.',' Exclusions\r\nPersonal expenses.\r\nInsurance.\r\nCosts due to unforeseen circumstances (landslides, weather, etc.).','Trekking shoes with good grip.\r\nWarm clothing (including thermal wear).\r\nRaincoat or poncho.\r\nBackpack (50-60 liters).\r\nTrekking poles.\r\nPersonal medication and toiletries.\r\nHeadlamp with extra batteries.','2025-01-28 10:47:45','nafranvalley.jpeg','Nafran Valley,Kashmir trek,Aru village,Pahalgam,alpine lake,Gujjar culture,lush meadows,trekking in Kashmir,offbeat,upcoming','Aru','Camping','Jun-Sep','4150','80',NULL),(3,'Harihar Fort Trek','Maharashtra','hard','2',1200.00,'A very adventurous and breath-taking trek.  ','Harihar Fort, located in the Nashik district of Maharashtra, is a stunning hill fort famous for its unique rock-cut stairs and breathtaking views of the Western Ghats. Standing at 3,676 feet (1,120 meters), this trek offers a thrilling adventure, especially with its near-vertical climb of 80-degree inclined steps.','Day 1: Arrival and Exploration\r\nMorning:\r\n\r\nReach Nashik by train or bus. Hire a cab or take local transport to the base village (Nirgudpada or Harshewadi).\r\nCheck into a homestay or campsite near the base village.\r\nAfternoon:\r\n\r\nHave a traditional Maharashtrian lunch at the base village.\r\nExplore the local area and interact with villagers for insights about the fort and trek.\r\nEvening:\r\n\r\nEnjoy a relaxed evening around a bonfire.\r\nPrepare for the trek with necessary gear, water, snacks, and comfortable clothing.\r\nStay overnight at the base village.\r\n\r\nDay 2: Harihar Fort Trek and Departure\r\nEarly Morning:\r\n\r\nStart the trek around 5:30 AM to catch the sunrise.\r\nReach the summit in 1.5–2 hours, navigating the iconic steep staircase.\r\nSpend time exploring the fort ruins, the Hanuman temple, and taking in panoramic views of the Sahyadri ranges.\r\nLate Morning:\r\n\r\nBegin the descent, taking breaks to rest and click photos.\r\nReach the base village by late morning and freshen up.\r\nAfternoon:\r\n\r\nHave lunch at the base village and relax for a bit.\r\nBegin your return journey to Nashik or your onward destination.','1. From Mumbai or Pune:\r\nBy Train:\r\n\r\nTake a train to Igatpuri or Kasara, which are the nearest major railway stations.\r\nFrom Igatpuri/Kasara, hire a cab or take local transport to Nirgudpada (around 40–50 km).\r\nBy Road:\r\n\r\nDrive or take a bus to Nashik. From Nashik, you can take a bus or taxi to the base village (around 60 km).\r\nAlternatively, you can drive directly to the base village.\r\n\r\n2. From Nashik:\r\nBy Bus:\r\nBoard a local bus to Trimbakeshwar. From there, hire a shared jeep or a private cab to reach Nirgudpada.\r\nBy Taxi:\r\nDirectly hire a cab from Nashik to Nirgudpada or Harshewadi (takes about 2 hours).','Guided trek to Harihar Fort with an experienced trek leader.\r\nTransportation from the nearest city (e.g., Nashik) to the base village and back.\r\nAccommodation in a shared homestay or tents at the base village (1 night).\r\nMeals:\r\nDay 1: Evening tea and dinner.\r\nDay 2: Breakfast and lunch.\r\nFirst-aid support during the trek.\r\nSafety equipment and trekking permits.\r\n','Transportation to the nearest city (e.g., Nashik or Kasara).\r\nSnacks, energy drinks, or personal refreshments during the trek.\r\nAny personal expenses, such as tips, phone calls, or additional food items.\r\nInsurance (travel/accidental).\r\nAnything not mentioned in the inclusions.\r\nExpenses due to unforeseen circumstances like bad weather or roadblocks.','Personal ID (e.g., Aadhaar, driver’s license)\r\nPrescription medicines (if any)\r\nToiletries (toothbrush, toothpaste, soap, etc.)\r\nSunscreen and lip balm\r\nInsect repellent\r\nCompact towel or handkerchief\r\nExtra pair of socks\r\nSmall mirror (optional)\r\nComb or hairbrush\r\nWet wipes or tissues\r\nSanitary items (if required)\r\nPower bank for charging devices\r\nMobile phone with a waterproof pouch\r\nCash (small denominations)','2025-01-21 19:41:48','HariharFortTrek.jpg','upcoming, mumbai, maharashtra','Nashik','Camping, Dormitory','Oct-Mar','1120','4',1),(4,'Deoriatal Chandrashila Trek','Uttarakhand','easy','5',8000.00,'A trek through dense forests to a scenic lake and summit.','Enjoy mesmerizing views of Himalayan peaks.','Day 1: Drive to Sari village.\r\nDay 2-4: Trek to Deoriatal and Chandrashila.\r\nDay 5: Return to Haridwar.','By Train: Take a train to Haridwar.\r\nBy Air: Fly to Dehradun.','Meals, Guide, Permits.','Transport, personal expenses.','Backpack, trekking shoes.','2025-01-28 12:13:10','DeoriatalChandrashila.jpg','lake, family, serene, adventure','Sari Village','Homestays, Camping','Sep-Jun','4000','25',NULL),(5,'Great Lakes Trek','Kashmir','moderate','8',14500.00,'A trek exploring the most beautiful lakes in Kashmir.','Walk through alpine meadows and serene lakes.','Day 1: Drive to Sonamarg.\r\nDay 2-7: Trek to Vishansar, Krishansar, and Gangbal Lakes.\r\nDay 8: Return to Srinagar.','By Air: Fly to Srinagar.','Meals, Guide, Permits.','Personal expenses, insurance.','Waterproof gear, trekking poles.','2025-01-28 12:13:10','KashmirGreatLakes.jpg','lake, kashmir, serene, adventure','Sonamarg','Camping, Guesthouses','Jul-Sep','4200','75',NULL),(6,'Kunti Betta Trek','Karnataka','easy','1',900.00,'A popular night trek in Karnataka.','Enjoy the thrill of trekking under the stars.','Day 1: Night trek to the summit and descend by morning.','By Train: Nearest station is Mandya.\r\nBy Road: Drive to the base.','Guide, Snacks.','Transport, personal items.','Torch, shoes, water.','2025-01-28 12:13:10','KuntiBettaTrek.jpg','offbeat, adventure, remote','Pandavapura','Camping, Dormitory','Oct-Feb','950','5',NULL),(7,'Sandakphu Trek','West Bengal','moderate','7',12500.00,'A trek offering views of the Everest and Kanchenjunga.','Walk along the India-Nepal border for stunning views.','Day 1: Drive to Manebhanjan.\r\nDay 2-6: Trek to Sandakphu and back.\r\nDay 7: Return to Darjeeling.','By Train: Take a train to NJP.\r\nBy Air: Fly to Bagdogra.','Meals, Guide, Permits.','Personal items, insurance.','Warm clothes, trekking poles.','2025-01-28 12:13:10','sandakphuphalut.trek.jpeg','himalayas, serene, high altitude','Manebhanjan','Tea Houses','Oct-Apr','3636','47',NULL),(8,'Rupin Pass Trek','Himachal Pradesh','hard','8',15500.00,'A high-altitude trek with stunning views.','Traverse through snow bridges, waterfalls, and alpine meadows.','Day 1: Drive to Dhaula.\r\nDay 2-7: Trek to Rupin Pass.\r\nDay 8: Return to Shimla.','By Train: Take a train to Dehradun.\r\nBy Air: Fly to Dehradun.','Meals, Permits, Camping gear.','Personal expenses, transport.','Trekking poles, warm clothes.','2025-01-28 12:13:10','rupinpass.jpeg','himalayas, adventure, extreme, high altitude','Dhaula','Camping, Homestays','May-Jun, Sep-Oct','4650','52',NULL),(9,'Chandranahan Lake Trek','Himachal Pradesh','moderate','6',9500.00,'A trek to a pristine high-altitude lake.','Explore meadows, valleys, and waterfalls.','Day 1: Drive to Janglik.\r\nDay 2-5: Trek to Chandranahan Lake and back.\r\nDay 6: Return to Shimla.','By Air: Fly to Shimla or Chandigarh.','Meals, Tents, Permits.','Insurance, personal gear.','Waterproof clothing, trekking shoes.','2025-01-28 12:13:10','ChandranahanLakeTrek.jpg','lake, serene, himalayas, adventure','Janglik','Camping, Guesthouses','Jun-Sep','4200','40',NULL),(10,'Stok Kangri Trek','Ladakh','hard','9',19000.00,'A challenging trek to the summit of Stok Kangri.','A thrilling adventure for experienced trekkers.','Day 1-2: Arrival and acclimatization in Leh.\r\nDay 3-8: Trek to Stok Kangri and return.\r\nDay 9: Depart from Leh.','By Air: Fly to Leh Airport.','Meals, Permits, Guide.','Insurance, personal expenses.','Mountaineering boots, warm layers.','2025-01-28 12:13:10','StokKangriTrek.jpg','himalayas, extreme, snow, high altitude','Stok Village','Camping, Homestays','Jul-Sep','6153','40',NULL),(11,'Beas Kund Trek','Himachal Pradesh','easy','3',4800.00,'A short trek to the origin of the Beas River.','Perfect for beginners and nature lovers.','Day 1: Trek to Dhundi.\r\nDay 2: Trek to Beas Kund.\r\nDay 3: Return to Manali.','By Air: Fly to Bhuntar.\r\nBy Road: Drive to Manali.','Meals, Guide, Permits.','Personal items, tips.','Warm layers, water bottles.','2025-01-28 12:13:10','BeasKundTrek.jpg','himalayas, family-friendly, serene','Solang Valley','Camping, Guesthouses','May-Sep','3700','16',NULL),(12,'Nag Tibba Trek','Uttarakhand','easy','2',3500.00,'A perfect weekend trek to Nag Tibba.','Ideal for beginners looking for a short adventure.','Day 1: Trek to Nag Tibba base camp.\r\nDay 2: Summit and descend.','By Air: Fly to Dehradun.\r\nBy Train: Take a train to Dehradun.','Meals, Guide, Camping gear.','Transport, personal gear.','Shoes, water, torch.','2025-01-28 12:13:10','NagTibbaTrek.jpg','family, easy, serene, adventure','Pantwari','Camping, Homestays','Oct-Mar','3022','10',NULL),(13,'Kalsubai Trek','Maharashtra','easy','1',800.00,'A trek to the highest peak in Maharashtra.','Enjoy panoramic views from the summit of Kalsubai.','Day 1: Trek to the summit and descend.','By Train: Nearest station is Kasara.\r\nBy Road: Drive to the base village.','Guide, Snacks.','Transport, personal gear.','Comfortable shoes, water.','2025-01-28 12:13:10','KalsubaiTrek.jpg','maharashtra, sahyadri, adventure','Bari','Camping, Homestays','Sep-Feb','1646','7',NULL),(14,'Tarsar Marsar Trek','Kashmir','moderate','7',12000.00,'A picturesque trek to the twin alpine lakes.','Explore the beauty of Kashmir with this serene trek.','Day 1: Drive to Aru.\r\nDay 2-6: Trek to Tarsar and Marsar Lakes.\r\nDay 7: Return to Srinagar.','By Air: Fly to Srinagar.','Meals, Tents, Permits.','Personal expenses, insurance.','Backpack, waterproof gear.','2025-01-28 12:13:10','TarsarMarsarTrek.jpg','offbeat, hidden, kashmir, lake','Aru','Camping, Guesthouses','Jun-Sep','4100','48',NULL),(15,'Kuari Pass Trek','Uttarakhand','easy','6',7800.00,'A trek with mesmerizing views of Nanda Devi and Dronagiri.','Perfect for beginners and nature lovers.','Day 1: Drive to Joshimath.\r\nDay 2-5: Trek through forests and meadows to Kuari Pass.\r\nDay 6: Return to Joshimath.','By Air: Fly to Dehradun.\r\nBy Train: Take a train to Haridwar.','Meals, Guide, Permits.','Transport, personal items.','Warm clothes, water bottles.','2025-01-28 12:13:10','KuariPassTrek.jpg','himalayas, family-friendly, scenic','Joshimath','Camping, Guesthouses','Dec-Apr','4264','33',NULL),(16,'Markha Valley Trek','Ladakh','hard','9',16000.00,'A trek through the stunning landscapes of Ladakh.','Cross rivers, high passes, and explore remote villages.','Day 1: Arrival in Leh.\r\nDay 2: Acclimatization.\r\nDay 3-8: Trek through Markha Valley.\r\nDay 9: Return to Leh.','By Air: Fly to Leh Airport.','Meals, Tents, Guide.','Insurance, flights.','Trekking poles, warm gear.','2025-01-28 12:13:10','MarkhaValleyTrek.jpg','himalayas, adventure, high altitude, remote','Leh','Homestays, Tents','Jun-Sep','5200','65',NULL),(17,'Triund Trek','Himachal Pradesh','easy','2',2500.00,'A popular trek near Dharamshala.','Experience stunning views of the Dhauladhar range.','Day 1: Trek to Triund.\r\nDay 2: Return to McLeod Ganj.','By Air: Fly to Dharamshala.\r\nBy Road: Drive to McLeod Ganj.','Meals, Guide, Accommodation.','Transport, personal gear.','Shoes, backpack, water.','2025-01-28 12:10:10','TriundTrek.jpg','family, easy, serene, himalayas','McLeod Ganj','Camping, Guesthouses','Mar-May, Sep-Nov','2875','9',NULL),(18,'Dzongri Trek','Sikkim','moderate','8',13500.00,'A trek offering panoramic views of Kanchenjunga.','A great introduction to high-altitude trekking.','Day 1: Drive from Gangtok to Yuksom.\r\nDay 2-7: Trek through dense forests and alpine meadows.\r\nDay 8: Return to Gangtok.','By Air: Fly to Bagdogra.\r\nBy Train: Take a train to NJP.','Meals, Tents, Permits.','Personal items, insurance.','Warm clothes, trekking poles.','2025-01-28 12:10:10','DzongriTrek.jpg','himalayas, snow, high altitude','Yuksom','Camping, Tea Houses','Mar-May, Sep-Nov','4170','21',NULL),(19,'Rajmachi Trek','Maharashtra','easy','2',1800.00,'A scenic trek in the Sahyadris.','Visit ancient forts amidst lush greenery.','Day 1: Trek to Rajmachi village.\r\nDay 2: Explore the forts and descend.','By Train: Nearest station is Lonavala.\r\nBy Road: Drive to Rajmachi.','Guide, Accommodation, Meals.','Transport, personal items.','Shoes, water, snacks.','2025-01-28 12:10:10','RajmachiTrek.jpg','maharashtra, lonavala, sahyadri','Lonavala','Camping, Homestays','Sep-Feb','2710','16',NULL),(20,'Kedarkantha Trek','Uttarakhand','moderate','6',9500.00,'A classic winter trek in the Himalayas.','Experience snowfall, pine forests, and breathtaking views.','Day 1: Drive to Sankri.\r\nDay 2-5: Trek to Kedarkantha summit and back.\r\nDay 6: Return to Dehradun.','By Air: Fly to Dehradun.\r\nBy Road: Drive to Sankri.','Meals, Tents, Permits.','Personal expenses, insurance.','Warm clothes, snow boots.','2025-01-28 12:10:10','KedarKanthaTrek.jpg','winter, snow, adventure, himalayas','Sankri','Camping, Homestays','Dec-Apr','3800','20',NULL),(21,'Chopta Chandrashila Trek','Uttarakhand','moderate','5',7900.00,'A trek to Tungnath Temple and Chandrashila summit.','Known for its 360-degree views of the Himalayan peaks.','Day 1: Drive to Chopta.\r\nDay 2-4: Trek to Chandrashila and back.\r\nDay 5: Return to Haridwar.','By Air: Fly to Dehradun.\r\nBy Train: Take a train to Haridwar.','Meals, Guide, Tents.','Transport, personal gear.','Backpack, trekking shoes.','2025-01-28 12:10:10','ChoptaChandrashila.jpg','himalayas, snow, serene, adventure','Chopta','Camping, Homestays','Sep-Apr','4000','15',NULL),(22,'Har Ki Dun Trek','Uttarakhand','moderate','7',9000.00,'A trek to the hanging valley of gods.','Experience ancient villages, alpine meadows, and breathtaking views of Swargarohini.','Day 1: Drive to Sankri.\r\nDay 2-6: Trek to Har Ki Dun Valley and back.\r\nDay 7: Return to Dehradun.','By Air: Fly to Dehradun.\r\nBy Train: Take a train to Haridwar.','Meals, Permits, Accommodation.','Personal expenses, insurance.','Warm layers, sturdy shoes.','2025-01-28 12:13:10','HarKiDunTrek.jpg','himalayas, serene, high altitude','Sankri','Camping, Homestays','Apr-Jun, Sep-Nov','3556','47',NULL),(23,'Chadar Trek','Ladakh','hard','9',18500.00,'A thrilling trek on the frozen Zanskar River.','Walk on a sheet of ice with temperatures dropping below -10°C.','Day 1: Arrival in Leh.\r\nDay 2: Acclimatization.\r\nDay 3: Drive to Chilling and trek to Tilad Do.\r\nDay 4-8: Trek on the frozen river.\r\nDay 9: Return to Leh.','By Air: Fly to Leh Airport.','Tents, Meals, Trek Leader.','Insurance, personal gear, flights.','Warm layers, snow boots, gloves.','2025-01-28 12:10:10','ChadarTrek.jpg','himalayas, extreme, snow, adventure','Leh','Ice Caves, Tents','Jan-Feb','3390','105',NULL),(24,'Sandhan Valley Trek','Maharashtra','moderate','2',3200.00,'A unique canyon trek in the Sahyadris.','Explore the Sandhan Valley, also called the Valley of Shadows.','Day 1: Arrival at Samrad village.\r\nDay 2: Trek through the canyon and descend to Dehne.','By Train: Nearest station is Kasara.\r\nBy Road: Drive to Samrad.','Meals, Guide, Rappelling gear.','Transport, personal expenses.','Shoes, torch, water bottle.','2025-01-28 12:10:10','SandhanValleyTrek.jpg','maharashtra, sahyadri, adventure','Samrad','Camping','Oct-Feb','1400','10',NULL),(25,'Bhrigu Lake Trek','Himachal Pradesh','easy','4',6500.00,'A short trek to a high-altitude glacial lake.','Perfect for beginners wanting to experience snow and stunning views.','Day 1: Arrival in Manali.\r\nDay 2: Trek to Gulaba.\r\nDay 3: Trek to Bhrigu Lake and back to Gulaba.\r\nDay 4: Return to Manali.','By Air: Fly to Bhuntar.\r\nBy Road: Drive to Manali.','Tents, Meals, Guide.','Personal expenses, tips.','Jackets, gloves, trekking poles.','2025-01-28 12:10:10','BhriguLakeTrek.jpg','lake, serene, snow, family-friendly','Gulaba','Camping, Guesthouses','May-Sep','4300','25',NULL),(26,'Hampta Pass Trek','Himachal Pradesh','moderate','5',8900.00,'A stunning crossover trek from Kullu Valley to Spiti Valley.','Hampta Pass Trek takes you through lush green meadows, snow bridges, and a stark desert-like landscape in Spiti.','Day 1: Arrival in Manali.\r\nDay 2: Trek to Chika.\r\nDay 3: Chika to Balu ka Ghera.\r\nDay 4: Trek to Hampta Pass and descend to Shea Goru.\r\nDay 5: Drive to Chandratal and return to Manali.','By Air: Fly to Bhuntar Airport.\r\nBy Road: Take buses to Manali.','Tents, Meals, Trek Leader, Permits.','Personal expenses, insurance, tips.','Trekking shoes, warm clothes, rain gear.','2025-01-28 12:10:10','HamptaPassTrek.jpg','himalayas, high altitude, snow, adventure','Jobra','Camping, Homestays','Jun-Sep','4270','35',NULL),(27,'Valley of Flowers Trek','Uttarakhand','easy','6',7500.00,'A vibrant trek through a UNESCO World Heritage site.','Walk amidst colorful flowers and serene valleys.','Day 1: Drive from Haridwar to Govindghat.\r\nDay 2: Trek to Ghangaria.\r\nDay 3: Explore the Valley of Flowers.\r\nDay 4: Trek to Hemkund Sahib.\r\nDay 5: Descend to Govindghat.\r\nDay 6: Drive to Haridwar.','By Air: Fly to Dehradun.\r\nBy Road: Drive from Haridwar.','Accommodation, Meals, Permits.','Personal items, tips, emergency evacuation.','Backpack, trekking poles, thermal wear.','2025-01-28 12:10:10','ValleyOfFlowersTrek.jpg','spring, flowers, family, easy','Govindghat','Camping, Guesthouses','Jul-Sep','3658','38',NULL);
/*!40000 ALTER TABLE `treks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` enum('male','female','other','prefer_no_to_say') DEFAULT 'prefer_no_to_say',
  `dob` date NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `user_role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_picture` varchar(255) DEFAULT NULL,
  `security_question` varchar(255) DEFAULT NULL,
  `security_answer_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Charlie','Brown','prefer_no_to_say','2000-01-01','charlie_brown','charlie@example.com','hashedpassword987','4444444444','user','2024-12-21 05:36:27',NULL,NULL,NULL),(9,'System','Admin','prefer_no_to_say','0000-00-00','admin','admin@example.com','$2y$10$CpGLIvb7rXWcl7z5Mpa0Pu6HjthBeaf9hnNbg1Cg/jxwe1qGn87GO','0000000000','admin','2025-02-18 16:17:14',NULL,NULL,NULL),(10,'Shreyash','Patel','male','2004-04-16','shhreyuu','shhreyuufw@gmail.com','$2y$10$6v.FD18Ytwm/.a5YgkVdge6nCKemnzi1DGLPq/8wtEr.l95RyLbCm','9537063964','user','2025-02-18 16:32:39',NULL,NULL,NULL),(12,'Rudeus','Grayrat','male','2000-10-10','rudy12','rudy12@gmail.com','$2y$10$MCCd9JI7ekP6SbsiLMwq8eOOx98r5IL70ItgoWgStKXTq0nyvESkm','9988776655','user','2025-02-18 16:40:16',NULL,NULL,NULL),(13,'Lily','Depp','female','2001-12-13','lilydepp20','lilydepp20@gmail.com','$2y$10$tnq6F2AZ./lpuhnqIt5EtOvOfD2/B0/kXhFulgagS0E/2Wbc7FxR2','9988776611','user','2025-02-18 17:08:43','uploads/1739901023_Character_Layla_Full_Wish.png',NULL,NULL),(14,'Kendrick','Lamar','male','1987-06-17','klamar12','klamar12@gmail.com','$2y$10$IRsSrJIOhwhrNHUDnk8n7O7oFmYOdon68HjzdmldFsuU6yzvDG.F6','9988776655','user','2025-03-01 14:59:29','../uploads/profile_pictures/1740841169_6b00bca4-0210-4cbc-8de8-de59e901e6bf.jpeg','What was your childhood nickname?','shhreyuu');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-19  9:44:52
