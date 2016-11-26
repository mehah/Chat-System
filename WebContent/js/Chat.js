	var chatInstance;
	var Chat = function(usuario) {
		this.usuario = usuario;
		
		var div = $.criarTag('div').addClass('usuarios');
			
		var divUsuarios = $.criarTag('div', 'usuarios');
		var ul = $.criarTag('ul');
		
		var primeiraExecucao = true;
		
		var message = new PopUpMessage('teste');
		
		var adicionarUsuario = function(o)
		{
			if($('li#'+o.id).length > 0)
				return;
			
			var li = $.criarTag('li', o.id);
			ul.append(li.append($.criarTag('a').append(o.nome).bind('click', function() {
				chatWindow(o);					
			})));
			
			var window = $('div[id="'+o.id+'"]');
			if(window.length > 0)
			{
				window.find('div').css({'background-color': 'white'}).eq(1).attr({contentEditable: true});
			}
			
			if(primeiraExecucao === false)
				message.send('Usuário '+o.nome+' entrou no chat!');
		};
	
		var removerUsuario = function(o)
		{
			var liUsuario = ul.find('li#'+o.id);
			if(liUsuario.length > 0)
				liUsuario.remove();
			
			var window = $('div[id="'+o.id+'"]');
			if(window.length > 0)
			{
				window.find('div').css({'background-color': '#E4E4E4'}).eq(1).attr({contentEditable: false});
			}
			
			if(primeiraExecucao === false)
				message.send('Usuário '+o.nome+' saiu do chat!');
		};
		
		var addMensagem = function(o)
		{
			var liUsuario = ul.find('li#'+o.id);
			if(liUsuario.length > 0)
			{
				o.nome = liUsuario.find('a').html();
				var divMensagens = chatWindow(o);
				
				var ultimoUsuario = divMensagens.data('ultimoUsuario');
				
				var span = $.criarTag('span').text(o.msg);	
				if(ultimoUsuario != null && ultimoUsuario.id === o.id)
				{
					var messages = divMensagens.find('span.ownerMessage');
					var message = messages.eq(messages.length-1);
					
					message.append("<br/>").append(span);
					
					message = null;
					messages = null;
				}else
				{
					var spanMessage = $.criarTag('span').addClass('ownerMessage').append(o.nome+' diz <br/>').append(span);
					divMensagens.append(spanMessage);
					divMensagens.data('ultimoUsuario', o);
					
					spanMessage = null;
				}
				
				span = null;
				ultimoUsuario = null;					
			}
		};
		
		var chatWindow = function(o)
		{
			var window = $('div[id="'+o.id+'"]');
			if(window.length > 0)
			{
				window.dialog("moveToTop");
				var divs = window.find('div');
				divs.eq(1).trigger('focus');
				window = null;
				return divs.eq(0);
			}
			window = null;
			
			var div = $.criarTag('div', o.id);
			
			var divMensagens = $.criarTag('div').addClass('mensagens');
			
			var divMensagem = null; 
			divMensagem = $.criarTag('div', null, {contentEditable: true}).css({
				border: '1px solid black',
				width: '99%',
				height: '15%',
				margin: '5px 0px'
			}).bind('keydown', function(e){
				if(e.keyCode === 13 && divMensagem.text().length > 0) {
					$.post('ChatAction@enviarMessage', {viewId: viewId, id: o.id, msg: this.textContent}, function() {
						var ultimoUsuario = divMensagens.data('ultimoUsuario');

						var span = $.criarTag('span').text(divMensagem.text());
						
						if(ultimoUsuario != null && ultimoUsuario.id === usuario.id)
						{
							var messages = divMensagens.find('span.message');
							var message = messages.eq(messages.length-1);
						
							message.append("<br/>").append(span);
							
							
							message = null;
							messages = null;
						}else
						{
							var spanMessage = $.criarTag('span').addClass('message').append(usuario.nome+' diz <br/>').append(span);
							divMensagens.append(spanMessage);
							divMensagens.data('ultimoUsuario', usuario);
							
							spanMessage = null;
						}
						divMensagem.empty();
						
						span = null;
						ultimoUsuario = null;
					});
				}
			});
			
			div.showDialog({
				title: o.nome,
				width: 300,
				height: 300,
				resizable: true
			}).append(divMensagens).append(divMensagem);
			
			divMensagem.trigger('focus');
			
			div = null;
			
			return divMensagens;
		};
		
		this.receberMessage = function(usuarios, msgs) {
			$.each(usuarios, function() {
				if (this.online === false)
					removerUsuario(this);
				else
					adicionarUsuario(this);
			});

			$.each(msgs, function() {
				addMensagem(this);
			});

			primeiraExecucao = false;
		};
		
		div.showDialog({
			title: 'Usuários',
			width: '210px',
			height: 500,
			resizable: false,
			position: ['right','top'],
			removeButtonClose: true,
			randomPosition: false,
			draggable: false
		}).append(divUsuarios.append(ul));
	};