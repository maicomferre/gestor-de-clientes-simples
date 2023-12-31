
/*
	Arquivo Responsável por requisições

*/


function envia_novo_cliente()
{
	var nome = $("#nome_cliente").val();
	var telefone = $("#telefone_cliente").val();

	if(nome.length < 3)
	{
		aviso('erro','Nome Muito Curto. Minimo de 3 Caracteres');
		return false;
	}
	if(telefone.length < 9)
	{
		aviso('erro',"Telefone Muito Curto!");
		return false;
	}

	$("#telefone_cliente").val('');
	$("#nome_cliente").val('');

	$.ajax({
		method:'post',
		url:'src/',
		data:{'nome':nome,'telefone':telefone},

		success:function(a){
			$('#statoes').html(a);
			$('#statoes').attr('class','list-group-item list-group-item-action list-group-item-success');

			$('#statoes').show('slow');

			setTimeout(function(){
				$('#statoes').hide('hide');
			},5000);
		},

		faill: function(a){
			$('#statoes').html(a);

			$('#statoes').attr('class','list-group-item list-group-item-action list-group-item-warning');

			$('#fail').show('slow');	
			setTimeout(function(){
				$('#statoes').hide('hide');
			},5000);	
		},
	});
}

function obter_usuarios()
{
	$.ajax({
		method:'get',
		url:'src/?obterusuarios',
		
		success:function(x){
			carrega_lista_clientes(x);
		},
		faill:function(data)
		{
			console.log("obter_usuarios(): Erro "+data);
		},
	});
}

function obter_fatura_individual_cliente(clientid)
{
	$.ajax({
		method:'get',
		url:'src/?obterfaturaespecifica='+clientid,
		
		success:function(x){
			let tr,tmp;
			let table = document.getElementById("cliente_fatura_table");
			
			let clean = $('#cliente_fatura_table tr:not(:first-child)').children();
			if(clean.length > 0)
				clean.remove();

			for(var i=0; i<x.length; i++)
			{
				tr = document.createElement('tr');

				tmp = document.createElement('td');
				tmp.innerHTML = x[i]['nome_produto'];

				tr.appendChild(tmp);

				tmp = document.createElement('td');
				tmp.innerHTML = x[i]['quantidade_produto'];

				tr.appendChild(tmp);

				tmp = document.createElement('td');
				tmp.innerHTML =  formatter.format(x[i]['valor_produto']);

				tr.appendChild(tmp);

				tmp = document.createElement('td');
				tmp.innerHTML =  formatter.format(x[i]['valor_produto'] * x[i]['quantidade_produto']);
				tr.appendChild(tmp);

				tmp = document.createElement('td');
				tmp.innerHTML = x[i]['pagamento_produto'];

				tr.appendChild(tmp);

				tmp = document.createElement('td');
				tmp.innerHTML = (x[i]['data_vencimento'] === null ? ('Não Definido') : (x[i]['data_vencimento']));

				tr.appendChild(tmp);


				//Botão Marcar Como Pago
				tmp = document.createElement('td');
				tmp.appendChild(cria_bootstrap_botao_elemento("btn btn-success",'fa-solid fa-cash-register'))

				tr.appendChild(tmp);


				//Botão Alterar
				tmp = document.createElement('td');
				tmp.appendChild(cria_bootstrap_botao_elemento("btn btn-warning",'fas fa-edit'))

				tr.appendChild(tmp);

				table.appendChild(tr);
			}
			mostra('faturacliente');
		},
		faill:function(data)
		{
			console.log("obter_usuarios(): Erro "+data);
		},
	});
}


function cria_bootstrap_botao_elemento(_btn,_class)
{
	let x1 = document.createElement('button');
	x1.setAttribute('type',"button");
	x1.setAttribute('class',_btn);

	let x2 = document.createElement('i')
	x2.setAttribute('class',_class);
	x2.setAttribute('style','font-size:20px');

	x1.appendChild(x2);

	return x1;
}

function obter_contas_em_aberto()
{
	$.ajax({
		method:"GET",
		url:'src/?contas_em_aberto',

		success:function(a)
		{
			carrega_contas(a);
		},
		faill:function(a)
		{
			aviso('erro',"Erro ao enviar os dados "+a);
		}
	});	
}

function envia_fatura(clientid)
{
	$.ajax({
		method:"POST",
		url:'src/?criafatura='+clientid,
		data:{lista_itens:JSON.stringify(lista_itens)},

		success:function(a)
		{
			aviso('sucesso',"Dados Enviados com sucesso! "+a);
		},
		faill:function(a)
		{
			aviso('erro',"Erro ao enviar os dados "+a);
		}
	});	
}