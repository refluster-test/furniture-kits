const WH_RATIO = (3/4);

var Apl = function(stateJson) {
	this.dragging = false;
	this.svg = Snap('#svg');

	$('#svg').css('width', $('#svg').width());
	$('#svg').css('height', $('#svg').width()*WH_RATIO);
	this.svgStyleWidth = $('#svg').width();
	this.svgStyleHeight = $('#svg').height();
	this.svgLeft = $('#svg').offset().left;
	this.svgTop = $('#svg').offset().top;
	this.svgWidth = 1024;
	this.svgHeight = parseInt(1024*WH_RATIO);

	$('#svg').attr('viewBox', '0 0 ' + this.svgWidth + ' ' + this.svgHeight);

	if (stateJson) {
		state = JSON.parse(stateJson);
	} else {
		this.db = new Database();
		state = this.db.restore();
	}

	this.svg = new Svg(0, 0, this.svgWidth, this.svgHeight, this.svg, state);

	// create menu
	this.Menu = new Menu(function(type) {
		var item = this.svg.createDraggingItem(type);
		this.dragging = true;
	}.bind(this));

	$('#svg').mousedown(this.hDown.bind(this));
	$('#svg').mouseup(this.hUp.bind(this));
	$('#svg').mouseleave(this.hUp.bind(this));
	$('#svg').mousemove(this.hMove.bind(this));
	$('#svg').bind('touchstart', this.hDown.bind(this));
	$('#svg').bind('touchend', this.hUp.bind(this));
	$('#svg').bind('touchmove', this.hMove.bind(this));
};

Apl.prototype.hDown = function(e) {
	if (!this.dragging) {
		var x = (e.pageX? e.pageX: e.touches[0].pageX);
		var y = (e.pageY? e.pageY: e.touches[0].pageY);
		var obj = Snap.getElementByPoint(x, y);
		if (obj.opt !== undefined && obj.opt.g.opt.type != 'Frame') {
			var type = obj.opt.g.opt.type;
			this.svg.reserveRemoveItem(obj.opt.g);
			this.svg.createDraggingItem(type);
			this.dragging = true;
		}
	}
	e.preventDefault();
};

Apl.prototype.hUp = function(e) {
	this.dragging = false;
	this.svg.releaseItem();
	e.preventDefault();
};

Apl.prototype.hMove = function(e, p) {
	if (this.dragging) {
        var pageX, pageY, x, y;
		if (e.pageX) {
			pageX = e.pageX;
			pageY = e.pageY;
		} else if (e.originalEvent !== undefined) {
			pageX = e.originalEvent.touches[0].pageX;
			pageY = e.originalEvent.touches[0].pageY;
		} else if (p) {
			pageX = p.pageX;
			pageY = p.pageY;
		}
		x = pageX - this.svgLeft;
		y = pageY - this.svgTop;
		x = parseInt(x * this.svgWidth / this.svgStyleWidth);
		y = parseInt(y * this.svgHeight / this.svgStyleHeight);
		this.svg.move(x, y);
	}
	e.preventDefault();
};

Apl.prototype.saveState = function(e) {
	console.log('press save');
	console.log(this.svg.toJson());
	console.log(JSON.stringify(this.svg.toJson()));
};

$(function() {
	var s = '{"config":{"width":800,"height":600,"wallColor":"#bb88ee","windowColor":"","leftSide":200,"rightSide":250},"item":[{"type":"WallHorizontal","pos":{"x":527,"y":210},"insOrder":6},{"type":"WallHorizontal","pos":{"x":212.5,"y":344},"insOrder":9},{"type":"WallVertical","pos":{"x":298,"y":454.5},"insOrder":7},{"type":"WallHorizontal","pos":{"x":612.5,"y":270},"insOrder":12},{"type":"WallVertical","pos":{"x":615,"y":318},"insOrder":13},{"type":"WallHorizontal","pos":{"x":612.5,"y":366},"insOrder":8},{"type":"WallVertical","pos":{"x":404,"y":532.5},"insOrder":10},{"type":"Hanger","pos":{"x":577,"y":531},"insOrder":11}]}'
	var apl = new Apl(s);

	$('#save').click(function() {
		apl.saveState();
	});
});
