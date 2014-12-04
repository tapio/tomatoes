var assets = {
	blocks: {
		"bridge": { sprite: "bridge.png", collision: "box", mass: 50 },
		"grass": { sprite: "grass.png", collision: "box", platform: true },
		"dirt": { sprite: "dirt.png", collision: "box", platform: true },
		"castle": { sprite: "castle.png", collision: "box", platform: true },
		"sand": { sprite: "sand.png", collision: "box", platform: true },
		"snow": { sprite: "snow.png", collision: "box", platform: true },
		"stone": { sprite: "stone.png", collision: "box", platform: true },
		"ladder": { sprite: "ladder.png", ladder: true },
		"rope": { sprite: "rope.png", collision: "circle", size: {x:0.25,y:0.25}, mass: 1, rope: true },
		"water": { sprite: "water.png", water: true },
		"lava": { sprite: "lava.png", water: true }
	},
	clutter: {
		"bush-small": { size: {x:0.9,y:1}, sprite: "clutter/bush.png" },
		"bush-large": { size: {x:1.8,y:1}, sprite: "clutter/bush.png" },
		"cactus": { size: {x:1.5,y:2}, sprite: "clutter/cactus.png" },
		"plant-tiny": { size: {x:1,y:1}, sprite: "clutter/plant.png" },
		"mushroom1": { size: {x:1,y:1}, sprite: "clutter/mushroom-brown.png" },
		"mushroom2": { size: {x:1,y:1}, sprite: "clutter/mushroom-red.png" },
		"rock": { size: {x:1,y:1}, sprite: "clutter/rock.png" },
		"rock2": { size: {x:1,y:1}, sprite: "clutter/rock2.png" },
		"rock-moss": { size: {x:0.9,y:0.9}, sprite: "clutter/rock-moss.png" },
		"rock-moss2": { size: {x:0.9,y:0.8}, sprite: "clutter/rock-moss2.png" }
	},
	objects: {
		"box": { size: {x:0.8,y:0.8}, sprite: "objects/box.png", collision: "box", mass: 80, floating: true },
		"box2": { size: {x:0.8,y:0.8}, sprite: "objects/box-2.png", collision: "box", mass: 80, floating: true },
		"box3": { size: {x:0.8,y:0.8}, sprite: "objects/box-3.png", collision: "box", mass: 80, floating: true },
		"dirt-rock": { size: {x:0.7,y:0.7}, sprite: "objects/dirt-rock.png", collision: "circle", mass: 100 },
		"stone": { size: {x:0.7,y:0.7}, sprite: "objects/stone.png", collision: "circle", mass: 150 }
	},
	powerups: {
		"random": { size: {x:0.7,y:0.7}, sprite: "powerups/random.png", collision: "box", mass: 10 },
		"weight": { size: {x:0.7,y:0.7}, sprite: "powerups/weight.png", collision: "box", mass: 10 }
	},
	characters: [
		{ size: {x:0.8,y:0.8}, sprite: "characters/red.png", collision: "circle", mass: 50, character: true },
		{ size: {x:0.8,y:0.8}, sprite: "characters/green.png", collision: "circle", mass: 50, character: true },
		{ size: {x:0.8,y:0.8}, sprite: "characters/yellow.png", collision: "circle", mass: 50, character: true },
		{ size: {x:0.8,y:0.8}, sprite: "characters/blue.png", collision: "circle", mass: 50, character: true }
	],
	sounds: {
		"pickup": [ "power-up.ogg" ],
		"bump": [ "bump1.ogg", "bump2.ogg", "bump3.ogg" ]
	},
	levels: [
		{
			name: "Grass",
			background: "sky.png",
			tiles: {
				platform: "grass",
				bridge: "bridge",
				ladder: "ladder",
				rope: "rope",
				water: "water"
			},
			objects: {
				"box": 15,
				"box2": 10,
				"box3": 10,
				"dirt-rock": 5,
				"stone": 5
			},
			clutterProbability: 0.25,
			clutter: {
				"bush-small": 2,
				"bush-large": 2,
				"plant-tiny": 5,
				"rock-moss": 2,
				"rock-moss2": 1,
				"mushroom1": 2,
				"mushroom2": 2
			}
		}
	]
};
