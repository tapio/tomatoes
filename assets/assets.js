var assets = {
	blocks: {
		"bridge": { sprite: "bridge.png", collision: "box" },
		"grass": { sprite: "grass.png", collision: "box", platform: true },
		"dirt": { sprite: "dirt.png", collision: "box", platform: true },
		"castle": { sprite: "castle.png", collision: "box", platform: true },
		"snow": { sprite: "snow.png", collision: "box", platform: true },
		"stone": { sprite: "stone.png", collision: "box", platform: true },
		"ladder": { sprite: "ladder.png", ladder: true },
		"water": { sprite: "water.png", water: true },
		"lava": { sprite: "lava.png", water: true }
	},
	clutter: {
		"bush-small": { size: {x:1,y:1}, sprite: "clutter/bush.png" },
		"bush-large": { size: {x:2,y:1}, sprite: "clutter/bush.png" },
		"cactus": { size: {x:1.5,y:2}, sprite: "clutter/cactus.png" },
		"plant-tiny": { size: {x:1,y:1}, sprite: "clutter/plant.png" },
		"mushroom1": { size: {x:1,y:1}, sprite: "clutter/mushroom-brown.png" },
		"mushroom2": { size: {x:1,y:1}, sprite: "clutter/mushroom-red.png" },
		"rock": { size: {x:1,y:1}, sprite: "clutter/rock.png" },
		"rock2": { size: {x:1,y:1}, sprite: "clutter/rock2.png" }
	},
	objects: {
		"box": { size: {x:0.8,y:0.8}, sprite: "objects/box.png", collision: "box", mass: 10 },
		"dirt-rock": { size: {x:0.7,y:0.7}, sprite: "objects/dirt-rock.png", collision: "circle", mass: 100 },
		"stone": { size: {x:0.7,y:0.7}, sprite: "objects/stone.png", collision: "circle", mass: 150 }
	},
	powerups: {

	},
	characters: [
		{ size: {x:0.8,y:0.8}, sprite: "characters/red.png", collision: "circle", mass: 50, character: true },
		{ size: {x:0.8,y:0.8}, sprite: "characters/green.png", collision: "circle", mass: 50, character: true },
		{ size: {x:0.8,y:0.8}, sprite: "characters/yellow.png", collision: "circle", mass: 50, character: true },
		{ size: {x:0.8,y:0.8}, sprite: "characters/blue.png", collision: "circle", mass: 50, character: true }
	],
	levels: [
		{
			name: "Grass",
			background: "sky.png",
			tiles: {
				platform: "grass",
				bridge: "bridge",
				ladder: "ladder",
				water: "water"
			},
			objects: {
				"box": 5
			},
			clutterProbability: 0.25,
			clutter: {
				"bush-small": 2,
				"bush-large": 2,
				"plant-tiny": 5,
				"mushroom1": 2,
				"mushroom2": 2
			}
		}
	]
};
