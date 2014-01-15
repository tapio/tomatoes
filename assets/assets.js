var assets = {
	blocks: {
		"bridge": { sprite: "bridge.png", collision: "box" },
		"grass": { sprite: "grass.png", collision: "box", platform: true },
		"dirt": { sprite: "drit.png", collision: "box", platform: true },
		"castle": { sprite: "castle.png", collision: "box", platform: true },
		"snow": { sprite: "snow.png", collision: "box", platform: true },
		"stone": { sprite: "stone.png", collision: "box", platform: true },
		"ladder": { sprite: "ladder.png", ladder: true },
		"water": { sprite: "water.png", water: true },
		"lava": { sprite: "lava.png", water: true }
	},
	clutter: {
		"bush-small": { size: {x:1,y:1}, sprite: "bush.png" },
		"bush-large": { size: {x:2,y:1.5}, sprite: "bush.png" },
		"cactus": { size: {x:1.5,y:2}, sprite: "cactus.png" },
		"plant-tiny": { size: {x:1,y:1}, sprite: "plant.png" },
		"mushroom1": { size: {x:1,y:1}, sprite: "mushroom-brown.png" },
		"mushroom2": { size: {x:1,y:1}, sprite: "mushroom-red.png" },
		"rock": { size: {x:1,y:1}, sprite: "rock.png" }
	},
	objects: {
		"box": { size: {x:0.8,y:0.8}, sprite: "box.png", collision: "box", mass: 10 }
	},
	powerups: {

	},
	characters: [
		{ size: {x:0.8,y:0.8}, sprite: "red.png" },
		{ size: {x:0.8,y:0.8}, sprite: "green.png" },
		{ size: {x:0.8,y:0.8}, sprite: "yellow.png" },
		{ size: {x:0.8,y:0.8}, sprite: "blue.png" }
	],
	levels: [
		{
			name: "Grass",
			tiles: {
				platform: "grass",
				bridge: "bridge",
				ladder: "ladder",
				water: "water"
			},
			objects: {
				"box": 5
			},
			clutter: {
				"bush-small": 2,
				"bush-large": 2,
				"plant-tine": 5,
				"mushroom1": 2,
				"mushroom2": 2
			}
		}
	]
};
