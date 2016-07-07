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

	this.item = [];
	this.createAndSetFrame();
	$.each(this.state.item, function(idx, _it) {
		var it = this.createDraggingItem(_it.type);
		if (this.type[_it.type].set(_it.pos.x, _it.pos.y)) {
			this.item.push(this.dragItem);
		}
		this.dragItem = undefined;
	}.bind(this));
};

Svg.prototype.createItem = function(type) {
	return this.type[type].create();
};

Svg.prototype.reserveRemoveItem = function(obj) {
	this.removeItem = obj;
	obj.attr('transform', 'translate(' + this.width + ',0)');
};

Svg.prototype.createDraggingItem = function(type) {
	var it = this.type[type].create();
	this.dragItem = it;
	return it;
};

Svg.prototype.releaseItem = function() {
	if (this.removeItem) {
		$.each(this.item, function(idx, item) {
			if (this.removeItem == item) {
				this.item.splice(idx, 1);
				return false;
			}
		}.bind(this));
		// remove children if exists
		for (var i = 0; i < 10; i++) {
			if (this.removeItem[String(i)]) {
				this.removeItem[String(i)].remove();
			}
		}
		this.removeItem.remove();
		this.removeItem = undefined;
	}
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
	this.dragItem = undefined;
};

Svg.prototype.move = function(x, y, item) {
	if (! item) {
		item = this.dragItem;
	}
	if (! item) {
		return;
	}
	switch (item.opt.type) {
	case 'Frame':
		break;
	case 'WallHorizontal':
	case 'WallVertical':
	case 'Hanger':
		item.attr({x: x, y: y});
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

	var gt = this.svg.g(elemt);
	elemt.opt = {g: gt};
	gt.opt = {
		type: 'Frame',
		g: gt,
		area: {top: top, bottom: top + this.wallWidth, left: left, right: right},
	};
	this.addOverWallAsGroup(gt);
	this.item.push(gt);

	var gl = this.svg.g(eleml);
	eleml.opt = {g: gl};
	gl.opt = {
		type: 'Frame',
		g: gl,
		area: {top: top, bottom: bottom, left: left, right: left + this.wallWidth},
	};
	this.addOverWallAsGroup(gl);
	this.item.push(gl);

	var gb = this.svg.g(elemb);
	elemb.opt = {g: gb};
	gb.opt = {
		type: 'Frame',
		g: gb,
		area: {top: bottom, bottom: bottom + this.wallWidth, left: left, right: right},
	};
	this.addOverWallAsGroup(gb);
	this.item.push(gb);

	var gr = this.svg.g(elemr);
	elemr.opt = {g: gr};
	gr.opt = {
		type: 'Frame',
		g: gr,
		area: {top: top, bottom: bottom, left: right, right: right + this.wallWidth},
	};
	this.addOverWallAsGroup(gr);
	this.item.push(gr);

	var sw = [];
	sw.push(this.getSideWall(top, true));
	sw.push(this.getSideWall(top, false));
//	this.createSideWall(600, false);
	$.each(sw, function(i, sw) {
		sw.opt = {
			type: 'Frame',
			g: sw,
			area: {top: 0, bottom: 0, left: 0, right: 0},
		};
	});
};

Svg.prototype.getSideWall = function(y, isLeft) {
	var Z = 100;
	var w = this.wallWidth;
	var side, sideRoot;
	if (isLeft) {
		sideRoot = (this.width - this.state.config.width)/2;
		side = sideRoot - this.state.config.leftSide;
	} else {
		sideRoot = (this.width + this.state.config.width)/2;
		side = sideRoot + this.state.config.rightSide;
	}
	var pz = this.getViewPosition(side, y, Z);
	var p = [];

	p.push(this.svg.path('M'+ sideRoot + ',' + y +
						 'Q' + pz.x + ',' + y + ',' + pz.x + ' ' + pz.y +
						 'L' + pz.x + ',' + (pz.y + w) +
						 'Q' + pz.x + ',' + (y + w) + ',' + sideRoot + ' ' + (y + w) +
						 'Z'));
	if (y + w < this.height/2) {
		p.push(this.svg.path('M' + pz.x + ',' + (pz.y + w) +
							 'Q' + pz.x + ',' + (y + w) + ',' + sideRoot + ' ' + (y + w) +
							 'L' + sideRoot + ',' + (pz.y + w) +
							 'Z'));
	} else if (y > this.height/2) {
		p.push(this.svg.path('M' + pz.x + ',' + pz.y +
							 'Q' + pz.x + ',' + y + ',' + sideRoot + ' ' + y +
							 'L' + sideRoot + ',' + pz.y +
							 'Z'));
	}

	var g = this.svg.g();
	$.each(p, function(i, p) {
		p.opt = {g: g};
		g.add(p);
	});

	g.attr({
		stroke: "#000",
		strokeWidth: 1,
		fill: "#bb88ee",
	});

	return g;
}

Svg.prototype.addOverWallAsGroup = function(g) {
	function setOverWall(p1, p2) {
		var Z = 100;
		if (p1 && p2) {
			var pz1 = this.getViewPosition(p1.x, p1.y, Z);
			var pz2 = this.getViewPosition(p2.x, p2.y, Z);
			var path = this.svg.path('M' + p1.x + ',' + p1.y +
									 'L' + p2.x + ',' + p2.y +
									 'L' + pz2.x + ',' + pz2.y +
									 'L' + pz1.x + ',' + pz1.y +
									 'Z');
			path.attr({
				stroke: "#000",
				strokeWidth: 1,
				fill: "#bb88ee",
			});
			return path;
		}
		return undefined;
	}

	var area = g.opt.area;
	var p1, p2;
	p1 = p2 = undefined;
	if (area.top > this.height/2) {
		p1 = {x: area.left, y: area.top};
		p2 = {x: area.right, y: area.top};
	} else if (area.bottom < this.height/2) {
		p1 = {x: area.left, y: area.bottom};
		p2 = {x: area.right, y: area.bottom};
	}
	var hWall = setOverWall.call(this, p1, p2);
	if (hWall) {
		hWall.opt = {g: g};
		g.add(hWall);
	}
	p1 = p2 = undefined;
	if (area.left > this.width/2) {
		p1 = {x: area.left, y: area.top};
		p2 = {x: area.left, y: area.bottom};
	} else if (area.right < this.width/2) {
		p1 = {x: area.right, y: area.top};
		p2 = {x: area.right, y: area.bottom};
	}
	var vWall = setOverWall.call(this, p1, p2);
	if (vWall) {
		vWall.opt = {g: g};
		g.add(vWall);
	}

	g.attr({
		stroke: "#000",
		strokeWidth: 1,
		fill: "#bb88ee"
	});
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
	var elem = this.dragItem;
	var adj = this.getAdjItems(x, y);

	if (!adj.left || !adj.right) {
		elem.remove();
		return false;
	}

	var left = adj.left.opt.area.right;
	var right = adj.right.opt.area.left;

	elem.attr({x: left, y: y, width: right - left, height: this.wallWidth});

	var g = this.svg.g(elem);
	g.opt = elem.opt;
	g.opt.area =  {top: y, bottom: y + this.wallWidth, left: left, right: right}
	elem.opt = {g: g};
	this.addOverWallAsGroup(g);
	this.dragItem = g;
	return true;
};

Svg.prototype.setWallVertical = function(x, y) {
	var elem = this.dragItem;
	var adj = this.getAdjItems(x, y);

	if (!adj.top || !adj.bottom) {
		this.dragItem.remove();
		return false;
	}

	var top = adj.top.opt.area.bottom;
	var bottom = adj.bottom.opt.area.top;

	elem.attr({x: x, y: top, width: this.wallWidth, height: bottom - top});
	var g = this.svg.g(elem);
	g.opt = elem.opt;
	g.opt.area =  {top: top, bottom: bottom, left: x, right: x + this.wallWidth};
	elem.opt = {g: g};
	this.addOverWallAsGroup(g);
	this.dragItem = g;
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
