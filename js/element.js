var Element = function(left, top, width, height) {
	this.area = {l: left, t: top, r: left + width, b: top + height};
};

Element.prototype.isInternal = function(x, y) {
	if (x >= this.area.l && x <= this.area.r && 
		y >= this.area.t && y <= this.area.b) {
		return true;
	}
	return false;
};
