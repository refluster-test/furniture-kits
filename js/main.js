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

Apl.prototype.getState = function() {
	console.log('press save');
	console.log(this.svg.toJson());
	return JSON.stringify(this.svg.toJson());
};

Apl.prototype.putState = function(s) {
	console.log('press restore');
	this.svg.fromJson(JSON.parse(s));
};

$(function() {
	var apl = new Apl();

	$('#save').click(function() {
		var state = apl.getState();
		localStorage.state = state;
	});
	
	$('#restore').click(function() {
		var state = localStorage.state;
		apl.putState(state);
	});
});
