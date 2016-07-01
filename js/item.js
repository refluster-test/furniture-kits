var Item = function(size) {
	this.pos = {x: 0, y: 0, z: 0};
	this.area = {u: 0, l: 0, r: 0, b: 0};
	this.image = false;
	this.color = 'white';
	this.type = 0;
	this.linkItem = [];
	this.linkItemType = [];
};

Item.prototype.setPosition = function(x, y) {
	this.pos.x = x; this.pos.y = y;
};

Item.prototype.draw = function(ctx) {
};

Item.prototype.isInternal = function(x, y) {
	if (x >= this.pos.x - this.area.l &&
		x <= this.pos.x + this.area.r &&
		y >= this.pos.y - this.area.t &&
		y <= this.pos.y + this.area.b) {
		return true;
	}
	return false;
}

//////////////////////////////
ItemWallH = function() {
	this.color = 'white';
	this.pos = {x: 100, y: 100, z: 0};
	this.area = {t: 30, r: 70, b: 20, l: 30};
	this.size = 300;
	this.thick = 10;
};

Object.setPrototypeOf(ItemWallH.prototype, Item.prototype);

ItemWallH.prototype.draw = function(ctx) {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x - this.size/2, this.pos.y - this.thick/2,
				 this.size, this.thick);
};
