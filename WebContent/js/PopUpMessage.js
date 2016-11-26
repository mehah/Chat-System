var PopUpMessage = function() {
	var pop = this;
	var divMain = $.criarTag('div').addClass('mainPopUp');
	$('body').append(divMain);

	var maxQnt = 2;
	var listPopUp = new Array();
	this.send = function(message, push) {
		if (divMain.find('div.popup').length >= maxQnt) {
			listPopUp.push(message);
			return;
		}

		var div = $.criarTag('div').append(message);

		div.showDialog({
			title : 'Message',
			width : '180px',
			minHeight : 'auto',
			resizable : false,
			removeButtonClose : true,
			randomPosition : false,
			draggable : false,
			dialogClass : 'popup',
			open : function() {
				setTimeout(function() {
					div.parent().fadeOut(500, function() {
						div.dialog('close').dialog('destroy').remove();
						if (listPopUp.length > 0 && divMain.find('div.popup').length < maxQnt) {
							pop.send(listPopUp[0], false);
							listPopUp.splice(0, 1);
							div = null;
						}
					});
				}, 8000);
			}
		});

		var firstDiv = div.parent().prependTo(divMain).attr('style', '');
		firstDiv.css('padding', divMain);

		firstDiv = null;
	};
};