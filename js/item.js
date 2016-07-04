const WALL_THICK = 30;

var Item = function() {
	this.pos = {x: 0, y: 0};
	this.zIndex = 0;
	this.image = undefined;
	this.color = 'white';
	this.type = this.__proto__.constructor;
	this.linkType = undefined;
	this.linkItem = [];
	this.area = {u: 0, l: 0, r: 0, b: 0};
	this.linkableItemType = [];
};

Item.LINK_VARIABLE_HORIZONTAL = 0;
Item.LINK_VARIABLE_VERTICAL = 1;
Item.LINK_ATTACH_HORIZONTAL = 2;
Item.LINK_ATTACH_TOP = 3;

Item.prototype.setConfig = function(envConf) {
	this.envConfig = envConf;
};

Item.prototype.setPosition = function(pos) {
	this.pos = pos;
};

Item.prototype.draw = function(ctx) {
};

Item.prototype.attachPosition = function() {
	return undefined;
};

Item.prototype.calcArea = function() {
};

Item.prototype.isInternal = function(x, y) {
	if (x >= this.area.l &&
		x <= this.area.r &&
		y >= this.area.t &&
		y <= this.area.b) {
		return true;
	}
	return false;
};

//////////////////////////////
var ItemFrame = function() {
	Item.call(this);
	this.area = {t: 0, r: 0, b: 0, l: 0};
};

Object.setPrototypeOf(ItemFrame.prototype, Item.prototype);

ItemFrame.prototype.draw = function(ctx) {
	var width = this.envConfig.width;
	var height = this.envConfig.height;
	var left = this.pos.x - width/2;
	var right = this.pos.x + width/2;
	var top = this.pos.y - height/2;
	var bottom = this.pos.y + height/2;

	ctx.fillStyle = this.envConfig.wallColor;
	// left side
	ctx.fillRect(left, top, WALL_THICK, height);
	// right side
	ctx.fillRect(right, top, -WALL_THICK, height);
	// upper side
	ctx.fillRect(left, top, width, WALL_THICK);
	// lower side
	ctx.fillRect(left, bottom, width, -WALL_THICK);
};

ItemFrame.prototype.attachPosition = function() {
	var width = this.envConfig.width;
	var height = this.envConfig.height;
	var left = this.pos.x - width/2;
	var right = this.pos.x + width/2;
	var top = this.pos.y - height/2;
	var bottom = this.pos.y + height/2;
	return {u: top + WALL_THICK, b: bottom - WALL_THICK,
			r: left + WALL_THICK, l: right - WALL_THICK};
};

//////////////////////////////
var ItemWallHorizontal = function() {
	Item.call(this);
	this.area = {t: 30, r: 70, b: 20, l: 30};
	this.linkType = Item.LINK_VARIABLE_HORIZONTAL;
};

Object.setPrototypeOf(ItemWallHorizontal.prototype, Item.prototype);

ItemWallHorizontal.prototype.draw = function(ctx) {
	var left = this.linkItem[0].attachPosition().r;
	var right = this.linkItem[1].attachPosition().l;

	ctx.fillStyle = this.envConfig.wallColor;
	ctx.fillRect(left, this.pos.y - WALL_THICK/2,
				 right - left, WALL_THICK);
};

ItemWallHorizontal.prototype.calcArea = function() {
	var left = this.linkItem[0].attachPosition().r;
	var right = this.linkItem[1].attachPosition().l;

	this.area = {
		t: this.pos.y - WALL_THICK/2, l: left,
		b: this.pos.y + WALL_THICK/2, r: right,
	};
};

//////////////////////////////
var ItemWallVertical = function() {
	this.area = {t: 30, r: 70, b: 20, l: 30};
	this.size = 500;
	this.thick = 10;
};

Object.setPrototypeOf(ItemWallVertical.prototype, Item.prototype);

ItemWallVertical.prototype.draw = function(ctx) {
	ctx.fillStyle = this.envConfig.wallColor;
	ctx.fillRect(this.pos.x - this.thick/2, this.pos.y - this.size/2, 
				 this.thick, this.size);
};

