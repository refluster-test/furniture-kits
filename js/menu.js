var Menu = function(cbItemClick) {
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

	//////////////////////////////
	$('#svgtest3').mousedown(function(e) {
		cbItemClick('Hanger');
		e.preventDefault();
	}.bind(this));

	$('#svgtest3').bind('touchstart', function(e) {
		cbItemClick('Hanger');
		e.preventDefault();
	}.bind(this));

	$('#svgtest3').bind('touchend', function(e) {
		$('#svg').trigger('mouseup');
		e.preventDefault();
	}.bind(this));

	$('#svgtest3').bind('touchmove', function(e) {
		$('#svg').trigger('mousemove', e.originalEvent.touches[0]);
		e.preventDefault();
	}.bind(this));
};
