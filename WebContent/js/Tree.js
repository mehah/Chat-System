	var applyTree = function() {
		var arvore = $('div#tree');
		
		var topArvore = arvore.position().top;
		var leftArvore = arvore.position().left;
		
		$(document.createElement("div")).css({
			position: 'absolute',
			top: topArvore+10,
			left: leftArvore+15,
			width: 150,
			height: 110/*,
			border: '3px coral solid'*/
		}).appendTo($('div#top')).
		bind('click', function() { addFolha(false); });
		
		var addFolha = function(repeat)
		{
			var folha = $(document.createElement("div")).addClass('sheet');
			
			if(Math.rand(0, 1) === 1)
				folha.addClass('flip');
			
			/*folha.css({
				margin: 20+Math.rand(0, 80)+"px "+(50+Math.rand(0, 80))+"px",
			});*/	
			
			folha.css({
				top: parseInt(arvore.position().top)+20+Math.rand(0, 80),
				left: parseInt(arvore.position().left)+50+Math.rand(0, 80)
			});
			arvore.append(folha);
			
			var leftOriginal = parseInt(folha.css('left'));
			var leftMax = leftOriginal+30;
			var leftMin = leftOriginal-30;
			
			var maxFirstLeft = leftOriginal;
			var sheetRemoved = false;
			var sheetAdd = false;
			
			var position = parseInt(arvore.position().top)+parseInt(arvore.css('height'));			
			var positionFadeOut = position-80;
			var positionToAddSheet = position-110;
			var finalPosition = position-70;
			
			var navegarFolha = function(revert)
			{
				if(sheetRemoved)
					return;
					
				setTimeout(function() {
					var left = parseInt(folha.css('left'));
					if(revert === true && left >= leftMin || revert === false && left <= leftMax)
					{
						if(revert === true)
							folha.css('left', left-2);
						else
							folha.css('left', left+2);
							
						
						if(maxFirstLeft === left)
						{
							setTimeout(function() {
								if(revert === true)
									folha.css('top', parseInt(folha.css('top'))+1);
								else
									folha.css('top', parseInt(folha.css('top'))-1);
							}, 100);
							
							if(revert === true)
								maxFirstLeft -= 4;
							else
								maxFirstLeft += 4;
						}
						navegarFolha(revert);
					}else
					{
						navegarFolha(revert === false);
					}
				}, 100);
										
				var interval = null;			
				interval = setInterval(function() {
					var top = parseInt(folha.css('top'));
					folha.css('top', top+1);
					
					if(top >= positionToAddSheet)
					{
						if(sheetAdd === false)
						{
							sheetAdd = true;
							
							if(repeat !== false)
								setTimeout(function() { addFolha(); }, Math.rand(800, 1500));						
						}
						if(top >= positionFadeOut)
						{
							folha.fadeOut(500, function() {
								folha.remove();
							});
							
							if(top >= finalPosition)
							{
								clearInterval(interval);
								sheetRemoved = true;
							}
						}
					}
				}, 1000);
			};
			navegarFolha(false);
		};
		addFolha();
		setTimeout(function() { addFolha(); }, 2500);
	};