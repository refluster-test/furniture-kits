const WH_RATIO = (3/4);

var Apl = function() {
	this.dragging = false;
	
	// get canvas DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) {
		return false;
	}
	this.ctx = $canvas[0].getContext("2d");

	// resize canvas
	$canvas.css('width', $canvas.width());
	$canvas.css('height', $canvas.width()*WH_RATIO);
	this.canvasStyleWidth = $canvas.width();
	this.canvasStyleHeight = $canvas.height();

	$canvas.attr('width', 1024);
	$canvas.attr('height', 1024*WH_RATIO);

	// get canvas info
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;
	this.canvasWidth = parseInt($canvas.attr('width'));
	this.canvasHeight = parseInt($canvas.attr('height'));

	// context settnigs
	this.ctx.strokeStyle = "#888";
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";

	// create room
	this.furniture = new Furniture(0, 100, this.canvasWidth, this.canvasHeight - 100);

	// create menu
	this.menu = new Menu(function(item) {
		this.furniture.setDragItem(item);
		this.dragging = true;
	}.bind(this));

	// set events to the canvas
	$canvas.mousedown(this.hDown.bind(this));
	$canvas.mouseup(this.hUp.bind(this));
	$canvas.mouseleave(this.hUp.bind(this));
	$canvas.mousemove(this.hMove.bind(this));
	$canvas.bind('touchstart', this.hDown.bind(this));
	$canvas.bind('touchend', this.hUp.bind(this));
	$canvas.bind('touchmove', this.hMove.bind(this));

	this.draw();
};

Apl.prototype._blank = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

Apl.prototype.draw = function() {
	this._blank();
	this.ctx.save();
	this.furniture.draw(this.ctx);
	this.ctx.restore();
};

Apl.prototype.hDown = function(e) {
	console.log('canvas hDown');

	if (!this.dragging) {
		// convert coordinate from point to canvas
		var x = (e.pageX? e.pageX: e.originalEvent.touches[0].pageX) - this.canvasLeft;
		var y = (e.pageY? e.pageY: e.originalEvent.touches[0].pageY) - this.canvasTop;
		x = parseInt(x * this.canvasWidth / this.canvasStyleWidth);
		y = parseInt(y * this.canvasHeight / this.canvasStyleHeight);
		console.log({x: x, y: y});

		if (this.furniture.isInternal(x, y)) {
			this.furniture.grabItem(x, y);
		}
		this.dragging = true;
	}
	e.preventDefault();
};

Apl.prototype.hUp = function(e) {
	console.log('canvas hUp');
	this.dragging = false;
	this.furniture.releaseItem();
	this.draw();
	e.preventDefault();
};

Apl.prototype.hMove = function(e, p) {
	console.log('canvas hMove');
	if (this.dragging) {
		// convert coordinate from point to canvas
		console.log(e);
		var pageX, pageY;
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
		x = pageX - this.canvasLeft;
		y = pageY - this.canvasTop;
		x = parseInt(x * this.canvasWidth / this.canvasStyleWidth);
		y = parseInt(y * this.canvasHeight / this.canvasStyleHeight);
		// check if the canvas should be updated
		if (this.furniture.move(x, y)) {
			this.draw();
		}
	}
	e.preventDefault();
};

$(function() {
	var apl = new Apl();
});
