var App = function(){

	public = {};

	_divs = {
		newsfeed: 	$('#newsfeed'),
		friends: 	$('#friends'),
		formStatus: $('#form-status')
	}

	_templates = {
		newsfeed: 			$('#newsfeed-template').html(),
		newsfeedPersonal: 	$('#newsfeed-template-personal').html(),
		friends: 			$('#friends-template').html()
	}

	public.init = function(){
		_updateNewsfeed();
		_updateFriendsList();
		_bindEvents();
	};

	function _bindEvents(){

		_divs.formStatus.on('submit', function(){

			var data = $(this).serialize();
			_updateStatus(data);
			return false;

		});

	};

	function _updateNewsfeed(){

		var deferred = $.Deferred();

		$.ajax({
			url: 'https://api.backand.com/1/objects/status',
			dataType: 'json',
			method: 'get',
			headers: {
				AnonymousToken: '7e507e02-3eaf-401d-b3a9-a33e823d632f'
			},
			success: function(data){
				deferred.resolve(data);
			}
		});

		deferred.done(function(data){

			var template = Handlebars.compile(_templates.newsfeed);
			_divs.newsfeed.html(template(data));

		});

	};

	function _updateFriendsList(){

		var deferred = $.Deferred();

		$.ajax({
			url: 'https://api.backand.com:443/1/objects/friends?pageSize=20&pageNumber=1',
			dataType: 'json',
			method: 'get',
			headers: {
				AnonymousToken: '7e507e02-3eaf-401d-b3a9-a33e823d632f'
			},
			success: function(data){
				deferred.resolve(data);
			}
		});

		deferred.done(function(data){ 

			var template = Handlebars.compile(_templates.friends);
			_divs.friends.html(template(data));

		});

	}

	function _updateStatus(serializedString){

		var deferred = $.Deferred();

		$.ajax({
			url: 'https://api.backand.com/1/objects/status',
			method: 'post',
			dataType: 'json',
			data: serializedString,
			headers: {
				AnonymousToken: '7e507e02-3eaf-401d-b3a9-a33e823d632f',
				"Content-Type": "application/json"
			},
			success: function(data){
				deferred.resolve(data);
			},
			error: function(data){
				var span = $('<span>').html(data.responseText).addClass('pull-right error');
				_divs.formStatus.append(span);
				setTimeout(function(){
					_divs.formStatus.find('.error').remove();
				}, 3500);
			}
		});

		deferred.done(function(data){

			var template = Handlebars.compile(_templates.newsfeedPersonal);
			_divs.newsfeed.prepend(template(data));
			_divs.formStatus[0].reset();
			_updateFriendsList();

		});

	};

	return public;

}();

App.init();