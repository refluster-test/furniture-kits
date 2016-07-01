const WH_RATIO = (3/4);

var Furniture = function(width, height) {
	this.width = width;
	this.height = height;

	// create items
	this.item = [];
	this.item.push(new Item(Item.CIRCLE, 40));
	this.item.push(new Item(Item.TRIANGLE, 40));
	this.item.push(new Item(Item.SQUARE, 40));
	for (var i = 0; i < this.item.length; i++) {
		// initialize position randomely in the canvas
		var x = parseInt(Math.random()*(this.width - 40) + 20);
		var y = parseInt(Math.random()*(this.height - 40) + 20);
		this.item[i].setPosition(x, y);
		console.log({x: x, y: y});
	}
};

Furniture.prototype.draw = function(ctx) {
	for (var i = 0; i < this.item.length; i++) {
		this.item[i].draw(ctx);
	}
};

Furniture.prototype.checkItem = function(x, y) {
	for (var i = 0; i < this.item.length; i++) {
		if (this.item[i].isInternal(x, y)) {
			return i;
		}
	}
	return null;
};

Furniture.prototype.move = function(idx, x, y) {
	if (x != this.item[idx].x ||
		y != this.item[idx].y) {
		this.item[idx].setPosition(x, y);
		return true;
	}
	return false;
}

var Apl = function() {
	this.dragging = false;
	this.dragItem = null;
	
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

	$canvas.attr('width', $canvas.width());
	$canvas.attr('height', $canvas.width()*WH_RATIO);

	// get canvas info
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;
	this.canvasWidth = parseInt($canvas.attr('width'));
	this.canvasHeight = parseInt($canvas.attr('height'));

	console.log({cw: this.canvasStyleWidth,
				 ch: this.canvasStyleHeight,
				 w: this.canvasWidth,
				 h: this.canvasHeight});

	// context settnigs
	this.ctx.strokeStyle = "#888";
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";

	// create room
	this.furniture = new Furniture(this.canvasWidth, this.canvasHeight);

	// set events to the canvas
	$canvas.mousedown(this.hDown.bind(this));
	$canvas.mouseup(this.hUp.bind(this));
	$canvas.mouseleave(this.hUp.bind(this));
	$canvas.mousemove(this.hMove.bind(this));

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
Apl.prototype.checkItem = function(x, y) {
	x *= this.canvasWidth / this.canvasStyleWidth;
	y *= this.canvasHeight / this.canvasStyleHeight;

	return this.furniture.checkItem(x, y);
};
Apl.prototype.hDown = function(evt) {
	if (!this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		console.log({x: x, y: y});
		x *= this.canvasWidth / this.canvasStyleWidth;
		y *= this.canvasHeight / this.canvasStyleHeight;
		console.log({x: x, y: y});
		// check if any object is at the point
		var itemIdx = this.checkItem(x, y);
		console.log(itemIdx);
		if (itemIdx != null) {
			this.dragging = true;
			this.dragItem = itemIdx;
		}
	}
};
Apl.prototype.hUp = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		if (x < 0) x = 0;
		if (x > this.canvasWidth) x = this.canvasWidth;
		if (y < 0) y = 0;
		if (y > this.canvasHeight) y = this.canvasHeight;
		// update canvas
		this.draw();

		this.dragging = false;
		this.dragItem = null;
	}
};
Apl.prototype.hMove = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		x *= this.canvasWidth / this.canvasStyleWidth;
		y *= this.canvasHeight / this.canvasStyleHeight;
		// check if the canvas should be updated
		if (this.furniture.move(this.dragItem, x, y)) {
			this.draw();
		}
	}
};

$(function() {
	var apl = new Apl();
});
