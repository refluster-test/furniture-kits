var Item = function(type, size) {
	this.x = 0;
	this.y = 0;
	this.type = type;
	this.size = size;
	switch (this.type) {
	case Item.CIRCLE:
		this.draw = this._drawCircle;
		break;
	case Item.TRIANGLE:
		this.draw = this._drawTriangle;
		break;
	case Item.SQUARE:
		this.draw = this._drawSquare;
		break;
	default:
		this.draw = this._drawCircle;
		break;
	}
};
Item.CIRCLE = 0;
Item.TRIANGLE = 1;
Item.SQUARE = 2;
Item.prototype.setPosition = function(x, y) {
	this.x = x; this.y = y;
};
Item.prototype._drawCircle = function(ctx) {
	ctx.fillStyle = '#FF5722';
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size/2, 0, Math.PI*2, false);
	ctx.fill();
};
Item.prototype._drawTriangle = function(ctx) {
	ctx.fillStyle = '#1E88E5';
	ctx.beginPath();
	ctx.moveTo(this.x, this.y - this.size/2);
	ctx.lineTo(this.x - this.size/2, this.y + this.size/2);
	ctx.lineTo(this.x + this.size/2, this.y + this.size/2);
	ctx.closePath();
	ctx.fill();
};
Item.prototype._drawSquare = function(ctx) {
	ctx.fillStyle = '#FFEB3B';
	ctx.fillRect(this.x - this.size/2, this.y - this.size/2,
				 this.size, this.size);
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
