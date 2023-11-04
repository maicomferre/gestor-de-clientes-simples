<?php
#Modelo

if(defined('criabanco')){
	$pdo = new PDO('mysql:host='.HOST.';port=3306;dbname='.db.';charset=utf8',USER,password);

	$pdo->exec('CREATE DATABASE IF NOT EXISTS '.db);

	$sql = 'CREATE TABLE `'.db.'`.`produto` ( `nome_produto` VARCHAR(50) NOT NULL ,
	 `valor_produto` DECIMAL NOT NULL DEFAULT 0,
	  `data_criacao` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	  `data_vencimento` TIMESTAMP NULL,
	   `emaberto` INT NULL DEFAULT 1,
	   `pagamento_produto` INT NULL DEFAULT 1,
	   `quantidade_produto` INT NULL DEFAULT 0,
	   `pago` INT NULL DEFAULT 0,
	   `codigo` VARCHAR(50) NULL,
	   `revista` VARCHAR(5) NULL,
	   `clienteid` INT NOT NULL,
		`id` SMALLINT PRIMARY KEY AUTO_INCREMENT,
	   `desativado` BOOLEAN NULL DEFAULT 0 ) ENGINE = InnoDB;';
	
	$pdo->exec($sql);

	$sql = 'CREATE TABLE `'.db.'`.`cliente`(
			`nome` VARCHAR(250) NOT NULL,
			`data_criacao` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
			`id` SMALLINT PRIMARY KEY AUTO_INCREMENT,
			`telefone` LONGTEXT NULL) ENGINE = InnoDB;';


	$pdo->exec($sql);
}
?>