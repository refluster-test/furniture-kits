var Menu = function(cbItemClick) {

	$('#test').mousedown(function(e) {
		cbItemClick(new ItemWallHorizontal());
	}.bind(this));

	$('#test').bind('touchstart', function(e) {
		console.log('menu hDown');
		cbItemClick(new ItemWallHorizontal());
		$('#canvas').trigger('mousedown');
	}.bind(this));

	$('#test').bind('touchend', function(e) {
		console.log('menu hUp');
		$('#canvas').trigger('mouseup');
	}.bind(this));

	$('#test').bind('touchmove', function(e) {
		console.log(e);
		console.log('menu hMove');
		$('#canvas').trigger('mousemove', e.originalEvent.touches[0]);
		e.preventDefault();
	}.bind(this));
};

Menu.SPAWN_ITEM = 0;
Menu.CHANGE_CONFIG = 1;
