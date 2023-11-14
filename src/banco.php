<?php
/*
	Class que gerencia o banco de dados.
	Apenas ela acessa o banco de dados
*/

	define('HOST','localhost');
	define('USER','sara');
	define('password','rltm40213Tlwe3');
	define('db','loja');

class Banco{

	private $banco;
	private $tabela_produtos = 'produto';
	private $tabela_usuario = 'cliente';
	private $cache;

	public function __construct(){
		$pdo = new PDO('mysql:host='.HOST.';port=3306;dbname='.db.';charset=utf8',USER,password);

		$this->banco = $pdo;

		$this->cache = array(
			'anuncioid' => array(),
			'usuarioid' => array(),
		);
	}

	function listarFaturaAbertaCliente($clientid):array
	{
		if($this->usuario_existe_porid($clientid) === false){
			echo "[class=Banco][usuario_existe_porid(..,..)]: cliente não encontrado $clientid";			
			return false;
		}

		return $this->query("SELECT * FROM `produto` WHERE clienteid=:x and emaberto=1",array(":x" => $clientid));
	}

	function listar_contas_em_aberto():array
	{
		$tmp = $this->query("SELECT count(*) as contas,
			sum(produto.valor_produto) as valor_produto,
			MAX(data_vencimento) as data_vencimento,
			cliente.nome,cliente.id 

			FROM `produto`

			INNER JOIN `cliente`
			ON produto.clienteid=cliente.id

			WHERE emaberto=1 GROUP BY id
		");

		return $tmp;
	}

	public function mudar_imagens_anuncio($anuncioid,$imagens):bool
	{
		if($this->anuncio_existe($anuncioid) === false){
			echo "[class=Banco][mudar_imagens_anuncio(..,..)]: não encontrado anuncio $anuncioid";			
			return false;
		}

		$esp = $this->dado_especifico_anuncio($anuncioid,'imagens');

		$esp = explode(',',$esp[0]['imagens']);

		foreach($imagens as $i => $x)
		{
			for($c=0; $c<count($esp); $c++)
			{
				if($i === $esp[$c])
					$esp[$c] = $x;
			}
		}

		$esp = implode(',',$esp);

		$this->atualizar_especifico_anuncio($anuncioid,'imagens',$esp);
		return true;
	}

	public function atualizar_especifico_anuncio($anuncioid,$chave,$dados)
	{
		if($this->anuncio_existe($anuncioid) === false){
			echo "[class=Banco][atualizar_especifico_anuncio(..,..)]: não encontrado anuncio $anuncioid";			
			return false;
		}

		if(in_array($chave, $this->chaves_produto) === false){
			echo "[class=Banco][atualizar_especifico_anuncio(..,..)]: $chave chave não econtrada no dicionário";
			return false;
		}

		$smt = $this->banco->prepare("UPDATE `produto` SET `{$chave}`=:dados where `produto_id`=:id");

		$smt->bindParam('dados',$dados);
		$smt->bindParam('id',$anuncioid);

		$smt->execute();
	}

	public function substitui_imagens_anuncio(string $anuncioid,string $imagens):bool
	{
		if($this->anuncio_existe($anuncioid) === false){
			echo "[class=Banco][substitui_imagens_anuncio(..,..)]: não encontrado anuncio $anuncioid";			
			return false;
		}
		
		if(is_string($imagens) === false){
			echo "[class=Banco][atualiza_imagem_anuncio(..,..)]: $imagens não é uma string";
			return false;
		}

		$smt = $this->prepare('UPDATE `produto` SET `imagens`=:img where `produto_id`=:id');

		$smt->bindParam('id',$anuncioid);
		$smt->bindParam('img',$imagens);

		$smt->execute();
	}
	public function deleta_anuncio(string $anuncioid):bool
	{
		if($this->anuncio_existe($anuncioid) === false){
			echo "[class=Banco][deleta_anuncio(..,..)]: não encontrado anuncio $anuncioid";			
			return false;
		}

		$this->query("DELETE FROM `{$this->tabela_produtos}` WHERE `produto_id`=:id",array(":id"=>$anuncioid));
		return true;

	}
	public function listar_anuncios(array $filtros=array()):bool|array
	{
		if(count($filtros) == 0)
		{
			$a = $this->query("SELECT * FROM `{$this->tabela_produtos}`");
			return $a;
		}

		$ftl = '';

		foreach($filtros as $indice => $filtro)
		{
			$a = match($indice)
			{
				"vistodec" => "ORDER BY `visto` DESC LIMIT ".MAXIMO_LINHAS_RETORNO ,
				"vistocre" =>  "ORDER BY `visto` ASC LIMIT ".MAXIMO_LINHAS_RETORNO,
			};
			$ftl = $a;
		}

		if(strlen($ftl) === 0)
		{
			echo "[class=Banco][listar_anuncios(array ...)]: Filtro não listado";
			return false;
		}

		$r = $this->query("SELECT * FROM `{$this->tabela_produtos}` $ftl");

		return $r;
	}


	public function dado_especifico_anuncio($anuncioid,$dado):array
	{
		if($this->anuncio_existe($anuncioid) === false){
			echo "[class=Banco][dado_especifico_anuncio(..,..)]: não encontrado anuncio $anuncioid";			
			return false;
		}

		$s = $this->banco->prepare("SELECT `{$dado}` FROM `produto` WHERE `produto_id`=:id");
	
		$s->bindParam(":id",$anuncioid);

		$s->execute();

		return $s->fetchAll();
	}

	public function anuncio_existe(string $anuncioid):bool
	{
		if(in_array($anuncioid, $this->cache['anuncioid']))
			return true;

		$s = $this->banco->prepare("SELECT `produto_id` FROM `produto` WHERE `produto_id`=:id");
		
		$s->bindParam('id',$anuncioid);

		$s->execute();

		$r = $s->fetchAll();

		if(count($r) > 0){
			$this->cache['anuncioid'][] = $anuncioid;
			return true;
		}
		
		return false;
	}

	public function cria_fatura($usuarioid,array $produto):bool
	{
		if($this->usuario_existe($usuarioid) === true){
			echo "[class=Banco][cria_fatura(...,...)]: conta já existe";
			return false;
		}
		$t = $this->banco->prepare("INSERT INTO `produto`(`nome_produto`,
	 	`valor_produto`,
	  	`data_vencimento`,
	   	`emaberto`,
	   	`pagamento_produto`,
	   	`quantidade_produto`, 
	   	`codigo`,
	   	`revista`,
	   	`clienteid`)
		
			VALUES(:nome, :valor,:data, :emaberto,:tipopagamento,:quantidade,:codigo,:revista,:clienteid)");

		$t->bindParam(":nome",$produto['nome_produto']);
		$t->bindParam(":valor",$produto['valor_produto']);
		$t->bindParam(":data",$produto['data_vencimento']);
		$t->bindParam(":emaberto",$produto['emaberto']);
		$t->bindParam(":tipopagamento",$produto['pagamento_produto']);
		$t->bindParam(":quantidade",$produto['quantidade_produto']);
		$t->bindParam(":codigo",$produto['codigo']);
		$t->bindParam(":revista",$produto['revista']);
		$t->bindParam(":clienteid",$usuarioid);

		$t->execute();

		return false;
	}

	private function query(string $sql, array $dados=array())
	{
		$a = $this->banco->prepare($sql);
		
		foreach($dados as $indice => $dado)
		{
			$a->bindParam($indice,$dado);
		}

		$a->execute();

		return $a->fetchAll();
	}

	///usuário 

	public function listar_usuarios()
	{
		return $this->query("SELECT * FROM `{$this->tabela_usuario}`");
	}

	public function usuario_existe(string $telefone)
	{
		$s = $this->banco->prepare("SELECT `telefone` FROM `{$this->tabela_usuario}` WHERE `telefone`=:info");

		$s->bindValue(':info',$telefone);

		$s->execute();

		$r = $s->fetchAll();

		$c = count($r);
		if($c == 0){
			return false;
		}else if($c > 1){
			echo "[class=Banco][usuario_existe(..,..)]: Retorno SQL com mais de um usuário.";
			return false;
		}

		$this->cache['usuarioid'][] = $usuarioid;

		return true;
	}
	public function usuario_existe_porid(string $id)
	{

		if(is_numeric($id) === false)
		{
			echo "[class=Banco][usuario_existe(..,..)]: Id Inválido";
			return false;
		}

		$s = $this->banco->prepare("SELECT `id` FROM `{$this->tabela_usuario}` WHERE `id`=:info");

		$s->bindValue(':info',$id);

		$s->execute();

		$r = $s->fetchAll();

		$c = count($r);
		if($c == 0){
			return false;
		}else if($c > 1){
			echo "[class=Banco][usuario_existe_porid(..,..)]: Retorno SQL com mais de um usuário.";
			return false;
		}

		$this->cache['usuarioid'][] = $id;

		return true;
	}
	public function criar_usuario(string $nome,string $telefone):bool
	{
		if(strlen($nome) < 3)
		{
			echo "[class=Banco][criar_usuario(..,..,..)]: Nome muito curto. Minimo: 3 caracteres";
			return false;
		}

		if(filter_var($telefone, FILTER_SANITIZE_NUMBER_INT) === false)
		{
			echo "[class=Banco][criar_usuario(..,..,..)]: Sintaxe Telefone inválida";
			return false;
		}

		$r = $this->query("SELECT * FROM `{$this->tabela_usuario}` WHERE telefone = :tel",array(":tel"=>$telefone));

		if(count($r) > 0)
		{
			echo "[class=Banco][criar_usuario(..,..,..)]: Este telefone já está cadastrado";
			return false;
		}

		$a = $this->banco->prepare("INSERT INTO `{$this->tabela_usuario}`(`nome`,`telefone`) VALUES(:nome,:tel)");

		$a->bindParam(":nome",$nome);
		$a->bindParam(":tel",$telefone);

		$a->execute();

		return true;
	}

	public function obter_usuario($userid):bool|array
	{
		if($this->usuario_existe($userid) === false)
		{
			echo "[class=Banco][obter_usuario(..)]: Usuário não existe";
			return false;
		}

		$a = $this->query("SELECT * FROM `usuario` WHERE `usuario_id`=:id",array(':id'=>$userid));

		return $a;
	}
	public function obter_especifico_usuario($userid,$chave):bool|array
	{
		if($this->usuario_existe($userid) === false)
		{
			echo "[class=Banco][obter_usuario(..)]: Usuário não existe";
			return false;
		}

		if(in_array($chave,$this->chaves_usuario) === false)
		{
			echo "[class=Banco][altera_usuario(..)]: chave não encontrada no dicionário de usuários";
			return false;
		}

		$a = $this->query("SELECT `{$chave}` FROM `{$this->tabela_usuario}` WHERE `usuario_id`=:id",
			array("id" => $userid)
		);


		return $a;
	}	

	public function altera_usuario(string $userid,string $key,string $dado):bool
	{
		if($this->usuario_existe($userid) === false)
		{
			echo "[class=Banco][altera_usuario(..)]: Usuário não existe";
			return false;
		}

		if(in_array($key,$this->chaves_usuario) === false)
		{
			echo "[class=Banco][altera_usuario(..)]: chave não encontrada no dicionário de usuários";
			return false;
		}

		$a = $this->banco->prepare("UPDATE `{$this->tabela_usuario}` SET `{$key}`=:dado WHERE `usuario_id`=:id");

		$a->bindParam(":dado",$dado);
		$a->bindParam(":id",$userid);

		$a->execute();

		return true;
	}
	public function deletar_usuario(int $userid):bool
	{
		if($this->usuario_existe($userid) === false)
		{
			echo "[class=Banco][deletar_usuario(..)]: Usuário não existe";
			return false;
		}

		$this->query("DELETE FROM `{$this->tabela_usuario}` WHERE `usuario_id`=:id",array(":id"=>$userid));
		return true;
	}

}

?>
