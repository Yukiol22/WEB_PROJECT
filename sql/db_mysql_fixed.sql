/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-13.0.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: web_project
-- ------------------------------------------------------
-- Server version	13.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `item_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `fk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES
(1,NULL,'Kanakebab ranskalaisilla',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/43f3059e-f9fa-11e8-b58d-0a5864637fc4_KebabRanskalaisilla.jpeg','L'),
(2,NULL,'Your choice',13.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(3,NULL,'Rullakebab',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/8a056d84-f9f9-11e8-86a0-0a586463da81_Rullakebab.jpeg','L'),
(4,NULL,'King Special',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/a6bfb1fa-f9f9-11e8-a5cb-0a5864600f49_KingSpecial.jpeg','L'),
(5,NULL,'Kana rullakebab',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/5730c5ba-f9fa-11e8-b4d4-0a5864639458_KanaRullakebab.jpeg','L'),
(6,NULL,'Kebab riisill├ñ',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/620bdc64-f9f9-11e8-abfb-0a5864638c9d_KebabRiisilla_.jpeg','L'),
(7,NULL,'Kebab iskender',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/75c16cba-f9f9-11e8-aa10-0a5864600d54_KebabIskender.jpeg','L'),
(8,NULL,'Aurarulla',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/947c7e1a-f9f9-11e8-89a5-0a5864600f49_Aurarulla.jpeg','L'),
(9,NULL,'Pepsi Max virvoitusjuoma 0,5 l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/6982a5b4c740c0136d63e044','L'),
(10,NULL,'Kanakebab King Special',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/725a5a40-f9fa-11e8-810e-0a5864600d54_KanakebabKingSpecial.jpeg','L'),
(11,NULL,'Kebab ranskalaisilla + Red Bull',15.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(12,NULL,'Pitakebab',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/59703eba-f9f9-11e8-8a75-0a586463d679_Pita.jpeg','L'),
(13,NULL,'Kebab riisill├ñ',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/620bdc64-f9f9-11e8-abfb-0a5864638c9d_KebabRiisilla_.jpeg','L'),
(14,NULL,'Kebab salaatilla',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/6b42c090-f9f9-11e8-aab4-0a5864637fc4_KebabaSalaatti.jpeg','L'),
(15,NULL,'Kebab iskender',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/75c16cba-f9f9-11e8-aa10-0a5864600d54_KebabIskender.jpeg','L'),
(16,NULL,'Kebab lohkoperunoilla',13.50,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(17,NULL,'Rullakebab',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/8a056d84-f9f9-11e8-86a0-0a586463da81_Rullakebab.jpeg','L'),
(18,NULL,'Aurarulla',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/947c7e1a-f9f9-11e8-89a5-0a5864600f49_Aurarulla.jpeg','L'),
(19,NULL,'King Special',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/a6bfb1fa-f9f9-11e8-a5cb-0a5864600f49_KingSpecial.jpeg','L'),
(20,NULL,'Kebab Riisill├ñ + 0,33l juoma',17.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/6aa40db40372b822c4375c74','L'),
(21,NULL,'Pita kanakebab',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/0462c554-f9fa-11e8-8f79-0a5864637fc4_KanaKebabPita.jpeg','L'),
(22,NULL,'Kanakebab salaatilla',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/1ad091e0-f9fa-11e8-974e-0a5864638c9d_KanaKebabSalaatti.jpeg','L'),
(23,NULL,'Kanakebab iskender',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/36a3a542-f9fa-11e8-b7f8-0a5864600d54_IskenderKanakebab.jpeg','L'),
(24,NULL,'Kanakebab ranskalaisilla',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/43f3059e-f9fa-11e8-b58d-0a5864637fc4_KebabRanskalaisilla.jpeg','L'),
(25,NULL,'Kanakebab lohkoperunoilla',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/4e4b81ba-f9fa-11e8-8dac-0a5864600d54_KanakebabLohkoper.jpeg','L'),
(26,NULL,'Kana rullakebab',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/5730c5ba-f9fa-11e8-b4d4-0a5864639458_KanaRullakebab.jpeg','L'),
(27,NULL,'Kana aurarulla',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/5f5aea4a-f9fa-11e8-8ee8-0a5864638c9d_KanaAurarulla.jpeg','L'),
(28,NULL,'Kanakebab King Special',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/725a5a40-f9fa-11e8-810e-0a5864600d54_KanakebabKingSpecial.jpeg','L'),
(29,NULL,'V├╢ner┬« pita',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/4c93b780-f9f9-11e8-9798-0a586463fe91_Vo_7.Vo_nerPita.jpeg','L'),
(30,NULL,'V├╢ner┬« ranskalaisilla',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/119c4c8c-f9f9-11e8-90aa-0a586463d679_Vo_1.Vo_nerRanskalaisilla.jpeg','L'),
(31,NULL,'V├╢ner┬« iskender',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/211dce06-f9f9-11e8-bfcf-0a586463db80_Vo_2.Vo_nerIskender.jpeg','L'),
(32,NULL,'V├╢ner┬« lohkoperunoilla',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/29f1111e-f9f9-11e8-9cb9-0a5864638c9d_Vo_3.Vo_nerLohkoperu.jpeg','L'),
(33,NULL,'V├╢ner┬« riisill├ñ',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/3277da84-f9f9-11e8-bfe1-0a5864600f49_Vo_4.Vo_nerRiisilla_.jpeg','L'),
(34,NULL,'V├╢ner┬« rulla',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/3ab16382-f9f9-11e8-ae3b-0a5864600d54_Vo_5.Vo_nerRulla.jpeg','L'),
(35,NULL,'V├╢ner┬« salaatilla',14.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/43387504-f9f9-11e8-abdd-0a5864638c9d_Vo_6.Vo_nerSalaatti.jpeg','L'),
(36,NULL,'Kanafilee lisukkeella',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/7def74e4-f9fa-11e8-a802-0a586463da81_Kanafilee_lisuke.jpeg','L'),
(37,NULL,'Salamipizza',11.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/986303fc-f9f7-11e8-a1e0-0a586463d679_SalamiPizza.jpeg','L'),
(38,NULL,'Tonnikala',11.50,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(39,NULL,'Margarita Pizza',11.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/a3835c96-f9f7-11e8-9c40-0a586463fe91_MargaritaPizza.jpeg','L'),
(40,NULL,'Cheese Pizza',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/acee63ac-f9f7-11e8-a2f2-0a586463d679_CheesePizza.jpeg','L'),
(41,NULL,'Frutti Di Mare Pizza',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/aefa0718-f9f8-11e8-9113-0a586463da81_FruttiDiMarePizza.jpeg','L'),
(42,NULL,'Vege Pizza',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/c6b4bcf4-f9f8-11e8-abe9-0a5864600d54_VegePizza.jpeg','L'),
(43,NULL,'Fireball Pizza',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/0085001a-f9f9-11e8-ba91-0a586463fe91_FireballPizza.jpeg','L'),
(44,NULL,'Kebab Pizza',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/e87069ba-f9f8-11e8-8d79-0a5864638c9d_KebabPizza.jpeg','L'),
(45,NULL,'Chicken Havaji Pizza',12.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/a4f4c564-f9f8-11e8-a77a-0a586463da81_ChickenHavaijPizza.jpeg','L'),
(46,NULL,'Madonna',12.50,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(47,NULL,'Your choice',13.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(48,NULL,'Salami Perhepizza',21.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/de8fef54-f9fa-11e8-9137-0a586463da81_SalamiPizza.jpeg','L'),
(49,NULL,'Tonnikala Perhepizza',21.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(50,NULL,'Margarita Perhepizza',21.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/e84ec1d2-f9fa-11e8-9804-0a5864600d54_MargaritaPizza.jpeg','L'),
(51,NULL,'Cheese Perhepizza',22.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/f2a67bd4-f9fa-11e8-ba02-0a586463fe91_CheesePizza.jpeg','L'),
(52,NULL,'Frutti Di Mare Perhepizza',22.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/126a0238-f9fb-11e8-adbe-0a5864600839_FruttiDiMarePizza.jpeg','L'),
(53,NULL,'Vege Perhepizza',22.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/2caacc54-f9fb-11e8-a03d-0a586463db80_VegePizza.jpeg','L'),
(54,NULL,'Fireball Perhepizza',22.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/5fc5c846-f9fb-11e8-bd0a-0a5864638c9d_FireballPizza.jpeg','L'),
(55,NULL,'Kebab Perhepizza',22.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/49b6b4d4-f9fb-11e8-90ac-0a5864600d54_KebabPizza.jpeg','L'),
(56,NULL,'Chicken Havaji Perhepizza',22.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/0943bc44-f9fb-11e8-b388-0a586463db80_ChickenHavaijPizza.jpeg','L'),
(57,NULL,'Madonna perhepizza',22.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(58,NULL,'Your Choice Perhepizza',23.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(59,NULL,'Vp1. V├╢ner Pizza',13.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/91e51fd0-f9fa-11e8-956c-0a5864639458_Vp1.Vo_nerPizza.jpeg','L'),
(60,NULL,'Vp2. Classic Vegan',13.50,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(61,NULL,'Vp3. Oma valinta',14.50,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(62,NULL,'Vp1. V├╢ner pizza (perhe)',24.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/b73ed212-f9fa-11e8-a127-0a5864637fc4_Vp1.Vo_nerPizza.jpeg','L'),
(63,NULL,'Vp3. Classic Vegan (perhe)',24.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(64,NULL,'Vp5. Vegaanin valinta (perhe)',26.00,'Tuore ja maistuva King Kebab -annos.','https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop','L'),
(65,NULL,'Ranskalaiset',5.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/86eebb40-f9fa-11e8-9811-0a586463fe91_Ranskalaiset.jpeg','L'),
(66,NULL,'Pepsi virvoitusjuoma 0,5 l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/6998f85806c644db1738d4ab','L'),
(67,NULL,'Pepsi Max virvoitusjuoma 0,5 l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/6982a5b4c740c0136d63e044','L'),
(68,NULL,'7UP Zero Sugar virvoitusjuoma 0,5 l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/685d8ff1cbaa72e0d7cac462','L'),
(69,NULL,'Pepsi virvoitusjuoma 0,33 l',3.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/66a60fc4b02f90082bfc156b','L'),
(70,NULL,'Pepsi Max virvoitusjuoma 0,33 l',3.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/69893c16df12ec28609495d5','L'),
(71,NULL,'Pepsi Max virvoitusjuoma 1,5 l',6.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/698549309b8bf6759952ed24','L'),
(72,NULL,'Hartwall Jaffa Appelsiini virvoitusjuoma 1,5 l',6.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/6999257569f5f7b0b6949db6','L'),
(73,NULL,'Hartwall Vichy Original kivenn├ñisvesi 0,5 l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/67610837aa512f184b31d981','L'),
(74,NULL,'Hartwall Jaffa Ananas Sokeriton virvoitusjuoma 0,5 l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/66c4534ca2f0662a48d6d0ce','L'),
(75,NULL,'Hartwall Jaffa Appelsiini virvoitusjuoma 0,33 l',3.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/6998f38e06c644db1738d45e','L'),
(76,NULL,'Red Bull Sugarfree 0,25l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/menu/menu-images/5649b72520b73d354aa73830/ec603212-010f-11ee-828d-1a43f3a12deb_red_bull_zero.jpeg','L'),
(77,NULL,'Ayran 250 ml',2.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/67389c126160d2426a948ac3','L'),
(78,NULL,'Mountain Dew virvoitusjuoma 0,5 l',3.50,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/6982b3a3879d20d22ae7ef38','L'),
(79,NULL,'Pepsi virvoitusjuoma 1,5 l',6.00,'Tuore ja maistuva King Kebab -annos.','https://imageproxy.wolt.com/assets/68e8adef753abfe6b6615c8b','L');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `fk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_3` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `pickup_time` timestamp NULL DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `fk_4` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_5` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `fk_6` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES
(0,'customer'),
(1,'admin');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `fk_7` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,1,'test','$2b$10$eTi1fsRFtUhWuB.pVDUl6.z2W.h3Wikh4yRHaCmVRbkZs7XQEM.D.','test@test.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-09-30 18:03:38
