const WH_RATIO = (3/4);

var Apl = function() {
	this.dragging = false;
	this.svg = Snap('#svg');

	/*
	var bigCircle = this.svg.circle(150, 150, 100);
	var bigrect = this.svg.rect(30, 30, 100, 80);
	var group = this.svg.g(bigCircle, bigrect);

	bigCircle.touchstart(this.hDown.bind(this));

	bigCircle.originalType = 'hoge';
	bigrect.originalType = 'fuga';

	console.log(bigCircle);
	console.log(bigrect);
	console.log(group);

	var testHash = {};
	testHash[bigCircle.id] = 'circle0';
	testHash[bigrect.id] = 'rect0';
	testHash[group.id] = 'group0';

	this.svg.touchmove(function(e) {
		console.log(e.touches[0].pageX, e.touches[0].pageY);
		var elm = Snap.getElementByPoint(e.touches[0].pageX, e.touches[0].pageY);
		console.log(elm);
		console.log(testHash[elm.id]);
	}.bind(this));

	this.svgDraw();
	*/
	$('#svg').css('width', $('#svg').width());
	$('#svg').css('height', $('#svg').width()*WH_RATIO);
	this.svgStyleWidth = $('#svg').width();
	this.svgStyleHeight = $('#svg').height();
	this.svgLeft = $('#svg').offset().left;
	this.svgTop = $('#svg').offset().top;
	this.svgWidth = 1024;
	this.svgHeight = parseInt(1024*WH_RATIO);

	$('#svg').attr('viewBox', '0 0 ' + this.svgWidth + ' ' + this.svgHeight);

	this.svgFurniture = new SvgFurniture(0, 0, this.svgWidth, this.svgHeight, this.svg);

	// create menu
	this.svgMenu = new SvgMenu(function(type) {
		var item = this.svgFurniture.createItem(type);
		this.svgFurniture.setDragItem(item);
		//this.svgFurniture.setDragItem(type);
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
		console.log(obj);
		if (obj.opt !== undefined) {
			this.svgFurniture.setDragItem(Snap.getElementByPoint(x, y).opt.g);
			this.dragging = true;
		}
	}
	e.preventDefault();
};

Apl.prototype.hUp = function(e) {
	this.dragging = false;
	this.svgFurniture.releaseItem();
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
		// check if the canvas should be updated
		this.svgFurniture.move(x, y);
	}
	e.preventDefault();
};

$(function() {
	var apl = new Apl();
});
