var Menu = function(width, height) {
	this.step = 0; // 0: construct, 1: material
	this.CANVAS_AREA = {t: 0, b: 100};
	this.width = width;
	this.height = height;

	this.area = {
		t: 0, b: height, l: 0, r: width
	}
};

Menu.prototype.draw = function(ctx) {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, this.CANVAS_AREA.t, this.width, this.CANVAS_AREA.b);
};

Menu.prototype.isInternal = function(x, y) {
	if (x >= this.area.l &&
		x <= this.area.r &&
		y >= this.area.t &&
		y <= this.area.b) {
		return true;
	}
	return false;
};
