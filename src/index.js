var Clientes = {};
var Contas = {};
var revistas =[
	"Natura",
	"Jequiti",
	"Avon",
]



var _tmp_dialogoconfirmacao = undefined;
var bt2_02_interval = null;

//venda itens
var itens = 0;
var lista_itens = {};


$(document).ready(function(){
	obter_usuarios();
	//obter_contas();


	//Scroll tela de criar 
	/*bt2_02_interval = window.setInterval(function() {
	  var elem = document.getElementById('btn_02');
	  elem.scrollTop = elem.scrollHeight;
	}, 5000);*/
});

function aviso(tipo,valor)
{
	$('#alerta').html(valor);

	var list_group_item = {
		'erro':'warning',
		'info':'info',
		'sucesso':'success'
	};

	$('#alerta').attr('class','list-group-item list-group-item-action list-group-item-'+list_group_item[tipo]);

	$('#alerta').show('slow');

	setTimeout(function(){
		$('#alerta').hide('slow');
	},5200);
}

function hide(x)
{
	//Esconde qualquer elemento que acompanhe fundo.
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
	if(x == 'gerenciarcliente')
	{
		$('.fundo').show();
		$('#btn_03').show();
	}
	if(x == 'gerenciarrevista')
	{
		$('.fundo').show();
		$('#btn_04').show();	
	}
}

function dialogoconfirmacao(text,onTrueCall)
{
		if(onTrueCall == undefined)
			console.log("dialogoconfirmacao(..,..): onTrueCall indefinido");

		_tmp_dialogoconfirmacao = function() 
		{
			$('#dialogo_de_confirmacao').hide('slow');
			$('#dialogo_de_confirmacao_btnsim').attr('onClick', undefined );
			onTrueCall();
			_tmp_dialogoconfirmacao = undefined;
		}

		$('#dialogo_de_confirmacao_msg').html(text);
		$('#dialogo_de_confirmacao_btnsim').attr('onClick', "javascript:_tmp_dialogoconfirmacao();" );
		$('#dialogo_de_confirmacao').show();
}

function carrega_lista_clientes(x)
{
	Clientes = x;
	let lista_clientes = document.getElementById('lista_clientes');
	var opt = document.createElement('option');

	opt.value = -1;
	opt.innerHTML = "Selecione O Cliente";
	opt.selected = true;

	lista_clientes.appendChild(opt);

	for(let x=0; x<Clientes.length; x++)
	{
		if(Clientes[x]['nome'] === undefined)
		{ 
			console.log("[function][load]: Erro Clientes["+x+"] undefined");
			continue;
		}

		opt = document.createElement('option');
		opt.value = x;
		opt.innerHTML = primeira_letra_maiuscula(Clientes[x]['nome']) + "<i>" + Clientes[x]['telefone'] + "</i>";

		lista_clientes.appendChild(opt);
	}
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

function primeira_letra_maiuscula(string) {
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

