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
				pos: {x: 500, y: 400, z: 0},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 400, y: 180, z: 0},
			},
			{
				type: ItemWallHorizontal,
				pos: {x: 350, y: 380, z: 0},
			},
/*
			{
				type: ItemWallVertical,
				pos: {x: 180, y: 80, z: 0},
				linkItem: [0, 0],
			},
*/
		]
	};
};

Database.prototype.restore = function() {
	return this.state;
};
