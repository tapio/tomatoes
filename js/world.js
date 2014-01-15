"use strict";

var chars = {
	START: "S",
	GROUND: "#",
	GROUND_LEFT: "(",
	GROUND_RIGHT: ")",
	LADDER: "H",
	LADDER_TOP: "h",
	BRIDGE: "*",
	BOX: "X",
	MUSHROOM1: "m",
	MUSHROOM2: "r",
	BUSH: "b",
	PLANT: "p",
	CACTUS: "c",
	ROCK: "R",
	WATER: "W",
	WATER_TOP: "~"
};

var level = {
	map: [
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"              b S   p  r  m  h          ",
		"           (#################H#)        ",
		"                             H          ",
		"                             H          ",
		"                             H          ",
		"                             H S        ",
		"        h R  X            (######)      ",
		"      (#H#####)                         ",
		"        H                               ",
		"        H                               ",
		"        H                               ",
		"      S H  X     c h                    ",
		"    (########***###H                    ",
		"                   H                    ",
		"                   H   S                ",
		"                  (#######)             ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
		"WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
		"WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
	],
	background: "assets/backgrounds/sky.png",
	tileset: "assets/tiles/",
	clutters: "assets/clutter/",
	objects: "assets/objects/"
};

TOMATO.World = function(game) {
	var gridSize = 1.0;
	var i, j;

	this.width = level.map[0].length * gridSize;
	this.height = level.map.length * gridSize;
	this.waterLevel = 3 * gridSize;
	this.starts = [];

	// Materials
	var bgMaterial = new THREE.MeshBasicMaterial({ map: loadTexture(level.background) });
	var materials = {};
	materials[chars.WATER] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "water.png") });
	materials[chars.WATER_TOP] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "water-top.png") });
	materials[chars.GROUND] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "grass.png") });
	materials[chars.GROUND_LEFT] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "grass-left.png") });
	materials[chars.GROUND_RIGHT] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "grass-right.png") });
	materials[chars.LADDER] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "ladder.png") });
	materials[chars.LADDER_TOP] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "ladder-top.png") });
	materials[chars.BRIDGE] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "bridge.png") });
	materials[chars.BOX] = new THREE.MeshBasicMaterial({ map: loadTexture(level.objects + "box.png") });
	materials[chars.MUSHROOM1] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "mushroom-brown.png") });
	materials[chars.MUSHROOM2] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "mushroom-red.png") });
	materials[chars.BUSH] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "bush.png") });
	materials[chars.PLANT] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "plant.png") });
	materials[chars.CACTUS] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "cactus.png") });
	materials[chars.ROCK] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "rock.png") });
	for (var m in materials) {
		materials[m].transparent = true;
	}

	// Background
	var bg = new TOMATO.Entity(null);
	bg.visual = new TOMATO.Sprite(bg, this.width, this.height, bgMaterial);
	bg.visual.mesh.position.set(this.width / 2, this.height / 2, -100);
	game.add(bg);

	// Blocks
	var blockDef = {
		size: { x: gridSize, y: gridSize },
		physics: { mass: 0 }
	};
	var boxDef = {
		size: { x: 0.9, y: 0.9 },
		physics: { mass: 1 }
	};
	for (j = 0; j < level.map.length; ++j) {
		for (i = 0; i < level.map[j].length; ++i) {
			var char = level.map[j][i];
			var x = i + gridSize * 0.5;
			var y = (level.map.length - j) - gridSize * 0.5;

			if (char == chars.START) {
				this.starts.push(new THREE.Vector2(x, y));
				continue;
			}

			var mat = materials[char];
			if (!mat) continue;

			var entity = new TOMATO.Entity();
			entity.visual = new TOMATO.Sprite(entity, blockDef.size.x, blockDef.size.y, mat);
			entity.visual.mesh.position.set(x, y, 0);
			switch (char) {
				case chars.GROUND:
				case chars.GROUND_LEFT:
				case chars.GROUND_RIGHT:
				case chars.BRIDGE:
					entity.body = game.physicsSystem.createBody(blockDef, x, y);
					entity.id = null;
					break;
				case chars.LADDER:
				case chars.LADDER_TOP:
					entity.visual.mesh.position.z = -1;
					break;
				case chars.MUSHROOM1:
				case chars.MUSHROOM2:
				case chars.BUSH:
				case chars.PLANT:
				case chars.CACTUS:
				case chars.ROCK:
					entity.id = null;
					break;
				case chars.WATER:
				case chars.WATER_TOP:
					entity.visual.mesh.position.z = 100;
					entity.id = null;
					break;
				case chars.BOX:
					entity.body = game.physicsSystem.createBody(boxDef, x, y);
					break;
			}
			game.add(entity);
		}
	}
	game.physicsSystem.createBorders(0, this.height, this.width, 0);
};
