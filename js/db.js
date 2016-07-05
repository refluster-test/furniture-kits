var Database = function() {
	this.state = {
		config: {
			width: 800,
			height: 600,
			wallColor: '#68c',
			windowColor: ''
		},
		item: [
			{
				type: ItemFrame,
				pos: {x: 500, y: 400},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 400, y: 180},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 350, y: 380},
			},
/*
			{
				type: ItemWallVertical,
				pos: {x: 180, y: 80},
				linkItem: [0, 0],
			},
*/
		]
	};
};

Database.prototype.restore = function() {
	return this.state;
};

var SvgDatabase = function() {
	this.state = {
		config: {
			width: 800,
			height: 600,
			wallColor: '#68c',
			windowColor: ''
		},
		item: [
			{
				type: ItemFrame,
				pos: {x: 500, y: 400},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 400, y: 180},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 350, y: 380},
			},
		]
	};
};

SvgDatabase.prototype.restore = function() {
	return this.state;
};
