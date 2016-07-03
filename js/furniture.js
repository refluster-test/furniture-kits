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
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 400, y: 180, z: 0},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 350, y: 380, z: 0},
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
		this.addItem(this.state.config, this.state.item[i], new this.state.item[i].type());
	}

	this.dragItem = undefined;
};

Furniture.prototype.addItem = function(confEnv, confItem, item) {
	item.setConfig(confEnv, confItem);
	switch(item.linkType) {
	case Item.LINK_VARIABLE_HORIZONTAL:
		for (var j = 0; j < this.item.length; j++) {
			if (this.item[j].type === ItemFrame) {
				item.linkItem[0] = this.item[j];
			}
			if (this.item[j].type === ItemFrame) {
				item.linkItem[1] = this.item[j];
			}
		}
		break;
	case Item.LINK_VARIABLE_VERTICAL:
		break;
	case Item.LINK_ATTACH_HORIZONTAL:
		break;
	case Item.LINK_ATTACH_TOP:
		break;
	}
	item.calcArea();

	this.item.push(item);
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
