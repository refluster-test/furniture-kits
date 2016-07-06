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
	this.svg = svg;
	this.width = width;
	this.height = height;
	this.state = new SvgDatabase().restore();
	this.dragItem = undefined;
	this.wallWidth = 30;

	this.type = {
		'Frame': {
			zIndex: 0,
//			create: this.createFrame.bind(this),
//			set: this.setFrame.bind(this),
		},
		'WallHorizontal': {
			zIndex: 0,
			create: this.createWallHorizontal.bind(this),
			set: this.setWallHorizontal.bind(this),
		},
	};

	var item = this.state.item
	this.item = [];

	this.createAndSetFrame();

	for (var i = 0; i < item.length; i++) {
		var it = this.type[item[i].type].create(item[i].pos.x, item[i].pos.y);
		this.setDragItem(it);
		this.type[item[i].type].set(item[i].pos.x, item[i].pos.y);
		this.item.push(it);
	}
};

SvgFurniture.prototype.createItem = function(type) {
	return this.type[type].create(0, 0);
};

SvgFurniture.prototype.setItem = function(x, y) {
	return this.type[this.dragItem.opt.type].set(x, y);
};

SvgFurniture.prototype.setDragItem = function(item) {
	this.dragItem = item;
};

SvgFurniture.prototype.releaseItem = function() {
	if (this.dragItem) {
		var x, y;
		if (this.dragItem.node.nodeName == 'circle') {
			x = this.dragItem.attr('cx');
			y = this.dragItem.attr('cy');
		} else {
			x = this.dragItem.attr('x');
			y = this.dragItem.attr('y');
		}
		this.setItem(x, y);
	}
	this.dragItem = undefined;
};

SvgFurniture.prototype.move = function(x, y) {
	if (! this.dragItem) {
		return;
	}
	switch (this.dragItem.opt.type) {
	case 'Frame':
		this.dragItem.attr({cx: x, cy: y});
		break;
	case 'WallHorizontal':
		this.dragItem.attr({x: x, y: y});
		break;
	default:
		console.log('def');
		break;
	}
};

SvgFurniture.prototype.createAndSetFrame = function(x, y) {
	var conf = this.state.config;
	var left = (this.width - conf.width)/2;
	var right = (this.width + conf.width)/2;
	var top = (this.height - conf.height)/2;
	var bottom = (this.height + conf.height)/2;

	// top
	var elemt = this.svg.rect(left, top, right - left, this.wallWidth);
	var eleml = this.svg.rect(left, top, this.wallWidth, bottom - top);
	var elemb = this.svg.rect(left, bottom, right - left, this.wallWidth);
	var elemr = this.svg.rect(right, top, this.wallWidth, bottom - top);

	console.log(elemt);

	$.each([elemt, eleml, elemb, elemr], function(i, elem) {
		elem.attr({
			stroke: "#000",
			strokeWidth: 1,
			fill: "#bb88ee"
		});
		this.item.push(elem);
	}.bind(this));

	elemt.opt = {
		type: 'Frame',
		g: elemt,
		area: {top: top, bottom: top + this.wallWidth, left: left, right: right},
	};
	eleml.opt = {
		type: 'Frame',
		g: eleml,
		area: {top: top, bottom: bottom, left: left, right: left + this.wallWidth},
	};
	elemb.opt = {
		type: 'Frame',
		g: elemb,
		area: {top: bottom, bottom: bottom + this.wallWidth, left: left, right: right},
	};
	elemr.opt = {
		type: 'Frame',
		g: elemr,
		area: {top: top, bottom: bottom, left: right, right: right + this.wallWidth},
	};

//	this.item.concat([elemt, eleml, elemb, elemr]);

/*
	var elem = this.svg.rect(left, top, right - left, bottom - top);
	elem.attr({
		stroke: "#bb88ee",
		strokeWidth: 30,
		fill: "none"
	});
	elem.opt = {
		type: 'Frame',
		g: elem
		area = {t: bottom, bottom: top, left: right, right: left};
	}
*/
	
//	return elem;
};

SvgFurniture.prototype.setFrame = function(x, y) {
};

SvgFurniture.prototype.createWallHorizontal = function(x, y) {
	var elem = this.svg.rect(x - 40, y - 40, 80, 80);
	elem.attr({
		fill: "#bada55",
		stroke: "#000",
		strokeWidth: 1,
		x: 400
	});
	elem.opt = {
		type: 'WallHorizontal',
		g: elem,
	}

	return elem;
};

SvgFurniture.prototype.setWallHorizontal = function(x, y) {
	var it = this.dragItem;
	var adj = this.getAdjItems(x, y);

	console.log(adj.left);
	var left = adj.left.opt.area.right;
	var right = adj.right.opt.area.left;

	it.attr({
		x: left,
		y: y,
		width: right - left,
		height: this.wallWidth
	});
	it.opt.area = {top: y, bottom: y + this.wallWidth, left: left, right: right};
};

SvgFurniture.prototype.getAdjItems = function(x, y) {
	var res = {};
	var area = {top: 0, bottom: this.height, left: 0, right: this.width};

	$.each(this.item, function(i, it) {
		var a = it.opt.area;
		console.log(it.node);
		console.log(a);
		if (area.top < a.bottom && x >= a.left && x <= a.right && a.bottom < y) {
			res.top = it;
			area.top = a.bottom;
		}
		if (area.bottom > a.top && x >= a.left && x <= a.right && a.top > y) {
			res.bottom = it;
			area.bottom = a.top;
		}
		if (area.left < a.right && y >= a.top && y <= a.bottom && a.right < x) {
			res.left = it;
			area.left = a.right;
		}
		if (area.right > a.left && y >= a.top && y <= a.bottom && a.left > x) {
			res.right = it;
			area.right = a.left;
		}
	});

	return res;
};

