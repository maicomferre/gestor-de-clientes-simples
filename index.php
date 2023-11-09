<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rela="icon" type="image/x-icon" href="photo.png" />
	<!--<script type="text/javascript" src="/jquery-3.1.0.min.js"></script>-->
	<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="src/js/request.js"></script>
	<script type="text/javascript" defer="true" src="src/index.js"></script>
	<script type="text/javascript" src="src/js/painel_pedido.js"></script>
	<link rel="stylesheet" type="text/css" href="src/index.css" />

	<!-- Externos -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

	<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>


	<script src="https://kit.fontawesome.com/cb35299c24.js" crossorigin="anonymous"></script>
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
			<th onClick="mostra('gerenciarcliente');">Gerenciar Cliente</th>
		</tr>
		<tr>
			<th onClick="mostra('gerenciarrevista');">Gerenciar Revista</th>
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
		<div class="d-flex justify-content-center" id="lista_de_revistas">
			<table >
				<tr>
					<th> Revistas</th>
					<th>Avon</th>
					<th>Natura</th>
					<th>Jequiti</th>
				</tr>
				<tr>
					<th>Ciclo</th>
					<td>19</td>
					<td>20</td>
					<td>17</td>
				</tr>
				<tr>
					<th>Data</th>
					<td>19/10 -> 20/11</td>
					<td>05/09 -> 15/11</td>
					<td>10/10 -> 10/01/2024</td>
				</tr>
			</table>
		</div>	
		<br>
		<select class="form-select" id="lista_clientes"  aria-label="Cliente">
		</select>
		<br>

		<div class="d-flex justify-content-center">
			<button type="button" class="btn btn-primary" onClick="venda_adicionar_itens()">Adicionar Linha</button>&nbsp;
			<button type="button" class="btn btn-info" onClick="venda_criar_fatura();">Criar Fatura</button>&nbsp;
			<button type="button" class="btn btn-danger" onClick="venda_apagar_fatura();">Resetar Lista Fatura</button>&nbsp;	
			<button type="button" class="btn btn-warning" onClick="venda_apagar_ultima_linha();">Apagar Ultima Linha</button>&nbsp;	
		</div>
		<br />
		<div class="d-flex justify-content-center">
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
		</div>
	</div>

	<div class="abtn" style="display:none;" id="btn_03">
		<span id="botao_sair" onClick="hide('#btn_03');">Sair(X)</span>
		<h1>Gerenciar Cliente do Sistema</h1>
		<div class="d-flex justify-content-center">
			<table class="d-flex justify-content-center">
				<tr>
					<th>Nome</th>
					<th>Telefone</th>
					<th>Data Criação</th>
					<th>Pedidos Cadastrados</th>
					<th>Pedidos Pedidos em Aberto</th>
					<th colspan="3">Ações</th>
				</tr>
				<tr>
					<td>Josefino</td>
					<td>(21) 327216334</td>
					<td>08/10/2023</td>
					<td>234</td>
					<td>0</td>
					<td><button type="button" class="btn btn-danger"> <i class='fas fa-trash-alt' style='font-size:20px'></i> </button></td>
					<td><button type="button" class="btn btn-success"><i class="fas fa-edit" style='font-size:20px'></i></button></td>
				</tr>	
			</table>
		</div>
	</div>


	<div class="abtn" style="display:none;" id="btn_04">
		<span id="botao_sair" onClick="hide('#btn_04');">Sair(X)</span>
		<h1>Gerenciar Revistas</h1>
		<div class="justify-content-center">
			<table class="align-self-center">
				<th>Revista</th>
				<th>Camapanhas Registradas</th>
				<th>Camapanha Em Abertos?</th>
				<th>Pedidos em Aberto</th>
			</table>
		</div>	
	</div>

	<div id="alerta">
		<a href="#" id="statoes" class=""></a>
	</div>
</body>
</html>