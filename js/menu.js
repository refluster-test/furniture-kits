var Menu = function(cbItemClick) {

	$('#test').mousedown(function(e) {
		cbItemClick(new ItemWallHorizontal());
	}.bind(this));

	$('#test').bind('touchstart', function(e) {
		cbItemClick(new ItemWallHorizontal());
		e.preventDefault();
	}.bind(this));

	$('#test').bind('touchend', function(e) {
		$('#canvas').trigger('mouseup');
		e.preventDefault();
	}.bind(this));

	$('#test').bind('touchmove', function(e) {
		$('#canvas').trigger('mousemove', e.originalEvent.touches[0]);
		e.preventDefault();
	}.bind(this));
};

Menu.SPAWN_ITEM = 0;
Menu.CHANGE_CONFIG = 1;
