var Item = function(size) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.size = size;
};
Item.prototype.setPosition = function(x, y) {
	this.x = x; this.y = y;
};
Item.prototype.draw = function(ctx) {
	ctx.fillStyle = '#FF5722';
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size/2, 0, Math.PI*2, false);
	ctx.fill();
};
Item.prototype.isInternal = function(x, y) {
	if (x >= this.x - this.size/2 &&
		x <= this.x + this.size/2 &&
		y >= this.y - this.size/2 &&
		y <= this.y + this.size/2) {
		return true;
	}
	return false;
}
