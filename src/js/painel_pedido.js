/*
	@Descrição:
		Funções relativas ao painel de cadastro de pedido dos clientes.

	apagarfatura() -> Apaga os dados(salvo apenas no navegador); e limpa linhas criadas gerando 1 linha nova em branco;
	cria_fatura()  -> Chamada pelo usuário ao terminar de escrever a fatura. Valida e chama request.js/send() para enviar os dados para o servidor;
	venda_adicionar_itens() -> Adiciona Linhas;

*/

function apagarfatura()
{
	var x = () => {
		lista_itens = {};

		itens=0;
		$("#content").html("");

		venda_adicionar_itens();

	};

	dialogoconfirmacao("Deseja Apagar as informações inseridas nesta fatura? Os dados serão perdidos.",x);
	return false;
}

function venda_adicionar_itens()
{
	var x=itens;
	itens++;

	var tdes = [];
	//var tr  = document.createElement('tr');

	var td = document.createElement('td');


	//INPUT TITULO PRODUTO
	var inp1 = document.createElement('input');
	inp1.type = 'text';
	inp1.id = 'adicionar_itens_prod'+x;
	inp1.placeholder = "Digite o Nome do Produto Vendido";

	td.appendChild(inp1);
	tdes.push(td);


	//SELECT QUANTIDADE
	td = document.createElement('td');
	var select = document.createElement('select');
	select.setAttribute('class','form-select');
	select.setAttribute('id','adicionar_itens_qtd'+x);
	select.setAttribute('aria-label','Quantidade');
	select.setAttribute('style','width:60px;');

	let opt = document.createElement('option');
	//opt.setAttribute('selected','selected');
	//opt.setAttribute('value','-1');
	//opt.innerHTML = 'Quantidade';

	select.appendChild(opt);

	for(let t=1; t<=10; t++)
	{

		opt = document.createElement('option');
		opt.setAttribute('value',t);
		opt.innerHTML = t;
		select.appendChild(opt);
		if(t==1)
			opt.setAttribute('selected','selected');
	}

	td.appendChild(select);
	tdes.push(td);

	//INPUT VALOR PRODUTO
	td = document.createElement('td');

	opt = document.createElement('input');
	opt.setAttribute('type','text');
	opt.setAttribute('id','adicionar_itens_valor'+x);
	opt.setAttribute('style','width:80px');
	opt.setAttribute('placeholder','Valor');

	td.appendChild(opt);
	tdes.push(td);

	//FORMA PAGAMENTO
	td = document.createElement('td');

	opt = document.createElement('select');
	opt.setAttribute('class','form-select');
	opt.setAttribute('id','adicionar_itens_pagamento'+x);
	opt.setAttribute('aria-label','Forma de Pagamento');
	opt.setAttribute('placeholder','Valor');

	opt.addEventListener('change',function(t){
		var botao = $('#adicionar_itens_botao'+x);

		if(t.target.value == 3)
		{
			botao.html("Pago");
			botao.attr('class','btn btn-success');
		}
		else
		{
			botao.html("A Pagar");
			botao.attr('class','btn btn-warning');
		}		
	});

	let list_opt = [
		'Pagar Na proxima Campanha','Pagar Em Data Especifica',
		'Pago','Sem definir data'
	];

	for(let k=0; k<list_opt.length; k++)
	{
		let tmp_option = document.createElement('option');
		if(k==0){
			tmp_option.setAttribute('selected','selected');
		}

		tmp_option.setAttribute('value',k+1);
		tmp_option.innerHTML = list_opt[k];
		opt.appendChild(tmp_option);
	}

	td.appendChild(opt);
	tdes.push(td);

	//Button
	td = document.createElement('td');


	opt = document.createElement('span');
	opt.setAttribute('id','state');

	var t2 = document.createElement('button');
	t2.setAttribute('type','button');
	t2.setAttribute('class','btn btn-warning');
	t2.setAttribute('id','adicionar_itens_botao'+x);
	t2.innerHTML = "A Pagar";

	opt.appendChild(t2);
	td.appendChild(opt);

	tdes.push(td);

	t2 = document.createElement('input');
	t2.setAttribute('type','date');
	t2.setAttribute('id','adicionar_itens_data'+x);

	td = document.createElement('td');
	td.appendChild(t2);

	tdes.push(td);

	//Select Lista Revistas
	t2 = document.createElement('select');
	t2.setAttribute('class','form-select');
	t2.setAttribute('id','adicionar_itens_revista'+x);
	t2.setAttribute('style','width:90px;');
	t2.setAttribute('aria-label','Quantidade');


	let t3 = document.createElement('option');
	t3.setAttribute('selected','selected');
	t3.setAttribute('value','-');
	t3.innerHTML = "Nenhuma";

	t2.appendChild(t3);

	for(let m=0; m<revistas.length; m++)
	{
		t3 = document.createElement('option');
		t3.setAttribute('value',m);
		t3.innerHTML = revistas[m];

		t2.appendChild(t3);	
	}
	td = document.createElement('td');

	td.appendChild(t2);

	tdes.push(td);


	t2 = document.createElement('input');
	t2.setAttribute('type','text');
	t2.setAttribute('style','width:125px');
	t2.setAttribute('placeholder','Codigo Produto');
	t2.setAttribute('id','adicionar_itens_codigo'+x);

	td = document.createElement('td');

	td.appendChild(t2);

	tdes.push(td);

	var tr  = document.createElement('tr');

	for(let g=0; g<tdes.length; g++)
	{
		tr.appendChild(tdes[g]);
	}

	document.getElementById("content").appendChild(tr);
	$(".crazy").show();

}

