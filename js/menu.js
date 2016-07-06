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

var SvgMenu = function(cbItemClick) {
	$('#svgtest').mousedown(function(e) {
		cbItemClick('WallHorizontal');
		e.preventDefault();
	}.bind(this));

	$('#svgtest').bind('touchstart', function(e) {
		cbItemClick('WallHorizontal');
		e.preventDefault();
	}.bind(this));

	$('#svgtest').bind('touchend', function(e) {
		$('#svg').trigger('mouseup');
		e.preventDefault();
	}.bind(this));

	$('#svgtest').bind('touchmove', function(e) {
		$('#svg').trigger('mousemove', e.originalEvent.touches[0]);
		e.preventDefault();
	}.bind(this));

	//////////////////////////////
	$('#svgtest2').mousedown(function(e) {
		cbItemClick('WallVertical');
		e.preventDefault();
	}.bind(this));

	$('#svgtest2').bind('touchstart', function(e) {
		cbItemClick('WallVertical');
		e.preventDefault();
	}.bind(this));

	$('#svgtest2').bind('touchend', function(e) {
		$('#svg').trigger('mouseup');
		e.preventDefault();
	}.bind(this));

	$('#svgtest2').bind('touchmove', function(e) {
		$('#svg').trigger('mousemove', e.originalEvent.touches[0]);
		e.preventDefault();
	}.bind(this));
};
