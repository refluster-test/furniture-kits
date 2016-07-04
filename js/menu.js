var Menu = function(left, top, width, height, cbItemClick) {
	Element.call(this, left, top, width, height);

	$('#test').mousedown(function(e) {
		cbItemClick(new ItemWallHorizontal());
	}.bind(this));
};

Object.setPrototypeOf(Furniture.prototype, Element.prototype);

Menu.SPAWN_ITEM = 0;
Menu.CHANGE_CONFIG = 1;

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

Menu.prototype.operate = function(x, y, callback) {
	var e = {};
	e.type = Menu.SPAWN_ITEM;
	e.newItemType = ItemWallHorizontal;
	callback(e);
	// todo:
}
var MenuItem = function(area) {
	this.area = area;
};

MenuItem.prototype.isInternal = function(x, y) {
	if (x >= this.area.l && x <= this.area.r &&
		y >= this.area.t && y <= this.area.b) {
		return true;
	}
	return false;
};

MenuItem.prototype.hUp = function() {
};

MenuItem.prototype.hDown = function() {
};
