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

Furniture.prototype.addItem = function(item, svgItem) {
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

Furniture.prototype.svgDraw = function(svg) {
	for (var i = 0; i < this.item.length; i++) {
		this.svgItem[i].draw(svg);
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
	this.dragItem = undefined;
	this.svg = svg;

	this.state = new Database().svgRestore();
	this.type = {
		'WallHorizontal': {
			zIndex: 0,
			getElem: function(x, y) {
				return ;
			},
			getAttachPos: function() {
			},
		},
	};

	// create items
	this.item = [];
	for (var i = 0; i < this.state.item.length; i++) {
		var t = this.type[this.state.item[i].type];
		//t.getElem(this.state.item[i].pos.x, this.state.item[i].pos.y);

		var elem = this.getElem(this.state.item[i].pos.x, this.state.item[i].pos.y);
		console.log(elem);

//		var item = new this.state.item[i].type();
//		item.setPosition(this.state.item[i].pos);
//		this.setItemPosition(this.
//		this.addItem(item);
	}

	this.dragItem = undefined;
};

SvgFurniture.prototype.getElem = function(x, y) {
	return this.svg.circle(x, y, 100);
};

SvgFurniture.prototype.draw = function() {
//	this.svg.clear();

//	var bigCircle = this.svg.circle(200, 150, 100);
};
