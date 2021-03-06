(function(){
	var d = new Date();
	window.MM = {
		socket: new io.Socket(null, { port: 8080, rememberTransport: false }),
		init: function(){
			this.socket.connect();

			this.socket.on('message', this.onMessage );

			this.Bar.init();

			console && console.log('MM initialized');
		},

		announcement: function( message ){
			$('li:first,ul').eq(0).prepend(
				'<li>'+
					'<p>'+ MM.Bar.time + ': ' + message +'</p>'+
				'</li>'
			);
		},
		message: function( message ){
			$('li:first,ul').eq(0).prepend(
				'<li>'+ MM.Bar.time + ': ' + message + '</li>'
			);
		},

		onMessage: function( raw ){
			console && console.log( 'MM.Message', raw );

			if( !!raw.refresh ){
				MM.reset();
			}

			MM.Bar.update( raw.time );

			if( raw.play ){
				if( raw.play.goal ){
					MM.goal( raw.play.goal );
					MM.announcement( raw.play.text )
				} else {
					MM.message( raw.play.text );
				}
			}

			raw.announcement && MM.score( raw.announcement.score );
		},

		goal: function( action ){
			$('#placar-' + action.team ).text(
				action.score
			);
		},

		score: function( Match ){
			$.each(Match, function( item, value ){
				if( item === 'time' ){
					MM.Bar.update( value );
				} else {
					MM.goal({
						team: item,
						score: value
					});
				}
			});
		},

		Bar: {
			time: 0,
			element: $('#barraMin'),
			init: function(){
				this.width = $('#barra-minuto').innerWidth() - 50 - 50;
				this.step = parseInt( this.width / 60 );
			},
			update: function( time ){
				this.element.animate({
					width: ( this.time = time ) * this.step || 1
				}, 'slow');
			}
		},

		reset: function(){
			$('li').remove();
			this.Bar.update(0);
			$('#placar-principal span').text(0);
		}
	};

	// Run, Forest... RUN!
	MM.init();
})();
