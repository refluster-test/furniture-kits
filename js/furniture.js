var Furniture = function(width, height) {
	this.width = width;
	this.height = height;

	this.state = {
		config: {
			height: 300,
			width: 250,
			wallColor: 'blue',
		},
		item: [
			{
				type: ItemWallHorizontal,
				pos: {x: 200, y: 80, z: 0},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 150, y: 380, z: 0},
			},
			{
				type: ItemWallVertical,
				pos: {x: 180, y: 80, z: 0},
			},
		]
	};

	// create items
	this.item = [];
	for (var i = 0; i < this.state.item.length; i++) {
		this.item.push(new this.state.item[i].type());
	}

	for (var i = 0; i < this.item.length; i++) {
		this.item[i].setConfig(this.state.config, this.state.item[i], this.item);
	}
};

Furniture.prototype.draw = function(ctx) {
	for (var i = 0; i < this.item.length; i++) {
		this.item[i].draw(ctx);
		if (this.item[i].test) {
			this.item[i].test();
		}
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

