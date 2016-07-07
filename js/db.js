var Database = function() {
	this.state = {
		config: {
			width: 800,
			height: 600,
			wallColor: '#68c',
			windowColor: '',
			leftSide: 200,
			rightSide: 250,
		},
		item: [
/*
			{
				type: 'Frame',
				pos: {x: 150, y: 120},
			},
*/
			{
				type: 'WallHorizontal',
				pos: {x: 400, y: 180},
			},
/*
			{
				type: 'WallHorizontal',
				pos: {x: 30, y: 80},
			},
*/
		]
	};
};

Database.prototype.restore = function() {
	return this.state;
};
