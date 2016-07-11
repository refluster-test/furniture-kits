var Svg = function(left, top, width, height, svg) {
	this.svg = svg;
	this.width = width;
	this.height = height;
	this.state = new Database().restore();
	this.dragItem = undefined;
	this.wallWidth = 30;
	this.zMax = 100;

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

	this.wallAttr = {
		stroke: "#000",
		strokeWidth: 1,
		fill: this.state.config.wallColor,
	};

	this.item = [];
	this.createAndSetFrame();
	$.each(this.state.item, function(idx, _it) {
		var it = this.createDraggingItem(_it.type);
		this.type[_it.type].set(_it.pos.x, _it.pos.y);
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
		this.type[this.dragItem.opt.type].set(x, y);
		this.dragItem.remove();
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

// front coordinate top, left, bottom, right
Svg.prototype.get3dBox = function(top, left, bottom, right) {
	var g = this.svg.g();
	var front = this.svg.rect(left, top, right - left, bottom - top);
	var hWall, vWall;

	g.add(front);
	front.opt = {g: g};
	g.opt = {
		g: g,
		area: {top: top, bottom: bottom, left: left, right: right},
	};

	function setOverWall(p1, p2) {
		var pz1 = this.getViewPosition(p1.x, p1.y, this.zMax);
		var pz2 = this.getViewPosition(p2.x, p2.y, this.zMax);
		var path = this.svg.path('M' + p1.x + ',' + p1.y +
								 'L' + p2.x + ',' + p2.y +
								 'L' + pz2.x + ',' + pz2.y +
								 'L' + pz1.x + ',' + pz1.y +
								 'Z');
		path.attr(this.wallAttr);
		return path;
	}

	var area = g.opt.area;
	if (area.top > this.height/2) {
		hWall = setOverWall.call(this, {x: area.left, y: area.top}, {x: area.right, y: area.top});
	} else if (area.bottom < this.height/2) {
		hWall = setOverWall.call(this, {x: area.left, y: area.bottom}, {x: area.right, y: area.bottom});
	}
	if (area.left > this.width/2) {
		vWall = setOverWall.call(this, {x: area.left, y: area.top}, {x: area.left, y: area.bottom});
	} else if (area.right < this.width/2) {
		vWall = setOverWall.call(this, {x: area.right, y: area.top}, {x: area.right, y: area.bottom});
	}
	$.each([hWall, vWall], function(i, w) {
		if (w) {
			w.opt = {g: g};
			g.add(w);
		}
	}.bind(this));

	g.attr(this.wallAttr);

	return g;
};

Svg.prototype.get3dPlain = function(top, left, bottom, right, z) {
	var obj = this.svg.rect(left, top, right - left, bottom - top);

	obj.opt = {
		g: obj,
		area: {top: top, bottom: bottom, left: left, right: right},
	};

	obj.attr(this.wallAttr);

	return obj;
};

Svg.prototype.createAndSetFrame = function() {
	var conf = this.state.config;
	var left = (this.width - conf.width)/2;
	var right = (this.width + conf.width)/2;
	var top = (this.height - conf.height)/2;
	var bottom = (this.height + conf.height)/2;

	var obj = this.get3dBox(top, left, top + this.wallWidth, right);
	obj.opt.type = 'Frame';
	this.insertObjToScene(obj);

	var obj = this.get3dBox(top, left, bottom, left + this.wallWidth);
	obj.opt.type = 'Frame';
	this.insertObjToScene(obj);

	var obj = this.get3dBox(bottom, left, bottom + this.wallWidth, right);
	obj.opt.type = 'Frame';
	this.insertObjToScene(obj);

	var obj = this.get3dBox(top, right, bottom, right + this.wallWidth);
	obj.opt.type = 'Frame';
	this.insertObjToScene(obj);
	
	var obj = this.getSideWall(top, true);
	obj.opt.type = 'Frame';
	this.insertObjToScene(obj);

	var obj = this.getSideWall(top, false);
	obj.opt.type = 'Frame';
	this.insertObjToScene(obj);
};

Svg.prototype.getSideWall = function(y, isLeft) {
	var w = this.wallWidth;
	var side, sideRoot;
	if (isLeft) {
		sideRoot = (this.width - this.state.config.width)/2;
		side = sideRoot - this.state.config.leftSide;
	} else {
		sideRoot = (this.width + this.state.config.width)/2;
		side = sideRoot + this.state.config.rightSide;
	}
	var pz = this.getViewPosition(side, y, this.zMax);
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

	g.attr(this.wallAttr);
	g.opt = {
		g: g,
		area: {top: 0, bottom: 0, left: 0, right: 0},
	};

	return g;
}

Svg.prototype.setFrame = function(x, y) {
};

Svg.prototype.createWallHorizontal = function() {
	var elem = this.svg.rect(-1000, -1000, 80, 80);
	elem.attr(this.wallAttr);
	elem.opt = {
		type: 'WallHorizontal',
		g: elem,
	}

	return elem;
};

Svg.prototype.createWallVertical = function() {
	var elem = this.svg.rect(-1000, -1000, 80, 80);
	elem.attr(this.wallAttr);
	elem.opt = {
		type: 'WallVertical',
		g: elem,
	}

	return elem;
};

Svg.prototype.createHanger = function() {
	var elem = this.svg.rect(-1000, -1000, 80, 80);
	elem.attr(this.wallAttr);
	elem.opt = {
		type: 'Hanger',
		g: elem,
	}

	return elem;
};

Svg.prototype.setWallHorizontal = function(x, y) {
	var adj = this.getAdjItems(x, y);

	if (!adj.left || !adj.right) {
		return false;
	}

	var left = adj.left.opt.area.right;
	var right = adj.right.opt.area.left;

	var obj = this.get3dBox(y, left, y  + this.wallWidth, right);
	obj.opt.type = 'WallHorizontal';
	this.insertObjToScene(obj);
	return true;
};

Svg.prototype.setWallVertical = function(x, y) {
	var adj = this.getAdjItems(x, y);

	if (!adj.top || !adj.bottom) {
		return false;
	}

	var top = adj.top.opt.area.bottom;
	var bottom = adj.bottom.opt.area.top;

	var obj = this.get3dBox(top, x, bottom, x + this.wallWidth);
	obj.opt.type = 'WallVertical';
	this.insertObjToScene(obj);
	return true;
};

Svg.prototype.setHanger = function(x, y) {
	var adj = this.getAdjItems(x, y);

	if (!adj.top) {
		return false;
	}

	var top = adj.top.opt.area.bottom;
	var width = 200;
	var height = 300;

	var obj = this.get3dPlain(top, x, top + height, x + width, 0);
	obj.opt.type = "Hanger";
	obj.attr(this.wallAttr);
	this.insertObjToScene(obj);
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

Svg.prototype.insertObjToScene = function(obj) {
	function getXZ(obj) {
		var x = (obj['0'] ? obj['0']: obj).getBBox().cx;
		var z = this.type[obj.opt.type].zIndex;
		return {x: x, z: z};
	}

	var xz = getXZ.call(this, obj);
	var insIdx = 0;

	$.each(this.item, function(i, o) {
		if (true) {
			insIdx = 0;
			return false;
		}
	}.bind(this));

	this.item.splice(insIdx, 0, obj);
	obj.insertBefore(this.item[insIdx]);
};
