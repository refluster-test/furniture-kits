var Furniture = function(width, height) {
	this.width = width;
	this.height = height;

	// create items
	this.item = [];
	this.item.push(new ItemCircle());
};

Furniture.prototype.draw = function(ctx) {
	for (var i = 0; i < this.item.length; i++) {
		this.item[i].draw(ctx);
	}
};

Furniture.prototype.checkItem = function(x, y) {
	for (var i = 0; i < this.item.length; i++) {
		if (this.item[i].isInternal(x, y)) {
			return i;
		}
	}
	return null;
};

Furniture.prototype.move = function(idx, x, y) {
	if (x != this.item[idx].x ||
		y != this.item[idx].y) {
		this.item[idx].setPosition(x, y);
		return true;
	}
	return false;
}

