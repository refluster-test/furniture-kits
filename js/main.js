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
	this.menu = new Menu(0, 0, this.canvasWidth, 100, function(item) {
		this.furniture.setDragItem(item);
		this.dragging = true;
		this.draw();
	}.bind(this));

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
	this.menu.draw(this.ctx);
	this.ctx.restore();
};

Apl.prototype.hDown = function(evt) {
	if (!this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		x = parseInt(x * this.canvasWidth / this.canvasStyleWidth);
		y = parseInt(y * this.canvasHeight / this.canvasStyleHeight);

		if (this.menu.isInternal(x, y)) {
			this.menu.operate(x, y, function(e) {
				switch (e.type) {
				case Menu.SPAWN_ITEM:
					var item = new e.newItemType();
					this.furniture.setDragItem(item);
					break;
				case Menu.CHANGE_CONFIG:
					break;
				}
			}.bind(this));
		}
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
