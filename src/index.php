<?php require_once('banco.php') ?>
<?php

$a = new Banco();

if(isset($_POST['nome']) and !empty($_POST['nome']) and isset($_POST['telefone']) and !empty($_POST['telefone']))
{
	if($a->criar_usuario($_POST['nome'], $_POST['telefone']) === true){
		echo "{$_POST['nome']} Criado com sucesso";
	}else{
		http_response_code(403);
	}
}

if(isset($_GET['obterusuarios']))
{
	header("Content-Type:application/json;");
	echo json_encode($a->listar_usuarios());
}

if(isset($_GET['criafatura']))
{
	if(isset($_POST['lista_itens']) and !empty($_POST['lista_itens']))
	{
		//print_r($_GET['criafatura']);
		if($a->usuario_existe_porid($_GET['criafatura']) === false)
		{
			echo "Erro!. Usuário não existe";
			die();
		}
		$json = json_decode($_POST['lista_itens'],true);
		
		foreach($json as $val)
		{
			$a->cria_fatura($_GET['criafatura'],$val);
		}
	}
}

if(isset($_GET['contas_em_aberto']))
{
	header("Content-Type:application/json;");

	echo json_encode($a->listar_contas_em_aberto());
}

if(isset($_GET['obterfaturaespecifica']))
{
	header("Content-Type:application/json;");
	echo json_encode($a->listarFaturaAbertaCliente($_GET['obterfaturaespecifica']));

}

?>