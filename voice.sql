-- MySQL dump 10.13  Distrib 5.7.23, for Linux (x86_64)
--
-- Host: localhost    Database: voice
-- ------------------------------------------------------
-- Server version	5.7.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT 'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/user/2020-03-08%2013%3A41%3A21.065889.jpg',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','123456','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/user/2020-03-08%2013%3A41%3A21.065889.jpg');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer` (
  `answer_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `stage_num` int(11) DEFAULT NULL,
  PRIMARY KEY (`answer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (14,15,7,1),(15,15,5,1),(16,15,6,1),(17,15,8,2);
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `comment_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `comment_content` varchar(255) DEFAULT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  `comment_type` int(11) DEFAULT NULL COMMENT '0对视频评论，1对主题评论',
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (126,15,'Come on!',51,'1585986984563',0),(127,15,'hello world',47,'1588219380558',0),(128,15,'hello word',52,'1588944168665',0),(129,15,'hello world',39,'1588944293173',1),(130,15,'你好',52,'1589019245596',0),(131,15,'你好',39,'1589019357121',1);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `feedback_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `feedback_content` varchar(255) DEFAULT NULL,
  `feedback_status` int(4) DEFAULT '0' COMMENT '0:未处理，1已处理',
  `create_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`feedback_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `follow` (
  `follow_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `followuser_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`follow_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (44,1,1),(45,14,14),(47,15,15);
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message` (
  `message_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `message_content` varchar(255) DEFAULT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  `message_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `stage_num` int(11) DEFAULT NULL,
  `question_title` varchar(255) DEFAULT NULL,
  `question_image` varchar(255) DEFAULT NULL,
  `question_option` varchar(255) DEFAULT NULL,
  `question_correct` varchar(255) DEFAULT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (5,1,'下面哪一个是“书”呢？','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/stage/1585979368269.jpg','{\"A\":\"car\",\"B\":\"book\",\"C\":\"three\",\"D\":\"two\"}','book','1585979368342'),(6,1,'下面哪一个是“车”呢？','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/stage/1585979536515.jpg','{\"A\":\"two\",\"B\":\"America\",\"C\":\"car\",\"D\":\"book\"}','car','1585979536590'),(7,1,'请选择正确的翻译。 汉语：你的书','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/stage/1585979688252.jpg','{\"A\":\"your-book\",\"B\":\"my-books\",\"C\":\"your-cat\"}','your-book','1585979688400'),(8,2,'请选择下面翻译的正确答案。英语：How are you？','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/stage/1585980159438.jpg','{\"A\":\"你好吗？\",\"B\":\"你在吗？\",\"C\":\"你干嘛呢？\",\"D\":\"你是谁？\"}','你好吗？','1585980159537');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stage`
--

DROP TABLE IF EXISTS `stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stage` (
  `stage_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `stage_num` int(11) DEFAULT NULL COMMENT '用数字表示是第几阶段',
  `stage_title` varchar(255) DEFAULT NULL,
  `stage_banner` varchar(255) DEFAULT NULL,
  `stage_description` varchar(255) DEFAULT NULL,
  `stage_tag` varchar(255) DEFAULT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`stage_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stage`
--

LOCK TABLES `stage` WRITE;
/*!40000 ALTER TABLE `stage` DISABLE KEYS */;
INSERT INTO `stage` VALUES (6,1,'走进英语','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/stage/1585979052931.jpg','认识英语，学习英语第一步','基础学习','1585979053165'),(7,2,'英语训练营','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/stage/1585979940889.jpg','这里是英语训练营，加强你的英语学习。','进阶英语','1585979940965');
/*!40000 ALTER TABLE `stage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support`
--

DROP TABLE IF EXISTS `support`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `support` (
  `support_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `support_type` int(11) DEFAULT NULL COMMENT '0是对视频点赞，1是对主题点赞',
  `topic_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`support_id`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support`
--

LOCK TABLES `support` WRITE;
/*!40000 ALTER TABLE `support` DISABLE KEYS */;
INSERT INTO `support` VALUES (135,14,1,38),(136,15,0,51),(137,15,0,47),(141,15,0,52),(142,15,1,39),(143,15,0,50);
/*!40000 ALTER TABLE `support` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topic` (
  `topic_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `topic_content` text COMMENT '将发布内容和图片都是存放在content中',
  `create_time` varchar(50) DEFAULT NULL,
  `topic_type` varchar(50) DEFAULT NULL,
  `topic_status` int(11) DEFAULT '0' COMMENT '0是正常 1是禁用',
  PRIMARY KEY (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (36,14,'{\"text\":\"If I could, I surely would.\",\"images\":[\"http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/topic/2020-04-04%2014%3A56%3A16.499485.jpg\"]}','1585983378827','每日一语',0),(37,14,'{\"text\":\" May there be enough clouds in your life to make a beautiful sunset.\",\"images\":[]}','1585983411481','每日一语',0),(38,14,'{\"text\":\"No pains, no gains.\",\"images\":[\"http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/topic/2020-04-04%2014%3A57%3A55.484684.jpg\"]}','1585983477565','上班摸鱼',0),(39,15,'{\"text\":\"Good morning\",\"images\":[\"http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/topic/2020-05-07%2009%3A13%3A33.890177.jpg\"]}','1588814019750','每日一语',0);
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_description` varchar(255) DEFAULT '这个人很懒，什么也没留下。',
  `user_sex` varchar(11) DEFAULT '男',
  `user_birthday` varchar(255) DEFAULT '1990-01-01',
  `user_image` varchar(255) DEFAULT 'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/user/2020-03-08%2013%3A41%3A21.065889.jpg',
  `create_time` varchar(255) DEFAULT NULL,
  `user_status` int(11) DEFAULT '0' COMMENT '0是正常 1是禁用',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (14,'Kim','GOaway123!','15036889002@163.com','这个人很懒，什么也没留下。','男','1997-08-06','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/user/2020-04-04%2014%3A47%3A38.814823.jpg',NULL,0),(15,'hubvue12','GOqwe123!','1191340528@qq.com','这个人很懒，什么也没留下。','男','1990-01-01','http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/user/2020-05-09%2018%3A18%3A27.074475.jpg',NULL,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `video` (
  `video_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `video_description` varchar(255) DEFAULT NULL,
  `video_share` int(32) DEFAULT '0',
  `create_time` varchar(255) DEFAULT NULL,
  `video_status` int(11) DEFAULT '0' COMMENT '0是正常 1是禁用',
  `video_banner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`video_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES (45,14,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126158471584612615847embracefear.mp4','拥抱内心的恐惧，战胜它（一）。',0,'1585982101519',0,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126575221584612657522VCG41N504487318_cover.jpg'),(46,14,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126158471584612615847embracefear%20(1).mp4','拥抱内心的恐惧，战胜它（二）。',0,'1585982305390',0,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126575221584612657522VCG41N504487318_cover.jpg'),(47,14,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126158471584612615847embracefear%20(2).mp4','拥抱内心的恐惧，战胜它（三）',0,'1585982400573',0,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126575221584612657522VCG41N504487318_cover.jpg'),(49,14,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126158471584612615847embracefear%20(3).mp4','拥抱内心的恐惧，战胜它（四）。',0,'1585982534651',0,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126575221584612657522VCG41N504487318_cover.jpg'),(50,14,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126158471584612615847embracefear%20(4).mp4','拥抱内心的恐惧，战胜它（五）。',0,'1585982640421',0,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126575221584612657522VCG41N504487318_cover.jpg'),(51,14,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126158471584612615847embracefear%20(5).mp4','拥抱内心的恐惧，战胜它（六）。',2,'1585982737170',0,'http://kimvoice.oss-cn-beijing.aliyuncs.com/voice/video/15846126575221584612657522VCG41N504487318_cover.jpg');
/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-31 22:40:18
