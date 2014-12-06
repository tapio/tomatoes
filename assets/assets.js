var assets = {
	blocks: {
		"grass": { sprite: "grass.png", collision: "box", platform: true },
		"dirt": { sprite: "dirt.png", collision: "box", platform: true },
		"castle": { sprite: "castle.png", collision: "box", platform: true },
		"sand": { sprite: "sand.png", collision: "box", platform: true },
		"snow": { sprite: "snow.png", collision: "box", platform: true },
		"stone": { sprite: "stone.png", collision: "box", platform: true },
		"ladder": { sprite: "ladder.png", ladder: true },
		"water": { sprite: "water.png", water: true },
		"water-frozen": { sprite: "water-frozen.png", water: true },
		"lava": { sprite: "lava.png", water: true }
	},
	interactives: {
		"bridge": { size: [1, 0.34], sprite: "tiles/bridge.png", collision: "box", mass: 50 },	
		"rope": { size: [0.12, 0.35], sprite: "tiles/rope.png", collision: "circle", mass: 1, rope: true },
	},
	clutter: {
		"bush-small": { size: [0.9, 1], sprite: "clutter/bush.png" },
		"bush-large": { size: [1.8, 1], sprite: "clutter/bush.png" },
		"cactus": { size: [1.5, 2], sprite: "clutter/cactus.png" },
		"plant-tiny": { size: [1, 1], sprite: "clutter/plant.png" },
		"plant-ice": { size: [1, 1], sprite: "clutter/plant-ice.png" },
		"tree-ice": { size: [1, 1], sprite: "clutter/tree-ice.png" },
		"tree": { size: [1, 1], sprite: "clutter/pine.png" },
		"tree2": { size: [1, 1], sprite: "clutter/pine2.png" },
		"mushroom1": { size: [1, 1], sprite: "clutter/mushroom-brown.png" },
		"mushroom2": { size: [1, 1], sprite: "clutter/mushroom-red.png" },
		"mushroom3": { size: [1, 1], sprite: "clutter/mushroom-tan.png" },
		"rock": { size: [1, 1], sprite: "clutter/rock.png" },
		"rock-snow": { size: [1, 1], sprite: "clutter/rock-snow.png" },
		"rock-snow2": { size: [1, 1], sprite: "clutter/rock-snow2.png" },
		"rock-moss": { size: [0.9, 0.9], sprite: "clutter/rock-moss.png" },
		"rock-moss2": { size: [0.9, 0.8], sprite: "clutter/rock-moss2.png" },
		"snow-pile": { size: [1, 1], sprite: "clutter/snow-pile.png" },
		"snow-pile2": { size: [1, 1], sprite: "clutter/snow-pile2.png" }
	},
	objects: {
		"box": { size: [0.8, 0.8], sprite: "objects/box.png", collision: "box", mass: 80, floating: true },
		"box2": { size: [0.8, 0.8], sprite: "objects/box-2.png", collision: "box", mass: 80, floating: true },
		"box3": { size: [0.8, 0.8], sprite: "objects/box-3.png", collision: "box", mass: 80, floating: true },
		"dirt-rock": { size: [0.7, 0.7], sprite: "objects/dirt-rock.png", collision: "circle", mass: 100 },
		"stone": { size: [0.7, 0.7], sprite: "objects/stone.png", collision: "circle", mass: 150 },
		"snowball": { size: [0.5, 0.5], sprite: "objects/snowball.png", collision: "circle", mass: 50, floating: true },
		"snowball-big": { size: [0.7, 0.7], sprite: "objects/snowball.png", collision: "circle", mass: 150, floating: true }
	},
	powerups: {
		"random": { size: [0.7, 0.7], sprite: "powerups/random.png", collision: "box", mass: 10 },
		"weight": { size: [0.7, 0.7], sprite: "powerups/weight.png", collision: "box", mass: 10 }
	},
	characters: [
		{ size: [0.8, 0.8], sprite: "characters/red.png", collision: "circle", mass: 50, character: true },
		{ size: [0.8, 0.8], sprite: "characters/green.png", collision: "circle", mass: 50, character: true },
		{ size: [0.8, 0.8], sprite: "characters/yellow.png", collision: "circle", mass: 50, character: true },
		{ size: [0.8, 0.8], sprite: "characters/blue.png", collision: "circle", mass: 50, character: true }
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
				"mushroom2": 2,
				"mushroom3": 1
			}
		},{
			name: "Winter",
			background: "sky.png",
			tiles: {
				platform: "snow",
				bridge: "bridge",
				ladder: "ladder",
				rope: "rope",
				water: "water-frozen"
			},
			objects: {
				"box": 5,
				"box2": 5,
				"box3": 5,
				"snowball": 25,
				"snowball-big": 10,
				"stone": 5
			},
			clutterProbability: 0.25,
			clutter: {
				"rock": 2,
				"rock-snow": 1,
				"rock-snow2": 1,
				"snow-pile": 2,
				"snow-pile2": 2,
				"tree-ice": 2,
				"plant-ice": 5
			}
		},{
			name: "Desert",
			background: "sky.png",
			tiles: {
				platform: "sand",
				bridge: "bridge",
				ladder: "ladder",
				rope: "rope",
				water: "lava"
			},
			objects: {
				"box": 10,
				"box2": 5,
				"box3": 5,
				"dirt-rock": 10,
				"stone": 5
			},
			clutterProbability: 0.2,
			clutter: {
				"rock": 2,
				"cactus": 4
			}
		}
	]
};
