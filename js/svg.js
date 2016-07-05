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
		'WallVertical': {
			zIndex: 0,
			create: this.createWallVertical.bind(this),
			set: this.setWallVertical.bind(this),
		},
		'Hanger': {
			zIndex: 0,
			create: this.createHanger.bind(this),
			set: this.setHanger.bind(this),
		},
	};

	var item = this.state.item
	this.item = [];

	this.createAndSetFrame();

	for (var i = 0; i < item.length; i++) {
		var it = this.createDraggingItem(item[i].type);
		this.type[item[i].type].set(item[i].pos.x, item[i].pos.y);
		this.item.push(it);
	}
};

Svg.prototype.createItem = function(type) {
	return this.type[type].create();
};

Svg.prototype.deleteItem = function(obj) {
	obj.remove();
};

Svg.prototype.reserveRemoveItem = function(obj) {
	this.removeItem = obj;
	this.dragItem = obj;
	this.move(this.width, 0);
};

Svg.prototype.createDraggingItem = function(type) {
	console.log('createDraggingItem');
	var it = this.type[type].create();
	this.dragItem = it;
	return it;
};

Svg.prototype.releaseItem = function() {
	if (this.dragItem) {
		var x, y;
		if (this.dragItem.node.nodeName == 'circle') {
			x = parseInt(this.dragItem.attr('cx'));
			y = parseInt(this.dragItem.attr('cy'));
		} else {
			x = parseInt(this.dragItem.attr('x'));
			y = parseInt(this.dragItem.attr('y'));
		}
		if (this.type[this.dragItem.opt.type].set(x, y)) {
			this.item.push(this.dragItem);
		}
	}
	if (this.removeItem) {
		this.removeItem.remove();
		this.removeItem = undefined;
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
	case 'WallVertical':
	case 'Hanger':
		this.dragItem.attr({x: x, y: y});
		break;
	default:
		console.log('def');
		break;
	}
};

Svg.prototype.createAndSetFrame = function() {
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

	//////////////////////////////////
	var Z = 100;
	$.each([elemt, eleml, elemb, elemr], function(i, elem) {
		var area = elem.opt.area;
		var p1, p2;
		p1 = p2 = undefined;
		if (area.top > this.height/2) {
			p1 = {x: area.left, y: area.top};
			p2 = {x: area.right, y: area.top};
		} else if (area.bottom < this.height/2) {
			p1 = {x: area.left, y: area.bottom};
			p2 = {x: area.right, y: area.bottom};
		}
		if (p1 && p2) {
			var pz1 = this.getViewPosition(p1.x, p1.y, Z);
			var pz2 = this.getViewPosition(p2.x, p2.y, Z);
			var path = this.svg.path('M' + p1.x + ',' + p1.y +
									 'L' + p2.x + ',' + p2.y +
									 'L' + pz2.x + ',' + pz2.y +
									 'L' + pz1.x + ',' + pz1.y +
									 'L' + p1.x + ',' + p1.y);
			path.attr({
				stroke: "#000",
				strokeWidth: 1,
				fill: "#bb88ee",
			});
		}
		p1 = p2 = undefined;
		if (area.left > this.width/2) {
			p1 = {x: area.left, y: area.top};
			p2 = {x: area.left, y: area.bottom};
		} else if (area.right < this.width/2) {
			p1 = {x: area.right, y: area.top};
			p2 = {x: area.right, y: area.bottom};
		}
		if (p1 && p2) {
			var pz1 = this.getViewPosition(p1.x, p1.y, Z);
			var pz2 = this.getViewPosition(p2.x, p2.y, Z);
			var path = this.svg.path('M' + p1.x + ',' + p1.y +
									 'L' + p2.x + ',' + p2.y +
									 'L' + pz2.x + ',' + pz2.y +
									 'L' + pz1.x + ',' + pz1.y +
									 'L' + p1.x + ',' + p1.y);
			path.attr({
				stroke: "#000",
				strokeWidth: 1,
				fill: "#bb88ee",
			});
		}
	}.bind(this));
};

Svg.prototype.setFrame = function(x, y) {
};

Svg.prototype.createWallHorizontal = function() {
	var elem = this.svg.rect(-1000, -1000, 80, 80);
	elem.attr({
		fill: this.state.config.wallColor,
		stroke: "#000",
		strokeWidth: 1,
	});
	elem.opt = {
		type: 'WallHorizontal',
		g: elem,
	}

	return elem;
};

Svg.prototype.createWallVertical = function() {
	var elem = this.svg.rect(-1000, -1000, 80, 80);
	elem.attr({
		fill: this.state.config.wallColor,
		stroke: "#000",
		strokeWidth: 1,
	});
	elem.opt = {
		type: 'WallVertical',
		g: elem,
	}

	return elem;
};

Svg.prototype.createHanger = function() {
	var elem = this.svg.rect(-1000, -1000, 80, 80);
	elem.attr({
		fill: this.state.config.wallColor,
		stroke: "#000",
		strokeWidth: 1,
	});
	elem.opt = {
		type: 'Hanger',
		g: elem,
	}

	return elem;
};

Svg.prototype.setWallHorizontal = function(x, y) {
	var it = this.dragItem;
	var adj = this.getAdjItems(x, y);

	if (!adj.left || !adj.right) {
		this.dragItem.remove();
		return false;
	}

	var left = adj.left.opt.area.right;
	var right = adj.right.opt.area.left;

	it.attr({x: left, y: y, width: right - left, height: this.wallWidth});
	it.opt.area = {top: y, bottom: y + this.wallWidth, left: left, right: right};
	return true;
};

Svg.prototype.setWallVertical = function(x, y) {
	var it = this.dragItem;
	var adj = this.getAdjItems(x, y);

	console.log(it);
	if (!adj.top || !adj.bottom) {
		this.dragItem.remove();
		return false;
	}

	var top = adj.top.opt.area.bottom;
	var bottom = adj.bottom.opt.area.top;

	it.attr({x: x, y: top, width: this.wallWidth, height: bottom - top});
	it.opt.area = {top: top, bottom: bottom, left: x, right: x + this.wallWidth};
	return true;
};

Svg.prototype.setHanger = function(x, y) {
	var it = this.dragItem;
	var adj = this.getAdjItems(x, y);

	if (!adj.top) {
		this.dragItem.remove();
		return false;
	}

	var top = adj.top.opt.area.bottom;
	var width = 200;
	var height = 300;
	it.attr({x: x, y: top, width: width, height: height});
	it.opt.area = {top: top, bottom: top + height, left: x, right: x + width};
	return true;
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
	console.log(res);

	return res;
};

Svg.prototype.getViewPosition = function(x, y, z) {
	var camZ = -300;
	var camX = this.width/2;
	var camY = this.height/2;

	var r = (0 - camZ)/(z - camZ)
	var newX = parseInt((x - camX)*r + camX);
	var newY = parseInt((y - camY)*r + camY);

	return {x: newX, y:newY};
};
