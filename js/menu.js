var Menu = function(cbItemClick) {
	$('#test').mousedown(function(e) {
		cbItemClick(new ItemWallHorizontal());
	}.bind(this));
};

Menu.SPAWN_ITEM = 0;
Menu.CHANGE_CONFIG = 1;
