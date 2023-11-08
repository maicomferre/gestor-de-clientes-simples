<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rela="icon" type="image/x-icon" href="photo.png" />
	<script type="text/javascript" src="/jquery-3.1.0.min.js"></script>
	<script type="text/javascript" src="src/js/request.js"></script>
	<script type="text/javascript" defer="true" src="src/index.js"></script>
	<script type="text/javascript" src="src/js/painel_pedido.js"></script>
	<link rel="stylesheet" type="text/css" href="src/index.css" />

	<!-- Externos -->

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">	

	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>


<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>


	<title>Loja Da Sara</title>
</head>
<body>
	<h1>Gestor de Contas</h1>
	<br><br><br>

	<ul class="list-group">
		<li class="list-group-item list-group-item-dark" onClick="mostra('adicionarconta')">Adicionar Conta</li>
	</ul>
	<br><br>
	<table>
		<tr>
			<th>Opção</th>
		</tr>
		<tr>
			<th onClick="mostra('adicionarcliente');">Adicionar Cliente</th>
		</tr>
		<tr>
			<th>Remover Cliente</th>
		</tr>
		<tr>
			<th></th>
		</tr>		
	</table>		

	</table>
	<table id="table_lista_contas">
		<tr>
			<th>Cliente Nome</th>
			<th>Vencimento Mais Próximo</th>	
			<th>Divida Total</th>

		</tr>
	</table>

	<div class="fundo" style="display:none;"></div>
	<div class="abtn" style="display:none;" id="btn_01">
		<span id="botao_sair" onClick="hide('#btn_01');">Sair(X)</span>
		<h1>Adiciona Cliente</h1>

  		<a href="#" id="statoes" style="display:none;" class=""></a>

		<br><br>
		<label for="adiciona_cliente_nome">Selecione o Cliente:</label><br>
		<input type="text" class="form-control-lg" id="nome_cliente" placeholder="Nome do Cliente" />
		<br><br>

		<label for="adiciona_cliente_tel">Digite o telefone +55 (21):</label><br>
		<input type="tel" class="form-control-lg" id="telefone_cliente" placeholder="Telefone do Cliente" />
		<br><br>
		<input type="submit" onClick="envia_novo_cliente()" value="Criar Cliente" />
	</div>

	<div class="abtn" style="display:none;" id="btn_02">
		<div id="dialogo_de_confirmacao" style="display:none;">
			<h2><span id="dialogo_de_confirmacao_msg"></span></h2>

			<button type="button" class="btn btn-danger" onClick="javascript:void(0);" id="dialogo_de_confirmacao_btnsim">Confirmar</button>

			<button type="button" class="btn btn-primary" onClick="$('#dialogo_de_confirmacao').hide();">Cancelar</button>

		</div>		
		<span id="botao_sair" onClick="hide('#btn_02');">Sair(X)</span>

		<h1>Venda</h1>

		<br><br>
		<select class="form-select" id="lista_clientes" aria-label="Cliente">
		</select>
		<br><br>

		<button type="button" class="btn btn-primary" onClick="venda_adicionar_itens()">Adicionar Linha</button>

		<br />
		<table id="content">
			<tr>
				<th>Produto Vendido</th>
				<th>Quantidade</th>
				<th>Preço</th>
				<th>Pagamento</th>
				<th>Estado</th>
				<th>Data</th>
				<th>Revista</th>
				<th>Código</th>
			</tr>
		</table>
		<div class="crazy" style="display:none">
			<b>Ações:</b>
			<input type="submit" onClick="cria_fatura();" value="Criar Fatura" />
			<input type="submit" onClick="apagarfatura();" value="Resetar Lista Fatura" />
		</div>
	</div>
	<div id="alerta">
		<a href="#" id="statoes" class=""></a>
	</div>
</body>
</html>