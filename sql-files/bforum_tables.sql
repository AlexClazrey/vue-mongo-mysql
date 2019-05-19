-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bforum
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `bforum` ;

-- -----------------------------------------------------
-- Schema bforum
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bforum` DEFAULT CHARACTER SET utf8mb4 ;
USE `bforum` ;

-- -----------------------------------------------------
-- Table `bforum`.`file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`file` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `path` VARCHAR(200) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `file_name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` VARCHAR(50) NOT NULL,
  `nickname` VARCHAR(50) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `password_edit_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` VARCHAR(100) NOT NULL,
  `email_verified` TINYINT NOT NULL DEFAULT 0,
  `portrait` INT NULL,
  `mobile` VARCHAR(50) NULL,
  `deleted` TINYINT NOT NULL DEFAULT 0,
  `salt` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `portrait_idx` (`portrait` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `del_idx` (`deleted` ASC) VISIBLE,
  CONSTRAINT `fk_portrait`
    FOREIGN KEY (`portrait`)
    REFERENCES `bforum`.`file` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`post_content`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`post_content` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_post_content_post1_idx` (`post_id` ASC) INVISIBLE,
  INDEX `pc_time_idx` (`time` DESC) INVISIBLE,
  INDEX `pc_title_idx` (`title` ASC) VISIBLE,
  CONSTRAINT `fk_post_content_post1`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`post` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `hits` INT NOT NULL DEFAULT 0,
  `hot` TINYINT NOT NULL DEFAULT 0,
  `hide` TINYINT NOT NULL DEFAULT 0,
  `deleted` TINYINT NOT NULL DEFAULT 0,
  `post_content_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_post_post_content1_idx` (`post_content_id` ASC) VISIBLE,
  INDEX `del_hide_idx` (`deleted` ASC, `hide` ASC) VISIBLE,
  CONSTRAINT `fk_post_post_content1`
    FOREIGN KEY (`post_content_id`)
    REFERENCES `bforum`.`post_content` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`board`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`board` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`mail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`mail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sender` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `mail_title_idx` (`title` ASC) INVISIBLE,
  INDEX `fk_mail_user1_idx` (`sender` ASC) VISIBLE,
  CONSTRAINT `fk_mail_user1`
    FOREIGN KEY (`sender`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`mailbox`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`mailbox` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_mailbox_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_mailbox_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `priority` INT NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `priority_UNIQUE` (`priority` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`privilege`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`privilege` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `pri_name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`post_to_board`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`post_to_board` (
  `post_id` INT NOT NULL,
  `board_id` INT NOT NULL,
  PRIMARY KEY (`post_id`, `board_id`),
  INDEX `board_idx` (`board_id` ASC) VISIBLE,
  CONSTRAINT `fk_post_to_board_board`
    FOREIGN KEY (`board_id`)
    REFERENCES `bforum`.`board` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_post_to_board_post`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`post_to_file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`post_to_file` (
  `file_id` INT NOT NULL,
  `post_content_id` INT NOT NULL,
  PRIMARY KEY (`file_id`, `post_content_id`),
  INDEX `fk_post_to_file_post_content1_idx` (`post_content_id` ASC) VISIBLE,
  CONSTRAINT `fk_post_to_file_file1`
    FOREIGN KEY (`file_id`)
    REFERENCES `bforum`.`file` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_post_to_file_post_content1`
    FOREIGN KEY (`post_content_id`)
    REFERENCES `bforum`.`post_content` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`reply`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`reply` (
  `parent_id` INT NOT NULL,
  `child_id` INT NOT NULL,
  PRIMARY KEY (`parent_id`, `child_id`),
  INDEX `fk_reply_post2_idx` (`child_id` ASC) VISIBLE,
  CONSTRAINT `fk_reply_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_reply_child`
    FOREIGN KEY (`child_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`favorite_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`favorite_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_favorite_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_favorite_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`commit_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`commit_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_commit_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_commit_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`history_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`history_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_history_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_history_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`draft_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`draft_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edit_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_content_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `fk_draft_post_post1_idx` (`post_id` ASC) VISIBLE,
  INDEX `fk_draft_post_post_content1_idx` (`post_content_id` ASC) VISIBLE,
  CONSTRAINT `fk_draft_post_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_draft_post_post1`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_draft_post_post_content1`
    FOREIGN KEY (`post_content_id`)
    REFERENCES `bforum`.`post_content` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`like_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`like_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `dislike` TINYINT NOT NULL DEFAULT 0,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_like_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_like_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`pick_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`pick_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `cancel` TINYINT NOT NULL DEFAULT 0,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_pick_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pick_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`top_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`top_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `cancel` TINYINT NOT NULL DEFAULT 0,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_top_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_top_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`protect_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`protect_post` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `cancel` TINYINT NOT NULL DEFAULT 0,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_protect_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_protect_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `bforum`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`at`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`at` (
  `target_id` INT NOT NULL,
  `post_content_id` INT NOT NULL,
  PRIMARY KEY (`target_id`, `post_content_id`),
  INDEX `fk_at_post_content1_idx` (`post_content_id` ASC) VISIBLE,
  CONSTRAINT `fk_at_target`
    FOREIGN KEY (`target_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_at_post_content1`
    FOREIGN KEY (`post_content_id`)
    REFERENCES `bforum`.`post_content` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`user_to_mailbox`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`user_to_mailbox` (
  `user_id` INT NOT NULL,
  `mailbox_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `mailbox_id`),
  INDEX `mailbox_id_idx` (`mailbox_id` ASC) VISIBLE,
  CONSTRAINT `fk_mailbox_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_mailbox_mailbox_id`
    FOREIGN KEY (`mailbox_id`)
    REFERENCES `bforum`.`mailbox` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`user_to_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`user_to_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `board_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `group_id_idx` (`group_id` ASC) VISIBLE,
  INDEX `board_id_idx` (`board_id` ASC) VISIBLE,
  CONSTRAINT `fk_group_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_group_group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `bforum`.`group` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_group_board_id`
    FOREIGN KEY (`board_id`)
    REFERENCES `bforum`.`board` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'board_id is null means all board.';


-- -----------------------------------------------------
-- Table `bforum`.`blacklist`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`blacklist` (
  `user_id` INT NOT NULL,
  `target_id` INT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `target_id`),
  INDEX `target_id_idx` (`target_id` ASC) VISIBLE,
  CONSTRAINT `fk_blacklist_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_blacklist_target_id`
    FOREIGN KEY (`target_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`follow`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`follow` (
  `user_id` INT NOT NULL,
  `target_id` INT NOT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `target_id`),
  INDEX `target_id_idx` (`target_id` ASC) VISIBLE,
  CONSTRAINT `fk_follow_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_follow_target_id`
    FOREIGN KEY (`target_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`group_to_privilege`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`group_to_privilege` (
  `group_id` INT NOT NULL,
  `privilege_id` INT NOT NULL,
  `permit` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`group_id`, `privilege_id`),
  INDEX `privilige_idx` (`privilege_id` ASC) VISIBLE,
  CONSTRAINT `fk_privilege_group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `bforum`.`group` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_privilege_privilege_id`
    FOREIGN KEY (`privilege_id`)
    REFERENCES `bforum`.`privilege` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`mail_to_mailbox`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`mail_to_mailbox` (
  `mail_id` INT NOT NULL,
  `mailbox_id` INT NOT NULL,
  `is_read` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`mail_id`, `mailbox_id`),
  INDEX `fk_mail_to_mailbox_mailbox1_idx` (`mailbox_id` ASC) VISIBLE,
  CONSTRAINT `fk_mail_to_mailbox_mail`
    FOREIGN KEY (`mail_id`)
    REFERENCES `bforum`.`mail` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_mail_to_mailbox_mailbox`
    FOREIGN KEY (`mailbox_id`)
    REFERENCES `bforum`.`mailbox` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bforum`.`cookies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`cookies` (
  `user_id` INT NOT NULL,
  `val` VARCHAR(45) NOT NULL,
  `ip` VARCHAR(45) NOT NULL,
  `created_time` DATETIME NOT NULL DEFAULT current_timestamp,
  `last_used_time` DATETIME NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`val`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_cookies_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bforum`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

USE `bforum` ;

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_mail_core`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_mail_core` (`uid` INT, `mbid` INT, `mid` INT, `is_read` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_mail_count_all`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_mail_count_all` (`uid` INT, `amount` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_privilege_core`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_privilege_core` (`uid` INT, `gid` INT, `bid` INT, `group_name` INT, `priority` INT, `pri_id` INT, `permit` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_privilege`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_privilege` (`uid` INT, `gid` INT, `bid` INT, `group_name` INT, `pri_id` INT, `permit` INT, `pri_name` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_mail_count_by_box`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_mail_count_by_box` (`uid` INT, `mbid` INT, `amount` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_mail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_mail` (`uid` INT, `mbid` INT, `mid` INT, `title` INT, `content` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_ubp_core`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_ubp_core` (`pid` INT, `bid` INT, `uid` INT, `commit_time` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_pick`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_pick` (`pid` INT, `uid` INT, `cancel` INT, `time` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_top`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_top` (`pid` INT, `uid` INT, `cancel` INT, `time` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_protect`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_protect` (`pid` INT, `uid` INT, `cancel` INT, `time` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_addon`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_addon` (`pid` INT, `pick_uid` INT, `pick_cancel` INT, `pick_time` INT, `protect_uid` INT, `protect_cancel` INT, `protect_time` INT, `top_uid` INT, `top_cancel` INT, `top_time` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_content`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_content` (`pid` INT, `pcid` INT, `title` INT, `content` INT, `last_edit_time` INT, `hits` INT, `hot` INT, `hide` INT, `deleted` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_reply_content`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_reply_content` (`p_pid` INT, `c_pid` INT, `c_pcid` INT, `title` INT, `content` INT, `last_edit_time` INT, `hits` INT, `hot` INT, `hide` INT, `deleted` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_reply_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_reply_list` (`p_pid` INT, `c_pid` INT, `uid` INT, `title` INT, `content` INT, `nickname` INT, `portrait` INT, `commit_time` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_board`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_board` (`id` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_reply_time`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_reply_time` (`pid` INT, `time` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_ubp_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_ubp_list` (`bid` INT, `pid` INT, `uid` INT, `nickname` INT, `portrait` INT, `title` INT, `content` INT, `commit_time` INT, `last_reply_time` INT, `hot` INT, `hits` INT, `pick` INT, `top` INT, `protect` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_post_relation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_post_relation` (`pid` INT, `p_pid` INT, `bid` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_draft`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_draft` (`uid` INT, `pid` INT, `created_time` INT, `last_edit_time` INT, `p_pid` INT, `bid` INT, `title` INT, `content` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_post` (`pid` INT, `pcid` INT, `uid` INT, `title` INT, `content` INT, `last_edit_time` INT, `hits` INT, `hot` INT, `hide` INT, `deleted` INT, `commit_time` INT, `bid` INT, `p_pid` INT);

-- -----------------------------------------------------
-- Placeholder table for view `bforum`.`v_user_fav`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bforum`.`v_user_fav` (`uid` INT, `pid` INT, `p_pid` INT, `bid` INT, `title` INT, `content` INT, `commit_time` INT);

-- -----------------------------------------------------
-- procedure user_register
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
create procedure `user_register` (
IN _username varchar(50), 
IN _nickname varchar(50), 
IN _pass varchar(50), 
IN _salt varchar(50),
IN _email varchar(100),
out _uid int)
BEGIN
	declare nameOccupied int;
    declare emailUsed int;
    
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
	set nameOccupied = (select id from `user` where `username` = _username limit 1);
    set emailUsed = (select id from `user` where `email` = _email limit 1);
    if(nameOccupied is not null or emailUsed is not null) then
		call debug_msg(@debug, concat("user register name/email is occupied", _username, _email));
		set _uid = -1;
	else
		insert into `user`(`username`, `nickname`, `password`, `salt`, `email`) values (_username, _nickname, sha1(sha1(concat(_pass, _salt))), _salt, _email);
		set _uid = last_insert_id();
	end if;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_board
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_board` (in _board_name varchar(45), out _bid int)
BEGIN
	insert into `board`(`name`) values(_board_name);
    set _bid = last_insert_id();
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_post
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_post` (in _title varchar(200), in _content text, out _pid INT)
BEGIN
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
	insert into post() values();
    set _pid = last_insert_id();
    insert into `post_content`(`post_id`, `title`, `content`) values (_pid, _title, _content);
    update `post` set `post_content_id` = last_insert_id() where `id`= _pid;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure commit_post
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `commit_post` (in _uid int, in _pid int)
BEGIN
	declare _pcid int;
    declare cnt int;
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
    -- check if from draft
    set _pcid = (select `post_content_id` from `draft_post` where `post_id` = _pid and `user_id` = _uid);
    if _pcid is not null then 
		update post set `post_content_id` = _pcid where `id` = _pid;
	end if;
    -- check if has commit
	set cnt = (select count(*) from `commit_post` where `user_id` = _uid and `post_id` = _pid);
    if cnt = 0 then
		insert into `commit_post`(`user_id`, `post_id`) values(_uid, _pid);
	end if;
	-- delete draft at the end
	delete from `draft_post` where `user_id` = _uid and `post_id` = _pid;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_post_to_board
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_post_to_board` (in _pid int, in _bid int)
BEGIN
	insert into post_to_board(post_id, board_id) values (_pid, _bid);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_post_board
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `get_post_board` (in _pid int, out _bid int)
BEGIN
	set _bid = (select `bid` from `v_post_board` where `v_post_board`.`pid` = _pid limit 1);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_post_to_reply
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_post_to_reply` (in _c_pid int, in _p_pid int, out _success int)
BEGIN
	-- 检查parent是否已经是回复
	set _success = (select `child_id` from `reply` where child_id=_p_pid limit 1);
    if _success is null then
		insert into `reply`(`parent_id`, `child_id`) values (_p_pid, _c_pid);
        set _success=1;
    else
		set _success=0;
    end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure user_login
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `user_login` (in _username varchar(50), in _pass varchar(50), out _uid int)
BEGIN
	set _uid = (select id from `user` where `username` = _username and `password` = sha1(sha1(concat(_pass, `salt`))) limit 1);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_cookies
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_cookies` (in _uid int, in _ip varchar(45), in _val varchar(45))
BEGIN
	replace into `cookies`(`user_id`, `ip`, `val`) values (_uid, _ip, _val);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_group
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_group` (in _group_name varchar(45), in _pri int, out _group_id int)
BEGIN
	insert into `group`(`name`, `priority`) values (_group_name, _pri);
    set _group_id = last_insert_id();
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_privilege
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_privilege` (in _pri_name varchar(45), out _pri_id int)
BEGIN
	insert into privilege(`name`) values (_pri_name);
    set _pri_id = last_insert_id();
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_privilege_to_group
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_privilege_to_group` (in _pri_id int, in _gid int, in _permit tinyint)
BEGIN
	insert into `group_to_privilege`(`group_id`, `privilege_id`, `permit`) values (_gid, _pri_id, _permit);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_user_to_group
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_user_to_group` (in _uid int, in _gid int, in _bid int)
BEGIN
	insert into `user_to_group`(`user_id`, `group_id`, `board_id`) values (_uid, _gid, _bid);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure check_cookies
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `check_cookies` (in _uid int, in _val varchar(45), out _success int)
BEGIN
	declare ltime datetime;
	set ltime = (select `last_used_time` from `cookies` where `user_id` = _uid and `val` = _val limit 1);
    if ltime + interval 1 hour > now() then
		set _success = 1;
	else
		delete from cookies where `user_id` = _uid and `val` = _val limit 1;
		set _success = 0;
	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure check_privilege
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `check_privilege` (in _uid int, in _bid int, in _pri_name varchar(45), out _permit int)
BEGIN
	set _permit = (select `permit` 
		from v_user_privilege up 
		where `up`.`uid`=_uid and (`up`.`bid`=_bid or `up`.`bid` is null) and `up`.`pri_name` = _pri_name 
		order by `bid` desc 
		limit 1);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_cookies
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `update_cookies` (in _uid int, in _val varchar(45), out _success int)
BEGIN
	declare _checked int;
	call check_cookies(_uid, _val, _checked);
    if _checked then
		update `cookies` set `last_used_time` = current_timestamp where `cookies`.`user_id` = _uid and `cookies`.`val` = _val;
    end if;
    set _success = _checked;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure draft_post
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `draft_post` (in _uid int, in _pid int, in _pcid int)
BEGIN
    insert into `draft_post`(`user_id`, `post_id`, `post_content_id`) values (_uid, _pid, _pcid);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure edit_draft
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `edit_draft` (in _uid int,  in _pid int, in _title varchar(200), in _content text)
BEGIN
	declare _pcid int default null;
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
    -- pick pcid from draft
    set _pcid = (select `post_content_id` from `draft_post` where `draft_post`.`post_id` = _pid limit 1);
    -- edit post content
    update `post_content` set `title` = _title, `content` = _content where `id` = _pcid;
    -- update draft timestamp
    update draft_post set `last_edit_time` = current_timestamp where `post_id` = _pid and `user_id` = _uid;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_cookies
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_cookies` (in _val varchar(45))
BEGIN
	delete from `cookies` where `cookies`.`val` = _val;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure save_draft
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `save_draft` (in _uid int, in _pid int, in _title varchar(200), in _content text, out _res_pid int)
BEGIN
	declare cnt int;
    declare _pcid int;
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
    if _pid is null or _pid <= 0 then
		-- new post init save
		call add_post(_title, _content, _pid);
        set _pcid = (select `post_content_id` from post where `id` = _pid);
		call draft_post(_uid, _pid, _pcid);
    else
		-- old post draft save
		-- check has draft
		set cnt = (select count(*) from `draft_post` where `user_id` = _uid and `post_id` = _pid);
		if cnt > 0 then
			call edit_draft(_uid, _pid, _title, _content);
		else
			insert into `post_content`(`post_id`, `title`, `content`) values (_pid, _title, _content);
			set _pcid = last_insert_id();
			call draft_post(_uid, _pid, _pcid);
		end if;
	end if;
    set _res_pid = _pid;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure change_post_to_board
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `change_post_to_board` (in _pid int, in _bid int)
BEGIN
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
	delete from `post_to_board` where `post_id` = _pid;
    call add_post_to_board(_pid, _bid);
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure change_post_to_reply
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `change_post_to_reply` (in _c_pid int, in _p_pid int, out _success int)
BEGIN
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
	delete from `reply` where `child_id` = _c_pid;
    call add_post_to_reply(_c_pid, _p_pid, _success);
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_post_user
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_post_user` (in _pid int)
BEGIN
	update post set deleted = 1 where `id` = _pid;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_post_admin
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_post_admin` (in _pid int)
BEGIN
    declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end;
    
    start transaction;
	update post set `post_content_id`=null where `id` = _pid;
    delete from post where `id` = _pid;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_draft
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_draft` (in _uid int, in _pid int)
BEGIN
	declare _pcid int;
    set _pcid = (select `post_content_id` from draft_post where `user_id`=_uid and `post_id`=_pid);
    delete from post_content where `id` = _pcid;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_user_admin
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_user_admin` (in _uid int)
BEGIN
	-- this will cascade to mailbox, mail_to_mailbox, user_to_group, all post_actions but not posts
	delete from `user` where `id` = _uid;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_user_from_group
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_user_from_group` (in _id int)
BEGIN
	delete from `user_to_group` where `id` = _id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_privilege_from_group
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_privilege_from_group` (in _pri_id int, in _gid int)
BEGIN
	delete from `group_to_privilege` where `group_id` = _gid and `privilege_id` = _pri_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_group
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_group` (in _gid int)
BEGIN
	delete from `group` where `id` = _gid;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_privilege
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_privilege` (in _pri_id int)
BEGIN
	delete from privilege where `id` = _pri_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_fav_post
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `add_fav_post` (in _uid int, in _pid int)
BEGIN
	insert into `favorite_post`(user_id, post_id) values (_uid, _pid);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_fav_post
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_fav_post` (in _uid int, in _pid int)
BEGIN
	delete from `favorite_post` where `user_id` = _uid and `post_id` = _pid;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure debug_msg
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `debug_msg` (in enabled int, in msg varchar(255))
BEGIN
	if enabled then
		select concat('** ', msg) as '[debug]';
	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_board
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `delete_board` (in _bid int)
BEGIN
	delete from `board` where `id` = _bid;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure user_change_pass
-- -----------------------------------------------------

DELIMITER $$
USE `bforum`$$
CREATE PROCEDURE `user_change_pass` (in _uid int, in _old_pass varchar(45), in _new_pass varchar(45), out success int)
BEGIN
	set success = null;
	set success = (select id from `user` where id=_uid and `password`=sha1(sha1(concat(_old_pass, `salt`))));
    if(success is not null and _new_pass is not null) then
		update `user` set `password`=sha1(sha1(concat(_new_pass, `salt`))), `password_edit_time`=current_timestamp() where id=_uid;
        set success = 1;
	else
		set success = 0;
    end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `bforum`.`v_user_mail_core`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_mail_core`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_mail_core` AS
	select mailbox.user_id as uid, mailbox.id as mbid, mm.mail_id as `mid`, mm.is_read as is_read
    from mailbox join mail_to_mailbox mm on mailbox.id = mm.mailbox_id;

-- -----------------------------------------------------
-- View `bforum`.`v_user_mail_count_all`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_mail_count_all`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_mail_count_all` AS
	select uid, count(*) as amount
    from v_user_mail_core
    where is_read = 0
    group by uid;

-- -----------------------------------------------------
-- View `bforum`.`v_user_privilege_core`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_privilege_core`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_privilege_core` AS
	select 
		ug.user_id as uid, ug.group_id as gid, ug.board_id as bid, `group`.`name` as group_name,
		`group`.priority as priority, gp.privilege_id as pri_id, gp.permit as permit
	from user_to_group ug
		join `group` on ug.group_id = `group`.id
        join group_to_privilege gp on `group`.id = gp.group_id;

-- -----------------------------------------------------
-- View `bforum`.`v_user_privilege`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_privilege`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_privilege` AS
	select 
		p1.uid as uid, p1.gid as gid, p1.bid as bid, p1.group_name as group_name,
		p1.pri_id as pri_id, p1.permit as permit, privilege.`name` as pri_name
    from (select uid, bid, pri_id, max(priority) as priority from v_user_privilege_core group by uid, bid, pri_id) p2
		join v_user_privilege_core p1 on p1.uid = p2.uid and p1.bid <=> p2.bid and p1.pri_id = p2.pri_id and p1.priority = p2.priority
        join privilege on p1.pri_id = privilege.id;

-- -----------------------------------------------------
-- View `bforum`.`v_user_mail_count_by_box`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_mail_count_by_box`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_mail_count_by_box` AS
	select uid, mbid, count(*) as amount
    from v_user_mail_core
    where is_read=0
    group by uid, mbid;

-- -----------------------------------------------------
-- View `bforum`.`v_user_mail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_mail`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_mail` AS
	select uid, mbid, `mid`, mail.title as title, mail.content as content
    from v_user_mail_core vc 
		join mail on vc.`mid` = mail.id;

-- -----------------------------------------------------
-- View `bforum`.`v_ubp_core`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_ubp_core`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_ubp_core` AS
	select post_to_board.post_id as pid, post_to_board.board_id as bid, commit_post.user_id as uid, commit_post.`time` as commit_time
    from post_to_board natural join commit_post;

-- -----------------------------------------------------
-- View `bforum`.`v_post_pick`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_pick`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_pick` AS
	select p1.post_id as pid, p1.user_id as uid, p1.cancel as cancel, p1.`time` as `time`
    from (select post_id, max(`time`) as `time` from pick_post group by post_id) p2
		natural join pick_post p1;

-- -----------------------------------------------------
-- View `bforum`.`v_post_top`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_top`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_top` AS
	select p1.post_id as pid, p1.user_id as uid, p1.cancel as cancel, p1.`time` as `time`
    from (select post_id, max(`time`) as `time` from top_post group by post_id) p2
		natural join top_post p1;

-- -----------------------------------------------------
-- View `bforum`.`v_post_protect`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_protect`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_protect` AS
	select p1.post_id as pid, p1.user_id as uid, p1.cancel as cancel, p1.`time` as `time`
    from (select post_id, max(`time`) as `time` from protect_post group by post_id) p2
		natural join protect_post p1;

-- -----------------------------------------------------
-- View `bforum`.`v_post_addon`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_addon`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_addon` AS
	select post.id as pid, 
		pick.uid as pick_uid, pick.cancel as pick_cancel, pick.`time` as pick_time, 
        protect.uid as protect_uid, protect.cancel as protect_cancel, protect.`time` as protect_time,
        top.uid as top_uid, top.cancel as top_cancel, top.`time` as top_time
	from post 
		left join v_post_pick pick on post.id = pick.pid
		left join v_post_protect protect on post.id = protect.pid
        left join v_post_top top on post.id = top.pid;

-- -----------------------------------------------------
-- View `bforum`.`v_post_content`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_content`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_content` AS
select 
	post.id as pid, post.post_content_id as pcid, 
    post_content.title as title, post_content.content as content, 
    post_content.`time` as last_edit_time,
    post.hits as hits, post.hot as hot, post.hide as hide, post.deleted as deleted
from post join post_content on post.post_content_id = post_content.id;

-- -----------------------------------------------------
-- View `bforum`.`v_post_reply_content`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_reply_content`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_reply_content` AS
	select reply.parent_id as p_pid, reply.child_id as c_pid, pc.pcid as c_pcid,
		pc.title as title, pc.content as content, pc.last_edit_time as last_edit_time, 
        pc.hits as hits, pc.hot as hot, pc.hide as hide, pc.deleted as deleted
	from reply
		join v_post_content pc on reply.child_id = pc.pid;

-- -----------------------------------------------------
-- View `bforum`.`v_post_reply_list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_reply_list`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_reply_list` AS
select 
	rc.p_pid as p_pid, rc.c_pid as c_pid, cp.user_id as uid, 
    rc.title as title, if(rc.hide, null, rc.content) as content, 
    `user`.nickname as nickname, `user`.portrait as portrait,
    cp.`time` as `commit_time`
from v_post_reply_content rc
	join commit_post cp on rc.c_pid = cp.post_id
    join `user` on cp.user_id = `user`.id
where rc.deleted = 0;

-- -----------------------------------------------------
-- View `bforum`.`v_post_board`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_board`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_board` AS
(select post_id as pid, board_id as bid from post_to_board)
union all
(select child_id as pid, board_id as bid from post_to_board join reply on post_to_board.post_id=reply.parent_id);

-- -----------------------------------------------------
-- View `bforum`.`v_post_reply_time`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_reply_time`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_post_reply_time` AS
select 
	-- ignore hide or somehow for now
	cp2.`post_id` as pid, if(max(cp1.`time`) is null, max(cp2.`time`), max(cp1.`time`)) as `time`
from
	`commit_post` cp2 left join `reply` on cp2.post_id = `reply`.`parent_id` left join `commit_post` cp1 on `reply`.`child_id` = cp1.`post_id` 
group by
	cp2.post_id;

-- -----------------------------------------------------
-- View `bforum`.`v_ubp_list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_ubp_list`;
USE `bforum`;
create  OR REPLACE view `v_ubp_list` as 
select ubpc.bid as bid, ubpc.pid as pid, ubpc.uid as uid,
	`user`.nickname as nickname, `user`.portrait as portrait,
    pc.title as title, if(pc.hide, null, pc.content) as content,
    ubpc.commit_time as commit_time, prt.`time` as last_reply_time,
    pc.hot as hot, pc.hits as hits,
    if(pa.pick_cancel is null, 0, !pa.pick_cancel) as pick,
    if(pa.top_cancel is null, 0, !pa.top_cancel) as top,
    if(pa.protect_cancel is null, 0, !pa.protect_cancel) as protect
from v_ubp_core ubpc
	join v_post_content pc on ubpc.pid = pc.pid
    join `user` on ubpc.uid = `user`.id
    join v_post_addon pa on ubpc.pid = pa.pid
    join v_post_reply_time prt on ubpc.pid = prt.pid
where pc.deleted = 0
order by top desc, prt.`time` desc;

-- -----------------------------------------------------
-- View `bforum`.`v_post_relation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_post_relation`;
USE `bforum`;
create  OR REPLACE view `v_post_relation` as
select
	post.id as pid, reply.parent_id as p_pid, post_to_board.board_id as bid
from
	post left join reply on post.id = reply.child_id
    left join post_to_board on post.id = post_to_board.post_id;

-- -----------------------------------------------------
-- View `bforum`.`v_user_draft`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_draft`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_draft` AS
select 
	draft_post.`user_id` as uid, draft_post.post_id as pid, draft_post.`time` as created_time, 
    draft_post.last_edit_time as last_edit_time, vpr.p_pid as p_pid, vpr.bid as bid,
    vpc.title as title, vpc.content as content
from
	draft_post join v_post_relation vpr on draft_post.post_id = vpr.pid
    join v_post_content vpc on vpr.pid = vpc.pid;

-- -----------------------------------------------------
-- View `bforum`.`v_user_post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_post`;
USE `bforum`;
create  OR REPLACE view `v_user_post` as
select 
	vpc.pid as pid, vpc.pcid as pcid, cp.user_id as `uid`, vpc.title as title, vpc.content as content,
    vpc.last_edit_time as last_edit_time, vpc.hits as hits, vpc.hot as hot, vpc.hide as hide, vpc.deleted as deleted,
    cp.`time` as commit_time, vpr.bid as bid, vpr.p_pid as p_pid
from 
	v_post_content vpc 
    join commit_post cp on vpc.pid = cp.post_id
    join v_post_relation vpr on vpc.pid = vpr.pid;

-- -----------------------------------------------------
-- View `bforum`.`v_user_fav`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bforum`.`v_user_fav`;
USE `bforum`;
CREATE  OR REPLACE VIEW `v_user_fav` AS
select 
	favorite_post.`user_id` as uid, favorite_post.post_id as pid,
    vpr.p_pid as p_pid, vpr.bid as bid,
    vpc.title as title, vpc.content as content,
    cp.`time` as commit_time
from
	favorite_post join v_post_relation vpr on favorite_post.post_id = vpr.pid
    join v_post_content vpc on vpr.pid = vpc.pid
    join commit_post cp on vpr.pid = cp.post_id;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
-- begin attached script 'init_data'
use bforum;

call add_group('Normal user', 10, @gid);
call add_group('Admin', 100, @gid2);
call add_group('No commit user', 50, @gid3);
call add_group('No commit no reply user', 51, @gid4);

call add_privilege('commit post', @pri_id);
call add_privilege('reply post', @pri_id2);
call add_privilege('user admin', @pri_id3);

-- set up normal user group
call add_privilege_to_group(@pri_id, @gid, 1);
call add_privilege_to_group(@pri_id2, @gid, 1);

-- set up admin group
call add_privilege_to_group(@pri_id, @gid2, 1);
call add_privilege_to_group(@pri_id2, @gid2, 1);
call add_privilege_to_group(@pri_id3, @gid2, 1);

-- set up no commit user group
call add_privilege_to_group(@pri_id, @gid3, 0);

-- set up no commit no reply user group
call add_privilege_to_group(@pri_id, @gid4, 0);
call add_privilege_to_group(@pri_id2, @gid4, 0);

-- set up admin user
call user_register('useradmin', 'Admin 001', '654321', '1111122222233333', 'admin@webforum.com', @adminId);
call add_user_to_group(@adminId, @gid, NULL);
call add_user_to_group(@adminId, @gid2, NULL);


-- end attached script 'init_data'