function cria_fatura()
{
	var cliente = $('#lista_clientes');

	if(Clientes[cliente.val()] == undefined)
	{
		aviso('erro','Selecione um Cliente valido.');
		return false;
	}

	var explicacao = {};
	let _temp_var;
	explicacao['produtos'] = 0;
	explicacao['valor_total'] = 0;

	for(let x=0; x<itens; x++)
	{
		var nome_produto = $('#adicionar_itens_prod'+x);
		var quantidade_produto = $('#adicionar_itens_qtd'+x);
		var valor_produto = $('#adicionar_itens_valor'+x);
		var pagamento_produto = $('#adicionar_itens_pagamento'+x);
		var botao = $('#adicionar_itens_botao'+x);
		var data = $('#adicionar_itens_data'+x);
		var revista = $('#adicionar_itens_revista'+x);
		var codigo = $('#adicionar_itens_codigo'+x);

		if(nome_produto.val().length < 5)
		{
			aviso('erro','Coloque Pelo Menos 5 Caracteres no nome do produto!');
			nome_produto.focus();
			return false;
		}
		if(nome_produto.val().length > 40)
		{
			aviso('erro','Coloque no Maximo 40 Caracteres no nome do produto!');
			nome_produto.focus();
			return false;
		}

		if(quantidade_produto.val() < 1)
		{
			aviso('erro','Quantidade Inválida de Produtos');
			quantidade_produto.focus();
			return false;
		}
		if(valor_produto.val() < 1 || valor_produto.val() > 100000)
		{
			aviso('erro','Preço do Produto Inválido');
			valor_produto.focus();
			return false;
		}
		if(pagamento_produto.val() < 1 || pagamento_produto.val() > 4)
		{
			aviso('erro','Tipo de Pagamento Inválido.');
			pagamento_produto.focus();
			return false;
		}
		
		if(pagamento_produto.val() == 2)
		{
			let x = data.val().split('-');
			if(x[0] < 2023 || x[0] > 3000 || x[1] > 12 || x[1] < 1 || x[2] > 31 || x[2] < 1)
			{
				aviso('erro','Data Inválida. A data é obrigatória para o tipo de pagamento');
				data.focus();
				return false;	
			}
		}

		if(revista.val() != '-')
		{
			if(codigo.val().length < 4)
			{
				aviso('erro','Codigo do Produto é inválido(Minimo 4). Obrigatorio quando selecionado a revista.');
				codigo.focus();
				return false;	
			}
			if(revista_obter_campanha(revista.val()))
			{
				aviso('erro', "Erro a revista "+revistas[revista.val()]+" Não possúi campanha ativa.");
				return false;
			}
		}
		else
		{
			if(pagamento_produto.val() == 1)
			{
				aviso('erro', "Você selecionou \"Pagar em outra campanha\", mas não selecionou a revista.");
				pagamento_produto.focus();
				return false;
			}
		}

		var preco = valor_produto.val().replace(',','.');
		preco = parseFloat(preco);


		if(isNaN(preco))
		{
			aviso("erro",'Erro desconhecido no campo valor do produto.');
			valor_produto.focus()
			console.log("valor_produto; Esperado string com numero flutuante; Recebido: "+valor_produto.val());
			return false;
		}

		//botao
		lista_itens[x] = {};
		lista_itens[x]['nome_produto']=nome_produto.val();
		lista_itens[x]['quantidade_produto']=quantidade_produto.val();
		lista_itens[x]['valor_produto']=preco;
		lista_itens[x]['pagamento_produto']=pagamento_produto.val();
		lista_itens[x]['emaberto']=pagamento_produto.val() == 3 ? (0) : (1);
		lista_itens[x]['data']=data.val();
		lista_itens[x]['revista']=revista.val();
		lista_itens[x]['codigo']=codigo.val();

		_temp_var = parseInt(lista_itens[x]['quantidade_produto']);
		explicacao['produtos'] += _temp_var;
		explicacao['valor_total'] += parseFloat(preco * _temp_var);
		console.log("painel_pedido.js - > for - > x="+x);
	}

	var x = () => {
		send(Clientes[cliente.val()]['id']);
		apagarfatura();
		$('#lista_clientes').value = -1;
		obter_usuarios();
		$(".fundo").hide(1200);
		$('#btn_02').hide(1200);
	};

	dialogoconfirmacao("Dados Da Fatura: <b>"+Clientes[cliente.val()]['nome']+"</b><hr>Produtos: "+explicacao['produtos']+" - Total: R$ "+explicacao['valor_total'].toFixed(2),x);
	

}