var Menu = function(left, top, width, height) {
	Element.call(this, left, top, width, height);

	this.step = 0; // 0: construct, 1: material
};

Object.setPrototypeOf(Furniture.prototype, Element.prototype);

Menu.prototype.draw = function(ctx) {
	ctx.fillStyle = 'white';
	ctx.fillRect(this.area.l, this.area.t, this.area.r - this.area.l,
				 this.area.b - this.area.t);
};

Menu.prototype.isInternal = function(x, y) {
	if (x >= this.area.l && x <= this.area.r &&
		y >= this.area.t && y <= this.area.b) {
		return true;
	}
	return false;
};
