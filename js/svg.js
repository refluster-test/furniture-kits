var Svg = function(left, top, width, height, svg) {
	this.svg = svg;
	this.width = width;
	this.height = height;
	this.state = new Database().restore();
	this.dragItem = undefined;
	this.wallWidth = 30;

	this.type = {
		'Frame': {
			zIndex: 0,
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

Svg.prototype.createItem = function(type) {
	return this.type[type].create(0, 0);
};

Svg.prototype.setItem = function(x, y) {
	return this.type[this.dragItem.opt.type].set(x, y);
};

Svg.prototype.setDragItem = function(item) {
	this.dragItem = item;
};

Svg.prototype.releaseItem = function() {
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

Svg.prototype.move = function(x, y) {
	if (! this.dragItem) {
		return;
	}
	switch (this.dragItem.opt.type) {
	case 'Frame':
		break;
	case 'WallHorizontal':
		this.dragItem.attr({x: x, y: y});
		break;
	default:
		console.log('def');
		break;
	}
};

Svg.prototype.createAndSetFrame = function(x, y) {
	var conf = this.state.config;
	var left = (this.width - conf.width)/2;
	var right = (this.width + conf.width)/2;
	var top = (this.height - conf.height)/2;
	var bottom = (this.height + conf.height)/2;

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
};

Svg.prototype.setFrame = function(x, y) {
};

Svg.prototype.createWallHorizontal = function(x, y) {
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

Svg.prototype.setWallHorizontal = function(x, y) {
	var it = this.dragItem;
	var adj = this.getAdjItems(x, y);

	if (!adj.left || !adj.right) {
		this.dragItem.remove();
		this.dragItem = undefined;
		return;
	}

	var left = adj.left.opt.area.right;
	var right = adj.right.opt.area.left;

	it.attr({x: left, y: y, width: right - left, height: this.wallWidth});
	it.opt.area = {top: y, bottom: y + this.wallWidth, left: left, right: right};
};

Svg.prototype.getAdjItems = function(x, y) {
	var res = {};
	var area = {top: 0, bottom: this.height, left: 0, right: this.width};

	$.each(this.item, function(i, it) {
		var a = it.opt.area;
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

