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

	this.draw();

	////////////////////////////// svg
	this.svg = Snap('#svg');
	$('#svg').css('width', $('#svg').width());
	$('#svg').css('height', $('#svg').width()*WH_RATIO);
	this.svgStyleWidth = $('#svg').width();
	this.svgStyleHeight = $('#svg').height();
	this.svgLeft = $('#svg').offset().left;
	this.svgTop = $('#svg').offset().top;
	this.svgWidth = parseInt($('#svg').attr('width'));
	this.svgHeight = parseInt($('#svg').attr('height'));

	//$('#svg').attr('width', 1024);
	//$('#svg').attr('height', 1024*WH_RATIO);
	$('#svg').attr('viewBox', '0 0 1024 ' + parseInt(1024*WH_RATIO));

	this.svgFurniture = new SvgFurniture(0, 100, this.svgWidth, this.svgHeight - 100,
										this.svg);
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

Apl.prototype.svgDraw = function() {
	this.svgFurniture.draw();
};

Apl.prototype.hDown = function(evt) {
	if (!this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		x = parseInt(x * this.canvasWidth / this.canvasStyleWidth);
		y = parseInt(y * this.canvasHeight / this.canvasStyleHeight);

		if (this.furniture.isInternal(x, y)) {
			this.furniture.grabItem(x, y);
		}
		this.dragging = true;
	}
};

Apl.prototype.hUp = function(evt) {
	this.dragging = false;
	this.furniture.releaseItem();
	this.draw();
};

Apl.prototype.hMove = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		x = parseInt(x * this.canvasWidth / this.canvasStyleWidth);
		y = parseInt(y * this.canvasHeight / this.canvasStyleHeight);
		// check if the canvas should be updated
		if (this.furniture.move(x, y)) {
			this.draw();
		}
	}
};

$(function() {
	var apl = new Apl();
});
