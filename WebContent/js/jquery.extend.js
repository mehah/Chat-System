	$.fn.extend({
		linkEffectOt: function()
		{
			var links = this;
			return this.bind('mouseenter', function() {
				links.stop().css('color', '#000');
				$(this).animate({ color: "#0078ff" }, 1000);
			}).bind('mouseleave', function() {
				$(this).animate({ color: "#000" }, 1000);
			});
		},
		generateTabs: function() {
			return $(this);
		},
		showDialog: function(o) {
			var $this = this;
			
			if(o.resizable == null)
				o.resizable = false;
			
			if(o.width == null)
				o.width = 'auto';
			
			if(o.modal !== true && o.randomPosition !== false)
				o.position = [Math.rand(1, $(window).width()), Math.rand(40, $(window).height()-300)];
			
			var eClose = o.close;
			o.close = function(e, u) {
				if($this.looked != null && $this.looked.data('currentEvent') != null)
				{
					$.each($this.looked.data('dialogEventBCK'), function(i) {
						$this.looked.bind(this.type, this.handler);
					});
				}
				
				$this.dialog('destroy').remove();
				
				if(eClose != null && $.isFunction(eClose) === true)
					eClose.call(this, e, u);
			};
			
			var eBeforeclose = o.beforeclose;
			o.beforeclose = function(e, u) {
				
				if(eBeforeclose != null && $.isFunction(eBeforeclose) === true)
					eBeforeclose.call(this, e, u);
			};
			
			var eOpen = o.open;
			o.open = function(e, u) {
				if($this.looked != null && $this.looked.data('currentEvent') != null)
				{
					var listEvent = new Array();
					$.each($this.looked.data('events'), function(i) {
						$.each(this, function() {
							if(this.type === $this.looked.data('currentEvent').type)
								listEvent.push(this);
						});
					});
					
					$this.looked.data("dialogEventBCK", listEvent);
					$this.looked.unbind($this.looked.data('currentEvent').type).bind($this.looked.data('currentEvent').type, function(e) {
						e.preventDefault();
						$this.dialog('moveToTop');
					});
				}
				if(eOpen != null && $.isFunction(eOpen) === true)
					eOpen.call(this, e, u);
			};
			
			$this.dialog(o);
			var $mThis = $this.parents(".ui-dialog");
			
			if(o.removeButtonClose === true)
				$mThis.find(".ui-dialog-titlebar-close").remove();
			
			if(o.showBarraMenu === true)
			{
				var divMenu = $(document.createElement('div'));
				divMenu.attr('id', 'barraMenu').addClass('barraIcon').insertBefore(this);
				
				this.barraMenu = divMenu;
				
				this.barraMenu.criarBotao = function(cl, t, c) {
					return $.criarBotao(cl, t, c).appendTo(divMenu);
				};
			}
			
			return $this;
		},
		changeClass: function(oldClass, newClass)
		{
			return $(this).removeClass(oldClass).addClass(newClass);
		},
		scrollPercentEvent: function(p, c) {
			if(p > 0 && p < 101)
			{
				this.bind('scroll', function(e) {
					var maxScroll = this.scrollHeight-this.offsetHeight;			
					var _p = ((maxScroll-this.scrollTop)/maxScroll)*100;
					
					if((100-_p) >= p)
						c.call(this);
				});
			}
		},
		getPage: function(controller, param, callback, endModulo, effectLoad)
		{
			var o = $(this);
			o.effectLoad = effectLoad;
			$.getPage(controller, param, callback, endModulo, o);
			
			return o;
		},
		getJSON: function(controller, param, callback, modoPOST)
		{
			var page = $(this);
			
			var div = $(document.createElement('div')).addClass('sending').css({top: page.position().top, left: page.position().left, width: page.width(), height: page.height(), cursor: 'wait'}).append('<img src="images/ajaxloading.gif" alt=""/>');
			page.prepend(div);
			
			$.ajax({
				url: controller,
				dataType: 'json',
				type: modoPOST === true ? 'POST' : 'GET',
				data: param,
				success: function(data) {
					JSTag.setRequestInformation(page, data);
					
					if(callback != null && $.isFunction(callback) === true)
						callback(data);
					
					div.remove();
					div = null;
					page = null;
				}
			});
		},
		effectInterval: function(effect, repetition, option, interval) {
			var $this = $(this);
			if(interval == null)
				interval = 750;
			
			if(repetition == null)
				repetition = 1;
			
			var qntEffect = 0;
			var runEffect = function(o, option) {
				if(qntEffect === repetition)
					return true;
				
				$this.effect(effect, option, interval, function() { runEffect($this, option); });
				++qntEffect;
			};
			runEffect();
			
			return $this;
		},
		keyupTime: function(callback, beforeCallback, time) {
			var _this = this;
	
			var eventClick = 0;
			_this.bind('keyup', function() {
				clearTimeout(eventClick);
				
				if (
					beforeCallback != null &&
					$.isFunction(beforeCallback) &&
					beforeCallback.call(_this) === false
				)
					return false;
				
				if(_this.val().length === 0)
					return false;
				
				eventClick = setTimeout(function() {
					if (callback != null && $.isFunction(callback))
						callback.call(_this);
					
					eventClick = 0;
				}, time == null ? 500 : time);				
			});
			
			return _this;
		},
		inputToDate: function(time)
		{
			if(this.tagName() !== "input")
			{
				return null;
			}
			
			var $this = $(this);
			
			if(time === true)
			{
				$this.setMask('99/99/9999 99:99:99').css('width', '125px');
			}else
			{
				$this.setMask('99/99/9999').css('width', '70px');
			}
			
			$this.bind('keypress', function(e) {

				if($this.onlyNumber(e) === false)
					return false;
				
				var split = this.value.split('/');
				if(split.length === 1)
				{
					var dia = parseInt(split[0]);
					if(dia > 31)
					{
						$.alert('Dia inv�lido!');
						this.value = "";
						return false;
					}
				}else if(split.length === 2)
				{
					var mes = parseInt(split[1]);
					if(mes > 12)
					{
						$.alert('M�s inv�lido!');
						this.value = this.value.substring(0,3);
						return false;
					}				
				}
			}).bind('change', function() {

			});

			$this.bind('click', function() {
				var l = this.value.length;
				if(l === 10)
				{						
					this.selectionStart = 0;
					this.selectionEnd = l;
				}
			});
			
			return $this;
		},
		valIsDate: function()
		{
			return ((this.val().length === 10 || this.val().length === 19) && this.val().indexOf('/') > -1);
		},
		disable: function(b)
		{
			return $(this).attr('disabled', b).css('background', (b === true ? '#EBEAEA' : ''));
		},
	  	maxLength: function(limit) {
			var _func = function() {
		  		if(this.value.length >= limit)
		  			this.value = this.value.substring(0, limit-1);
			};
			$(this).keyup(_func).keydown(_func).keypress(_func);
			_func = null;
	  	},
		tagName: function() {
	        if(1 === this.length){
	            return this[0].tagName.toLowerCase();
		    } else{
				var tagNames = [];
				this.each(function(i, el){
					tagNames[i] = el.tagName.toLowerCase();
				});
				return tagNames;
		    }
		},
		desabilitarCampos: function()
		{
			$(this).find('*').attr('disabled', 'disabled').unbind('click').bind('click', function(e) {
				e.preventDefault();				
			});
		},
		limparCampos: function(noEvents)
		{
			$this = $(this);
			try {
				$this.find('input[type="radio"]:not(:disabled), input[type="checkbox"]:not(:disabled)').attr('checked', false);
				$this.find('select:not(:disabled)').selectOption("").trigger('change');
				$this.find('input[type!="radio"][type!="checkbox"]:not(:disabled), textarea:not(:disabled)').val("").trigger('change').trigger('blur').trigger('keyup');
			} catch (e) {}
			
			return $this;
		},
		clear: function(callback)
		{
			var $this = $(this);
			return $this.hide('highlight', function() {
				$this.remove();
				
				if (callback != null && $.isFunction(callback))
					callback.apply();
			});
		},
		isEmail: function() {
			var regmail = /^[\w!#$%&amp;'*+\/=?^`{|}~-]+(\.[\w!#$%&amp;'*+\/=?^`{|}~-]+)*@(([\w-]+\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])$/;
			return (regmail.test($(this).val()));	
		},
		
		isDate: function() {
			var regdate = /^((0?[1-9]|[12]\d)\/(0?[1-9]|1[0-2])|30\/(0?[13-9]|1[0-2])|31\/(0?[13578]|1[02]))\/(19|20)?\d{2}$/;
			return (regdate.test($(this).val()));	
		},
		
		isHora: function() {
			var reghora = /^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$/;
			return (reghora.test($(this).val()));	
		},
		
		isDecimal: function() {
			var regdecimal = /^\d*[0-9](\.\d*[0-9])?$/;
			return (regdecimal.test($(this).val()));	
		},
		cnpjValido: function()
		{
	        var cnpj = $(this).val();
	        var valida = new Array(6,5,4,3,2,9,8,7,6,5,4,3,2);
	        var dig1= new Number;
	        var dig2= new Number;
	        
	        exp = /\.|\-|\//g;
	        cnpj = cnpj.toString().replace( exp, "" ); 
	        var digito = new Number(eval(cnpj.charAt(12)+cnpj.charAt(13)));
	                
	        for(var i = 0; i<valida.length; i++){
	                dig1 += (i>0? (cnpj.charAt(i-1)*valida[i]):0);  
	                dig2 += cnpj.charAt(i)*valida[i];       
	        }
	        dig1 = (((dig1%11)<2)? 0:(11-(dig1%11)));
	        dig2 = (((dig2%11)<2)? 0:(11-(dig2%11)));
	        
	        if(((dig1*10)+dig2) !== digito)  
	        	return false;
	
	        return true;
		},
		cpfValido: function()
		{
	        var cpf = $(this).val();
	        exp = /\.|\-/g;
	        cpf = cpf.toString().replace( exp, "" ); 
	        var digitoDigitado = eval(cpf.charAt(9)+cpf.charAt(10));
	        var soma1=0, soma2=0;
	        var vlr =11;
	        
	        for(var i=0;i<9;i++){
	                soma1+=eval(cpf.charAt(i)*(vlr-1));
	                soma2+=eval(cpf.charAt(i)*vlr);
	                vlr--;
	        }       
	        soma1 = (((soma1*10)%11)==10 ? 0:((soma1*10)%11));
	        soma2=(((soma2+(2*soma1))*10)%11);
	        
	        var digitoGerado=(soma1*10)+soma2;
	        if(digitoGerado!=digitoDigitado)        
	        	return false;
	        
	        return true;
		},
		adquirirCampos: function(campos, filter)
		{	
			if(campos == null)
				campos = {};
			
			campos.apenasValores = function() {
				var _o = {};
				$.each(campos, function(i) {
					if (!$.isFunction(this))
					{
						if(this.apenasValores == null)
						{
							var $this = $(this);
							if($this.is(':checkbox'))
								_o[i] = $this.is(':checked');
							else
								_o[i] = $this.val();
						}
						else
						{
							_o[i] = this.apenasValores();
						}
					}
				});
				
				return _o;
			};
			
			campos.toJSON = function() {
				return JSON.stringify(campos.apenasValores());
			};
			
			campos.setValores = function(a) {
				$.each(a, function(i) {
					var campo = campos[i];
					if(this == null || campo == null)
						return true;
					
					var tagName = campo.tagName();
					
					if(tagName === 'select')
						campo.selectOption(this+"");
					else if(tagName === 'input' && campo.attr('type') === 'checkbox')
						campo.attr('checked', this === true);
					else
						campo.val(this+"");
				});
				
				return campos;
			};
			
			if(filter == null)
				filter = '[id!=""]';
			else
				filter += '[id!=""]';
			
			var $this = $(this);
			
			if($this.attr('class') != null && $this.attr('class').indexOf('ui-tabs') > -1 && $this.attr('class').indexOf('ui-tabs-panel') === -1)
			{
				$this.find('div').each(function() {
					var _this = $(this);
					campos[_this.attr('id')] = _this.adquirirCampos(null, filter);
				});				
			}else
			{
				$this.find('button'+filter+', input'+filter+', select'+filter+', textarea'+filter).each(function() {
					var _this = $(this);
					campos[_this.attr('id')] = _this;
				});
			}
			
			$this = null;
			
			return campos;
		},
		addOption: function(v, t)
		{
			var j2 = document.createElement('option');
			j2.value = v;
			j2.innerHTML = t;
			var select = $(this).append(j2);
			j2 = null;
			
			$j = $(j2);
			$j.getSelect = function() { return select; };
			
			return $j;
		},
		selectOption: function(v, t)
		{
			var o = $(this);
			o.find('option['+(t === true ? 'innerHTML' : 'value')+'="'+v+'"]').attr('selected', true);
			return o;
		},
		montarCombo: function(a, v, t, c, _c)
		{
			var o = $(this);
			if(a.jquery != null)
			{
				a.bind('change', function() {
					o.trigger('change').find('option[value!=""]').remove();
				});
				
				if(_c != false)
				{
					o.addOption('', typeof(_c)=='string' ? _c : '- Selecione -');
				}
				
				t = t == null ? {} : t;
									
				a.bind('change', function() {
					t.value = a.val();
					
					if(t.value === '')
						return;
					
					for (var i in t)
					{
						if(typeof(t[i]) === "object")
						{
							t[i] = t[i].val().trim().toString();
						}
					}
					
					$.get(v, t, function(d) {
						var r = true;
						if(c != null && $.isFunction(c) === true)
							r = c(d);
						
						if(r !== false)
						{
							$.each(d, function() {
								var j2 = document.createElement('option');
								j2.value = this.value;
								j2.innerHTML = this.text;
								
								if(this.data != null)
								{
									$.each(this.data, function(i) {
										$(j2).data(i, this);
									});
								}
								
								o.append(j2);
							});
						}
					}, 'json');
				});
			}else
			{
				if(c !== false)
					o.addOption('', typeof(c)=='string' ? c : '- Selecione -');
				
				$.each(a, function() {
					var j2 = document.createElement('option');
					j2.value = (v == null ? this.value : this[v]);
					j2.innerHTML = (t == null ? this.text : this[t]);
					o.append(j2);
				});
			}
			
			return o;
		},
		criticar: function(a, b, c, d)
		{
			var j = this.context;
			
			if(j.type.indexOf('select') !== -1)
			{
				var v = a;
				var msg = b;

				if(j.value === v)
				{
					$.alert(msg, null, {
						clickOK: function() {
							j.focus();
						}
					});
					
					return false;
				}
			}else if(j.type === 'text' || j.type === 'password')
			{
				var v = b;
				var msg = a;
				
				if((v == null && ((c != null && $.isFunction(c) === true && c.call(j) === true) || ((c == null || $.isFunction(c) === false) && j.value.trim().length === 0))) || (v != null && j.value === v))
				{
					$.alert(msg, null, {
						clickOK: function() {
							j.focus();
						}
					});
					return false;
				}
			}else if(j.type === 'checkbox' || j.type === 'radio')
			{
				if(j.checked === false)
				{
					var msg = a;
					$.alert(msg, null, {
						clickOK: function() {
							j.focus();
						}
					});
					return false;
				}
			}
			
			return true;
		}
	});
	
	$.mergeObject = function(o1, o2)
	{
		$.each(o2, function(i) {
			o1[i] = this;
		});
		
		return o1;
	};
	
	$.criarBotao = function(cl, t, c)
	{
		var desabilitado = false;
		return $(document.createElement('a'))
		.attr('role', "button").addClass(cl+" button").attr('alt', t)
		.attr('href', "#").attr('title', t).bind('click', function(e, p1, p2, p3) {
			e.preventDefault();
			e.disable = function(b) {
				desabilitado = b;
			};
			
			if(desabilitado === false && c != null && $.isFunction(c) === true)
				c.call(this, e, p1, p2, p3);
		});
	};
	
	var _alert__jquery = null;
	var alert = function(msg, titulo, option)
	{
		var conf = {
			width: 'auto',
			height: 'auto',
			minHeight: '0',
			resizable: false,
			modal: true,
			title: titulo,
			createButtonOK: true,
			removeButtonClose: false
		};
		
		if(!option)
			option = conf;
		else {
			for(i in conf) {
				if(typeof option[i] == "undefined")
					option[i] = conf[i];
			}
		}
		
		var p = null;
		var divConteudo = null;
		var div = null;
		if(_alert__jquery == null)
		{
			p = $(document.createElement('p')).css('text-align', 'center');
			divConteudo = $(document.createElement('div')).attr('id', 'conteudo');
			div = $(document.createElement('div')).attr('id', 'messageBox').css({display: 'none'}).append(divConteudo).append(p);
		}else
		{			
			p = _alert__jquery.p.empty();
			divConteudo = _alert__jquery.divConteudo.empty();
			div = _alert__jquery.div;
		}
		
		if(option.createButtonOK) {
			var buttonOK = $(document.createElement('button')).attr('button', 'button').attr('name', 'ok').attr('id', 'ok').addClass('ui-state-default ui-corner-all').bind('click', function() {
				div.dialog('close');
				
				if ($.isFunction(option.clickOK))
					option.clickOK.call(div);
			});
			
			var p = div.find('p');
			if(option.dialog == null || option.dialog.length === 0)
				p.append(buttonOK.append('OK'));
			else
			{
				p.append(buttonOK.append(option.dialog[0]));
				
				if(option.dialog.length === 2)
				{
					var buttonCancel = $(document.createElement('button')).attr('button', 'button').attr('name', 'cancel').attr('id', 'cancel').addClass('ui-state-default ui-corner-all').bind('click', function() {
						div.dialog('close');
						
						div = null;
						if ($.isFunction(option.clickCancel))
							option.clickCancel.call(div);
					});
					p.css('text-align', 'right').append('&nbsp;&nbsp;').append(buttonCancel.append(option.dialog[1]));
				}
			}
		}
		
		divConteudo.append(msg);
		if(_alert__jquery == null)
		{
			div.dialog(option);
			_alert__jquery = {div: div, divConteudo: divConteudo, p: p};
		}else
			_alert__jquery.div.dialog('option', option).dialog('open');
		
		if(option.removeButtonClose) 
			_alert__jquery.div.parents(".ui-dialog").find(".ui-dialog-titlebar-close").remove();
		
		p = null;
		divConteudo = null;
		conf = null;
	};
	
	$.confirm = function(msg, titulo, option)
	{
		var conf = {dialog: DIALOG_CONFIRM};
		$.alert(msg, titulo, (option == null ? conf : $.mergeObject(conf, option)));
		conf = null;
	};
	
	$.getPage = function(controller, param, callback, endModulo, page)
	{
		var mainForm = $(document.createElement('form'));
		mainForm.looked = page;
		mainForm.display = function() { mainForm.looked.html(mainForm); };
		mainForm.setAction = function(a) { this.attr('action', a); };
		
		mainForm.disableSubmit = function(b) {
			this.unbind('submit').bind('submit', function() {if(b==true) return false; });		
		};
		
		var callbackIsFunction = callback != null && $.isFunction(callback) === true;

		if(callbackIsFunction === false && typeof callback === 'string')
			endModulo = callback;
		
		var executeJS = function()
		{
			endModulo = 'js/modulos/'+endModulo;
			var moduloName = endModulo.split('/');						
			moduloName = moduloName[moduloName.length-1].split('.js')[0];
			
			var divJson = mainForm.find("json");
			var script = {};
			
			if(divJson.length > 0)
			{
				script = $.parseJSON(divJson.html());
				divJson.remove();
			}
			
			if(script.redirect != null)
			{
				window.location.href = script.redirect;
			}else
			{
				var finalizarScript = function()
				{
					JSTag.setRequestInformation(mainForm, script);
					
					if(callbackIsFunction)
						callback.call(mainForm);
					
					mainForm.find('label[for!=""]').bind('click', function() {
						mainForm.find('[name="'+this.getAttribute('for')+'"]').focus();
					});
					
					JSTag.init(mainForm, script);
					
					callback = null;
					mainForm = null;
					script = null;
					divJson = null;
				};
				
				if(callbackIsFunction === false)
				{
					var executeModulo = function()
					{
						eval('modulo.'+moduloName+'.call(mainForm, script);');
						finalizarScript();
						executeJS = null;
						finalizarScript = null;
						executeModulo = null;
					};
					
					var _m = eval('modulo.'+moduloName+';');
					if(_m == null)
					{
						$.ajax({
							url: endModulo,
							dataType: 'script',
							cache: AJAX_CACHE,
							success: executeModulo
						});
					}else
						executeModulo();
				}
			}
		};
		
		if(controller !== null)
		{
			var div = null;
			if(page != null && page.effectLoad !== false)
			{
				div = $(document.createElement('div')).addClass('sending').css({top: page.position().top, left: page.position().left, width: page.width(), height: page.height(), cursor: 'wait'}).append('<img src="images/ajaxloading.gif" alt=""/>');
				page.prepend(div);
			}
			
			$.post(controller, param, function(data, textStatus, jqXHR) {
				mainForm.append(data);
							
				executeJS();
				
				if(div != null)
				{
					div.remove();
					div = null;
				}
			});
		}else
			executeJS();
	};
	
	$.criarTag = function(t, n, a) {
		t = t.toLowerCase();
		
		var j = document.createElement(t);		
		var o = $(j);
		if(n != null){
			o.attr('id', n);
			
			if(t === 'select' || t === 'input' || t === 'textarea' )
				o.attr('name', n);
		}
		
		if(a != null)
			o.attr(a);
		
		if(t === 'label')
		{
			o._for = function(t, r, c) {
				j.innerHTML = t;
				
				if(c != null)
				{
					if(c === true)
						j.style.color = 'red';
					else if(typeof(c) === 'string')
						j.style.color = c;
				}
				
				o.attr('for', r);
				
				return o;
			};
		}
		
		return o;
	};
	
	$.criarTags = function(t, r, at, n, a) {
		if(r < 2)
			return null;
		
		var list = new Array();

		for(var i = -1; ++i < r;)
		{
			var o = $.criarTag(t, n, a);
			list.push(o);
			if(at != null)
			{
				if($.isArray(at) === true)
					at[i].append(o);
				else
					at.append(o);
			}
		}
		
		return list;
	};