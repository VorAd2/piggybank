/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: piggybank_db
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campanhas`
--

DROP TABLE IF EXISTS `campanhas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `campanhas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `meta` decimal(8,2) NOT NULL,
  `recebido` decimal(8,2) DEFAULT 0.00,
  `descricao` varchar(255) DEFAULT NULL,
  `fk_id_usuario_criador_campanha` int(10) unsigned DEFAULT NULL,
  `fk_id_entidade_criadora_campanha` int(10) unsigned DEFAULT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_id_usuario_criador_campanha` (`fk_id_usuario_criador_campanha`),
  KEY `fk_id_entidade_criadora_campanha` (`fk_id_entidade_criadora_campanha`),
  CONSTRAINT `campanhas_ibfk_1` FOREIGN KEY (`fk_id_usuario_criador_campanha`) REFERENCES `users` (`id`),
  CONSTRAINT `campanhas_ibfk_2` FOREIGN KEY (`fk_id_entidade_criadora_campanha`) REFERENCES `users` (`id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`fk_id_usuario_criador_campanha` is not null or `fk_id_entidade_criadora_campanha` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campanhas`
--

LOCK TABLES `campanhas` WRITE;
/*!40000 ALTER TABLE `campanhas` DISABLE KEYS */;
INSERT INTO `campanhas` VALUES
(3,'Ajudar a custear a faculdade de Direito do Davi Brito',5000.00,1348.60,'Nosso Calabreso perdeu tudo e está morando de aluguel no Bom Jardim, nos ajude a realizarmos o sonho do nosso caro Davi Brito em conquistar uma certificação de curso superior',NULL,39,'2025-07-19','2025-07-20 17:01:11'),
(4,'Vaquinha para comprar uma IA para o Taveira',1240.00,1020.00,'Nosso professor favorito precisa de uma LLM',38,NULL,'2025-07-22','2025-07-23 22:42:08');
/*!40000 ALTER TABLE `campanhas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_doacoes`
--

DROP TABLE IF EXISTS `registro_doacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_doacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_id_doador` int(10) unsigned NOT NULL,
  `fk_id_campanha` int(11) NOT NULL,
  `valor_doado` decimal(8,2) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_id_doador` (`fk_id_doador`),
  KEY `fk_id_campanha` (`fk_id_campanha`),
  CONSTRAINT `registro_doacoes_ibfk_1` FOREIGN KEY (`fk_id_doador`) REFERENCES `users` (`id`),
  CONSTRAINT `registro_doacoes_ibfk_2` FOREIGN KEY (`fk_id_campanha`) REFERENCES `campanhas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_doacoes`
--

LOCK TABLES `registro_doacoes` WRITE;
/*!40000 ALTER TABLE `registro_doacoes` DISABLE KEYS */;
INSERT INTO `registro_doacoes` VALUES
(3,38,3,100.00,'2025-07-20','2025-07-20 17:00:47'),
(4,39,3,1248.60,'2025-07-20','2025-07-20 17:01:11'),
(5,38,4,900.00,'2025-07-22','2025-07-22 03:26:29'),
(6,38,4,120.00,'2025-07-23','2025-07-23 22:42:08');
/*!40000 ALTER TABLE `registro_doacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `tel` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `senha` varchar(72) NOT NULL,
  `pfp_img` varchar(100) DEFAULT NULL,
  `bio` varchar(120) DEFAULT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cnpj` varchar(14) DEFAULT NULL,
  `is_entidade` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(38,'não aguento mais','85992996658','debug@user.com','07831563299','$2y$10$Ro8KNF9yUmuuYxPDOCwjR.VCws8b0JrMgAQ0y6Qu3v9r9sI.iswBC',NULL,NULL,'2025-07-18','2025-07-18 17:44:03',NULL,0),
(39,'TESTE ENTIDADE','85992996654','debug@entidade.com',NULL,'$2y$10$38Y7c6rAuPvkE/9Hgg71LuOQthSS9eHwakrUfKVJBa7J1ZL3VcRL.',NULL,NULL,'2025-07-19','2025-07-19 03:12:58','67345699900012',1);
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

-- Dump completed on 2025-07-23 20:11:49
