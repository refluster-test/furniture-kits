var Item = function() {
	this.pos = {x: 0, y: 0, z: 0};
	this.image = undefined;
	this.color = 'white';
	this.type = Item;
	this.linkItem = [];
	this.area = {u: 0, l: 0, r: 0, b: 0};
	this.linkableItemType = [];
};

Item.prototype.setConfig = function(envConfig, itemConf, item) {
	this.envConfig = envConfig;
	this.pos = itemConf.pos;
	this.image = undefined;
	this.color = 'white';
	this.type = Item;
	this.linkItem = [];
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
};

//////////////////////////////
ItemWallHorizontal = function() {
	this.area = {t: 30, r: 70, b: 20, l: 30};
	this.size = 300;
	this.thick = 10;
};

Object.setPrototypeOf(ItemWallHorizontal.prototype, Item.prototype);

ItemWallHorizontal.prototype.draw = function(ctx) {
	ctx.fillStyle = this.envConfig.wallColor;
	ctx.fillRect(this.pos.x - this.size/2, this.pos.y - this.thick/2,
				 this.size, this.thick);
};

//////////////////////////////
ItemWallVertical = function() {
	this.area = {t: 30, r: 70, b: 20, l: 30};
	this.size = 500;
	this.thick = 10;
};

Object.setPrototypeOf(ItemWallVertical.prototype, Item.prototype);

ItemWallVertical.prototype.draw = function(ctx) {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x - this.thick/2, this.pos.y - this.size/2, 
				 this.thick, this.size);
};
