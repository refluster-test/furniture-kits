var Furniture = function(width, height) {
	this.width = width;
	this.height = height;

	this.state = {
		config: {
			width: 800,
			height: 600,
			wallColor: '#68c',
			windowColor: ''
		},
		item: [
			{
				type: ItemFrame,
				pos: {x: this.width/2, y: this.height/2, z: 0},
				itemAttachTo: [],
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 400, y: 180, z: 0},
				itemAttachTo: [0, 0],
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 350, y: 380, z: 0},
				itemAttachTo: [0, 0],
			},
/*
			{
				type: ItemWallVertical,
				pos: {x: 180, y: 80, z: 0},
				linkItem: [0, 0],
			},
*/
		]
	};

	// create items
	this.item = [];
	for (var i = 0; i < this.state.item.length; i++) {
		this.item.push(new this.state.item[i].type());
	}

	// set config for items
	for (var i = 0; i < this.item.length; i++) {
		this.item[i].setConfig(this.state.config, this.state.item[i], this.item);
	}

	this.dragItem = undefined;
};

Furniture.prototype.draw = function(ctx) {
	for (var i = 0; i < this.item.length; i++) {
		this.item[i].draw(ctx);
	}
};

Furniture.prototype.grabItem = function(x, y) {
	this.dragItem = this.item[this.checkItem(x, y)];
}

Furniture.prototype.checkItem = function(x, y) {
	for (var i = 0; i < this.item.length; i++) {
		if (this.item[i].isInternal(x, y)) {
			return i;
		}
	}
	return undefined;
};

Furniture.prototype.move = function(x, y) {
	if (this.dragItem &&
		(x != this.dragItem.pos.x || y != this.dragItem.pos.y)) {
		this.dragItem.setPosition(x, y);
		return true;
	}
	return false;
};

Furniture.prototype.releaseItem = function() {
	this.dragItem = undefined;
};

