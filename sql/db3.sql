-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.3.3-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.20.0.7320
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for web_project
CREATE DATABASE IF NOT EXISTS `web_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `web_project`;

-- Dumping structure for table web_project.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table web_project.categories: ~5 rows (approximately)
DELETE FROM `categories`;
INSERT INTO `categories` (`category_id`, `name`) VALUES
	(1, 'Mains'),
	(2, 'Pizza'),
	(3, 'Sides'),
	(4, 'Drinks'),
	(5, 'Desserts');

-- Dumping structure for table web_project.menu_items
CREATE TABLE IF NOT EXISTS `menu_items` (
  `item_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table web_project.menu_items: ~79 rows (approximately)
DELETE FROM `menu_items`;
INSERT INTO `menu_items` (`item_id`, `category_id`, `name`, `price`, `description`, `image_url`, `tags`) VALUES
	(1, 2, 'Kanakebab ranskalaisilla', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/43f3059e-f9fa-11e8-b58d-0a5864637fc4_KebabRanskalaisilla.jpeg', 'L'),
	(2, 1, 'Your choice', 13.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(3, 1, 'Rullakebab', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/8a056d84-f9f9-11e8-86a0-0a586463da81_Rullakebab.jpeg', 'L'),
	(4, 1, 'King Special', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/a6bfb1fa-f9f9-11e8-a5cb-0a5864600f49_KingSpecial.jpeg', 'L'),
	(5, 1, 'Kana rullakebab', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/5730c5ba-f9fa-11e8-b4d4-0a5864639458_KanaRullakebab.jpeg', 'L'),
	(6, 1, 'Kebab riisill├ñ', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/620bdc64-f9f9-11e8-abfb-0a5864638c9d_KebabRiisilla_.jpeg', 'L'),
	(7, 1, 'Kebab iskender', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/75c16cba-f9f9-11e8-aa10-0a5864600d54_KebabIskender.jpeg', 'L'),
	(8, 1, 'Aurarulla', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/947c7e1a-f9f9-11e8-89a5-0a5864600f49_Aurarulla.jpeg', 'L'),
	(9, 4, 'Pepsi Max virvoitusjuoma 0,5 l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/6982a5b4c740c0136d63e044', 'L'),
	(10, 1, 'Kanakebab King Special', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/725a5a40-f9fa-11e8-810e-0a5864600d54_KanakebabKingSpecial.jpeg', 'L'),
	(11, 1, 'Kebab ranskalaisilla + Red Bull', 15.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(12, 1, 'Pitakebab', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/59703eba-f9f9-11e8-8a75-0a586463d679_Pita.jpeg', 'L'),
	(13, 1, 'Kebab riisill├ñ', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/620bdc64-f9f9-11e8-abfb-0a5864638c9d_KebabRiisilla_.jpeg', 'L'),
	(14, 1, 'Kebab salaatilla', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/6b42c090-f9f9-11e8-aab4-0a5864637fc4_KebabaSalaatti.jpeg', 'L'),
	(15, 1, 'Kebab iskender', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/75c16cba-f9f9-11e8-aa10-0a5864600d54_KebabIskender.jpeg', 'L'),
	(16, 1, 'Kebab lohkoperunoilla', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(17, 1, 'Rullakebab', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/8a056d84-f9f9-11e8-86a0-0a586463da81_Rullakebab.jpeg', 'L'),
	(18, 1, 'Aurarulla', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/947c7e1a-f9f9-11e8-89a5-0a5864600f49_Aurarulla.jpeg', 'L'),
	(19, 1, 'King Special', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/a6bfb1fa-f9f9-11e8-a5cb-0a5864600f49_KingSpecial.jpeg', 'L'),
	(20, 1, 'Kebab Riisill├ñ + 0,33l juoma', 17.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/6aa40db40372b822c4375c74', 'L'),
	(21, 1, 'Pita kanakebab', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/0462c554-f9fa-11e8-8f79-0a5864637fc4_KanaKebabPita.jpeg', 'L'),
	(22, 1, 'Kanakebab salaatilla', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/1ad091e0-f9fa-11e8-974e-0a5864638c9d_KanaKebabSalaatti.jpeg', 'L'),
	(23, 1, 'Kanakebab iskender', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/36a3a542-f9fa-11e8-b7f8-0a5864600d54_IskenderKanakebab.jpeg', 'L'),
	(24, 1, 'Kanakebab ranskalaisilla', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/43f3059e-f9fa-11e8-b58d-0a5864637fc4_KebabRanskalaisilla.jpeg', 'L'),
	(25, 1, 'Kanakebab lohkoperunoilla', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/4e4b81ba-f9fa-11e8-8dac-0a5864600d54_KanakebabLohkoper.jpeg', 'L'),
	(26, 1, 'Kana rullakebab', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/5730c5ba-f9fa-11e8-b4d4-0a5864639458_KanaRullakebab.jpeg', 'L'),
	(27, 1, 'Kana aurarulla', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/5f5aea4a-f9fa-11e8-8ee8-0a5864638c9d_KanaAurarulla.jpeg', 'L'),
	(28, 1, 'Kanakebab King Special', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/725a5a40-f9fa-11e8-810e-0a5864600d54_KanakebabKingSpecial.jpeg', 'L'),
	(29, 1, 'V├╢ner┬« pita', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/4c93b780-f9f9-11e8-9798-0a586463fe91_Vo_7.Vo_nerPita.jpeg', 'L'),
	(30, 1, 'V├╢ner┬« ranskalaisilla', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/119c4c8c-f9f9-11e8-90aa-0a586463d679_Vo_1.Vo_nerRanskalaisilla.jpeg', 'L'),
	(31, 1, 'V├╢ner┬« iskender', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/211dce06-f9f9-11e8-bfcf-0a586463db80_Vo_2.Vo_nerIskender.jpeg', 'L'),
	(32, 1, 'V├╢ner┬« lohkoperunoilla', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/29f1111e-f9f9-11e8-9cb9-0a5864638c9d_Vo_3.Vo_nerLohkoperu.jpeg', 'L'),
	(33, 1, 'V├╢ner┬« riisill├ñ', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/3277da84-f9f9-11e8-bfe1-0a5864600f49_Vo_4.Vo_nerRiisilla_.jpeg', 'L'),
	(34, 1, 'V├╢ner┬« rulla', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/3ab16382-f9f9-11e8-ae3b-0a5864600d54_Vo_5.Vo_nerRulla.jpeg', 'L'),
	(35, 1, 'V├╢ner┬« salaatilla', 14.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/43387504-f9f9-11e8-abdd-0a5864638c9d_Vo_6.Vo_nerSalaatti.jpeg', 'L'),
	(36, 1, 'Kanafilee lisukkeella', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/7def74e4-f9fa-11e8-a802-0a586463da81_Kanafilee_lisuke.jpeg', 'L'),
	(37, 2, 'Salamipizza', 11.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/986303fc-f9f7-11e8-a1e0-0a586463d679_SalamiPizza.jpeg', 'L'),
	(38, 2, 'Tonnikala', 11.50, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(39, 2, 'Margarita Pizza', 11.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/a3835c96-f9f7-11e8-9c40-0a586463fe91_MargaritaPizza.jpeg', 'L'),
	(40, 2, 'Cheese Pizza', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/acee63ac-f9f7-11e8-a2f2-0a586463d679_CheesePizza.jpeg', 'L'),
	(41, 2, 'Frutti Di Mare Pizza', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/aefa0718-f9f8-11e8-9113-0a586463da81_FruttiDiMarePizza.jpeg', 'L'),
	(42, 2, 'Vege Pizza', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/c6b4bcf4-f9f8-11e8-abe9-0a5864600d54_VegePizza.jpeg', 'L'),
	(43, 2, 'Fireball Pizza', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/0085001a-f9f9-11e8-ba91-0a586463fe91_FireballPizza.jpeg', 'L'),
	(44, 2, 'Kebab Pizza', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/e87069ba-f9f8-11e8-8d79-0a5864638c9d_KebabPizza.jpeg', 'L'),
	(45, 2, 'Chicken Havaji Pizza', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/a4f4c564-f9f8-11e8-a77a-0a586463da81_ChickenHavaijPizza.jpeg', 'L'),
	(46, 2, 'Madonna', 12.50, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(47, 2, 'Your choice', 13.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(48, 2, 'Salami Perhepizza', 21.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/de8fef54-f9fa-11e8-9137-0a586463da81_SalamiPizza.jpeg', 'L'),
	(49, 2, 'Tonnikala Perhepizza', 21.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(50, 2, 'Margarita Perhepizza', 21.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/e84ec1d2-f9fa-11e8-9804-0a5864600d54_MargaritaPizza.jpeg', 'L'),
	(51, 2, 'Cheese Perhepizza', 22.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/f2a67bd4-f9fa-11e8-ba02-0a586463fe91_CheesePizza.jpeg', 'L'),
	(52, 2, 'Frutti Di Mare Perhepizza', 22.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/126a0238-f9fb-11e8-adbe-0a5864600839_FruttiDiMarePizza.jpeg', 'L'),
	(53, 2, 'Vege Perhepizza', 22.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/2caacc54-f9fb-11e8-a03d-0a586463db80_VegePizza.jpeg', 'L'),
	(54, 2, 'Fireball Perhepizza', 22.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/5fc5c846-f9fb-11e8-bd0a-0a5864638c9d_FireballPizza.jpeg', 'L'),
	(55, 2, 'Kebab Perhepizza', 22.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/49b6b4d4-f9fb-11e8-90ac-0a5864600d54_KebabPizza.jpeg', 'L'),
	(56, 2, 'Chicken Havaji Perhepizza', 22.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/0943bc44-f9fb-11e8-b388-0a586463db80_ChickenHavaijPizza.jpeg', 'L'),
	(57, 2, 'Madonna perhepizza', 22.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(58, 2, 'Your Choice Perhepizza', 23.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(59, 2, 'Vp1. V├╢ner Pizza', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/91e51fd0-f9fa-11e8-956c-0a5864639458_Vp1.Vo_nerPizza.jpeg', 'L'),
	(60, 2, 'Vp2. Classic Vegan', 13.50, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(61, 2, 'Vp3. Oma valinta', 14.50, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(62, 2, 'Vp1. V├╢ner pizza (perhe)', 24.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/b73ed212-f9fa-11e8-a127-0a5864637fc4_Vp1.Vo_nerPizza.jpeg', 'L'),
	(63, 2, 'Vp3. Classic Vegan (perhe)', 24.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(64, 2, 'Vp5. Vegaanin valinta (perhe)', 26.00, 'Tuore ja maistuva King Kebab -annos.', 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb?w=600&auto=format&fit=crop', 'L'),
	(65, 3, 'Ranskalaiset', 5.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/86eebb40-f9fa-11e8-9811-0a586463fe91_Ranskalaiset.jpeg', 'L'),
	(66, 4, 'Pepsi virvoitusjuoma 0,5 l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/6998f85806c644db1738d4ab', 'L'),
	(67, 4, 'Pepsi Max virvoitusjuoma 0,5 l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/6982a5b4c740c0136d63e044', 'L'),
	(68, 4, '7UP Zero Sugar virvoitusjuoma 0,5 l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/685d8ff1cbaa72e0d7cac462', 'L'),
	(69, 4, 'Pepsi virvoitusjuoma 0,33 l', 3.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/66a60fc4b02f90082bfc156b', 'L'),
	(70, 4, 'Pepsi Max virvoitusjuoma 0,33 l', 3.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/69893c16df12ec28609495d5', 'L'),
	(71, 4, 'Pepsi Max virvoitusjuoma 1,5 l', 6.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/698549309b8bf6759952ed24', 'L'),
	(72, 4, 'Hartwall Jaffa Appelsiini virvoitusjuoma 1,5 l', 6.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/6999257569f5f7b0b6949db6', 'L'),
	(73, 4, 'Hartwall Vichy Original kivenn├ñisvesi 0,5 l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/67610837aa512f184b31d981', 'L'),
	(74, 4, 'Hartwall Jaffa Ananas Sokeriton virvoitusjuoma 0,5 l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/66c4534ca2f0662a48d6d0ce', 'L'),
	(75, 4, 'Hartwall Jaffa Appelsiini virvoitusjuoma 0,33 l', 3.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/6998f38e06c644db1738d45e', 'L'),
	(76, 4, 'Red Bull Sugarfree 0,25l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/menu/menu-images/5649b72520b73d354aa73830/ec603212-010f-11ee-828d-1a43f3a12deb_red_bull_zero.jpeg', 'L'),
	(77, 4, 'Ayran 250 ml', 2.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/67389c126160d2426a948ac3', 'L'),
	(78, 4, 'Mountain Dew virvoitusjuoma 0,5 l', 3.50, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/6982b3a3879d20d22ae7ef38', 'L'),
	(79, 4, 'Pepsi virvoitusjuoma 1,5 l', 6.00, 'Tuore ja maistuva King Kebab -annos.', 'https://imageproxy.wolt.com/assets/68e8adef753abfe6b6615c8b', 'L');

-- Dumping structure for table web_project.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `2` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table web_project.order_items: ~3 rows (approximately)
DELETE FROM `order_items`;
INSERT INTO `order_items` (`order_item_id`, `order_id`, `item_id`, `quantity`) VALUES
	(14, 4, 1, 1),
	(15, 4, 2, 1),
	(16, 4, 3, 1);

-- Dumping structure for table web_project.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `pickup_time` timestamp NULL DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table web_project.orders: ~1 rows (approximately)
DELETE FROM `orders`;
INSERT INTO `orders` (`order_id`, `customer_id`, `staff_id`, `status`, `pickup_time`, `total_amount`, `created_at`) VALUES
	(4, 5, NULL, 'completed', NULL, 40.00, '2026-10-06 09:39:56');

-- Dumping structure for table web_project.payment
CREATE TABLE IF NOT EXISTS `payment` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table web_project.payment: ~0 rows (approximately)
DELETE FROM `payment`;

-- Dumping structure for table web_project.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name_unique` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table web_project.roles: ~3 rows (approximately)
DELETE FROM `roles`;
INSERT INTO `roles` (`role_id`, `role_name`) VALUES
	(0, 'customer'),
	(1, 'admin'),
	(3, 'Chef');

-- Dumping structure for table web_project.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table web_project.users: ~6 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`user_id`, `role_id`, `name`, `password_hash`, `email`, `status`) VALUES
	(1, 1, 'test', '$2b$10$K9KKjFlXCJBX54YVFSC0qeHLR3R/h74Sm7bmDWt2i.LgZo1kKggk2', 'test@test.com', 'Active'),
	(2, 1, 'test2', '$2b$10$eTi1fsRFtUhWuB.pVDUl6.z2W.h3Wikh4yRHaCm...', 'test2@test.com', 'Active'),
	(4, 3, 'Kitchen Test', '$2b$10$yTMW2veKhNOxABgnLRIk3ONWquluS7eSkXa0jc202G8iYj3WCae9W', 'kitchentest@test.com', 'Active'),
	(5, 0, 'Yuki', '$2b$10$2jxcRb9XpZq6S5h8m.gbF.QZrqIUEq316sUgLpcWQUOvCqHqOiEYu', 'test22@test.com', 'Active'),
	(6, 1, 'Admin', '$2b$10$7HMkcs6LUM8MCVDfH1dSUu5Y.7duZgPgZn3GI7xs9ox9fXg./6vyS', 'test20@test.com', 'Active'),
	(7, 3, 'yuki', '$2b$10$nAik30wbH7g8d8NssatYe./fGNq3.423jIknRMaUtum0jrZqIv2Rq', 'yukitest@test.com', 'Active');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
