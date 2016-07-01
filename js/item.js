var Item = function(size) {
	this.pos = {x: 0, y: 0, z: 0};
	this.area = {u: 0, l: 0, r: 0, b: 0};
	this.image = false;
	this.color = 'white';
	this.type = 0;
	this.linkItem = [];
	this.linkItemType = [];

	this.name;
};
Item.prototype.setPosition = function(x, y) {
	this.x = x; this.y = y;
};
Item.prototype.draw = function(ctx) {
};
Item.prototype.isInternal = function(x, y) {
	if (x >= this.pos.x - this.size/2 &&
		x <= this.pos.x + this.size/2 &&
		y >= this.pos.y - this.size/2 &&
		y <= this.pos.y + this.size/2) {
		return true;
	}
	return false;
}
Item.prototype.test = function(x, y) {
	console.log(this.name);
};

//////////////////////////////
ItemCircle = function() {
	this.name = 'c---';
};
Object.setPrototypeOf(ItemCircle.prototype, Item.prototype);
ItemCircle.prototype.draw = function(ctx) {
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size/2, 0, Math.PI*2, false);
	ctx.fill();
};
