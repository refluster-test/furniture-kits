var Furniture = function(left, top, width, height) {
	Element.call(this, left, top, width, height);

	this.state = new Database().restore();

	// create items
	this.item = [];
	for (var i = 0; i < this.state.item.length; i++) {
		var item = new this.state.item[i].type();
		item.setPosition(this.state.item[i].pos);
		this.addItem(item);
	}

	this.dragItem = undefined;
};

Object.setPrototypeOf(Furniture.prototype, Element.prototype);

Furniture.prototype.addItem = function(item) {
	item.setConfig(this.state.config);

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

Furniture.prototype.delItem = function(idx) {
	this.state.item.splice(idx, 1);
	this.item.splice(idx, 1);
};

Furniture.prototype.draw = function(ctx) {
	for (var i = 0; i < this.item.length; i++) {
		this.item[i].draw(ctx);
	}
};

Furniture.prototype.grabItem = function(x, y) {
	for (var i = 0; i < this.item.length; i++) {
		if (this.item[i].isInternal(x, y)) {
			this.dragItem = this.item[i];
			this.delItem(i);
		}
	}
};

Furniture.prototype.move = function(x, y) {
	if (this.dragItem &&
		(x != this.dragItem.pos.x || y != this.dragItem.pos.y)) {
		this.dragItem.setPosition({x: x, y: y});
		return true;
	}
	return false;
};

Furniture.prototype.releaseItem = function() {
	if (this.dragItem) {
		this.addItem(this.dragItem);
	}
	this.dragItem = undefined;
};

Furniture.prototype.setDragItem = function(item) {
	this.dragItem = item;
};

////////////////////////////// svg

var SvgFurniture = function(left, top, width, height, svg) {
	this.svg = svg;
	this.state = new SvgDatabase().restore();

	this.type = {
		'Frame': {
			zIndex: 0,
			draw: function(x, y) {
				console.log({x: x, y: y});
				var elem = this.svg.circle(x, y, 80);
				elem.attr({
					fill: "#bada55",
					stroke: "#000",
					strokeWidth: 5
				});
			}.bind(this)
		},
		'WallHorizontal': {
			zIndex: 0,
			draw: function(x, y) {
				var elem = this.svg.rect(x - 40, y - 40, 80, 80);
				elem.attr({
					fill: "#bada55",
					stroke: "#000",
					strokeWidth: 5
				});
			}.bind(this)
		},
	};

	// create items
	this.item = [];
	for (var i = 0; i < this.state.item.length; i++) {
//		var item = new this.state.item[i].type();
//		item.setPosition(this.state.item[i].pos);
//		this.addItem(item);
	}

	this.dragItem = undefined;
	this.draw();
};

SvgFurniture.prototype.draw = function() {
	var item = this.state.item
	for (var i = 0; i < item.length; i++) {
		console.log(item[i]);
		console.log(this.type[item[i].type]);

		this.type[item[i].type].draw(item[i].pos.x, item[i].pos.y);
	}
};
