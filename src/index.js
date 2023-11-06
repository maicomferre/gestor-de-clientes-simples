var Clientes = {};
var Contas = {};
var revistas =[
	"Natura",
	"Jequiti",
	"Avon",
]





var bt2_02_interval = null;

//venda itens
var itens = 0;
var lista_itens = {};


$(document).ready(function(){
	obter_usuarios();
	//obter_contas();


	//Scroll tela de criar fatura
	bt2_02_interval = window.setInterval(function() {
	  var elem = document.getElementById('btn_02');
	  elem.scrollTop = elem.scrollHeight;
	}, 5000);
});

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
	opt.setAttribute('selected','selected');
	opt.setAttribute('value','1');
	opt.innerHTML = '1';
	select.appendChild(opt);

	for(let t=1; t<=10; t++)
	{
		opt = document.createElement('option');
		opt.setAttribute('value',t);
		opt.innerHTML = t;
		select.appendChild(opt);
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

function apagarfatura(confirmado)
{
	if(confirmado === false)
	{
		$('#dialogo_de_confirmacao_msg').html("Deseja Apagar as informações inseridas nesta fatura? Os dados serão perdidos.");
		$('#dialogo_de_confirmacao_btnsim').attr('onClick','apagarfatura(true)');
		$('#dialogo_de_confirmacao').show();
	}
	else if(confirmado == true)
	{
		$('#dialogo_de_confirmacao').hide('slow');

		for(let x=0; x<itens; x++)
			lista_itens[x] = {};

		itens=0;
		document.getElementById("content").innerHTML = "";

		venda_adicionar_itens();
	}
}

function cria_fatura()
{
	var cliente = $('#lista_clientes');

	if(Clientes[cliente.val()] == undefined)
	{
		aviso('erro','Selecione um Cliente valido.');
		return false;
	}

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
		if(valor_produto.val() < 1 || quantidade_produto.val() > 100000)
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
		}


		valor_produto.val()

		//botao
		lista_itens[x] = {};
		lista_itens[x]['nome_produto']=nome_produto.val();
		console.log(nome_produto.val());
		lista_itens[x]['quantidade_produto']=quantidade_produto.val();
		lista_itens[x]['valor_produto']=valor_produto.val().replace(',','.');
		lista_itens[x]['pagamento_produto']=pagamento_produto.val();
		lista_itens[x]['emaberto']=pagamento_produto.val() == 3 ? (0) : (1);
		lista_itens[x]['data']=data.val();
		lista_itens[x]['revista']=revista.val();
		lista_itens[x]['codigo']=codigo.val();
	}
	send(Clientes[cliente.val()]['id']);
}

function aviso(tipo,valor)
{
	$('#alerta').html(valor);
	if(tipo == 'erro')
	{
		$('#alerta').attr('class','list-group-item list-group-item-action list-group-item-warning')
	}
	else if(tipo == 'sucesso')
	{
		$('#alerta').attr('class','list-group-item list-group-item-action list-group-item-warning');
	}
	$('#alerta').show('slow');

	setTimeout(function(){
		$('#alerta').hide('slow');
	},5000);
}

function hide(x)
{
	$(x).hide('slow');	
	$('.fundo').hide('slow');	

	if(x == "#bt2_02")
		clearInterval(bt2_02_interval);

}
function mostra(x)
{
	if(x == 'adicionarconta')
	{
		obter_usuarios();
		$(".fundo").show();
		$('#btn_02').show();
		if(itens < 2)
			venda_adicionar_itens();
	}
	if(x == 'adicionarcliente')
	{
		$(".fundo").show();
		$('#btn_01').show();
	}
}



function load(x)
{
	Clientes = x;
	var lista_clientes = '<option selected value="-1">Cliente</option>';

	for(let x=0; x<Clientes.length; x++)
	{
		if(Clientes[x]['nome'] === undefined)
		{ 
			console.log("[function][load]: Erro Clientes["+x+"] undefined");
			continue;
		}

		lista_clientes += "<option value="+x+" >"+capitalizeFirstLetter(Clientes[x]['nome'])+
		"   -   "+Clientes[x]['telefone']+"</option>";
	}
	$('#lista_clientes').html(lista_clientes);
	obter_contas();
}
function carrega_contas(f)
{
	document.getElementById("table_lista_contas").innerHTML = '<tr><th>Cliente Nome</th><th>Contas Em Aberto</th><th>Vencimento Mais Próximo</th><th>Divida Total</th></tr>';

	for(let j=0; j<f.length; j++)
	{
		if(f[j]['contas']  < 1)continue;

		tr = document.createElement('tr');
	
		tr.setAttribute('onClick',"ver_cliente('"+f[j]['id']+"')");

		let td = document.createElement('td');
		td.innerHTML = f[j]['nome'];

		tr.appendChild(td);

		td = document.createElement('td');
		td.innerHTML = f[j]['contas'];
		formatter.format(f[j]['valor_produto']);

		tr.appendChild(td);

		td = document.createElement('td');
		td.innerHTML = f[j]['data_vencimento'];

		tr.appendChild(td);

		td = document.createElement('td');
		td.innerHTML = formatter.format(f[j]['valor_produto']);

		tr.appendChild(td);


		//temp += '<td><li style="color:rgb(255,100,0);" class="list-group-item list-group-item-secondary">'+Contas[x]['vencido'];

		document.getElementById("table_lista_contas").appendChild(tr);		
	}

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//thanks https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
// Create our number formatter.
const formatter = new Intl.NumberFormat('pt-br', {
  style: 'currency',
  currency: 'BRL',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

