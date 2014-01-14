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
	CACTUS: "c"
}

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
		"        h    X            (######)      ",
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
		"                                        "
	],
	background: "assets/backgrounds/sky.jpg",
	tileset: "assets/tiles/",
	clutters: "assets/clutter/"
};

TOMATO.World = function(game) {
	var gridSize = 1.0;
	var i, j;

	this.width = level.map[0].length * gridSize;
	this.height = level.map.length * gridSize;
	this.starts = [];

	// Materials
	var bgMaterial = new THREE.MeshBasicMaterial({ map: loadTexture(level.background) });
	var waterMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
	var materials = {};
	materials[chars.GROUND] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "grass-mid.png") });
	materials[chars.GROUND_LEFT] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "grass-left.png") });
	materials[chars.GROUND_RIGHT] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "grass-right.png") });
	materials[chars.LADDER] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "ladder-mid.png") });
	materials[chars.LADDER_TOP] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "ladder-top.png") });
	materials[chars.BRIDGE] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "bridge.png") });
	materials[chars.BOX] = new THREE.MeshBasicMaterial({ map: loadTexture(level.tileset + "box.png") });
	materials[chars.MUSHROOM1] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "mushroom-brown.png") });
	materials[chars.MUSHROOM2] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "mushroom-red.png") });
	materials[chars.BUSH] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "bush.png") });
	materials[chars.PLANT] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "plant.png") });
	materials[chars.CACTUS] = new THREE.MeshBasicMaterial({ map: loadTexture(level.clutters + "cactus.png") });
	for (var m in materials) {
		materials[m].transparent = true;
	}

	// Background
	var bg = new TOMATO.Entity(null);
	var bgGeo = new THREE.PlaneGeometry(this.width, this.height);
	bg.mesh = new THREE.Mesh(bgGeo, bgMaterial);
	bg.mesh.position.set(this.width / 2, this.height / 2, -100);
	game.add(bg);

	// Water
	var water = new TOMATO.Entity();
	var waterGeo = new THREE.PlaneGeometry(1000, 100);
	water.mesh = new THREE.Mesh(waterGeo, waterMaterial);
	//game.add(water);

	// Blocks
	var blockGeo = new THREE.PlaneGeometry(gridSize, gridSize);
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
			var x = i;
			var y = level.map.length - j;

			if (char == chars.START) {
				this.starts.push(new THREE.Vector2(x, y));
				continue;
			}

			var mat = materials[char];
			if (!mat) continue;

			var entity = new TOMATO.Entity();
			entity.mesh = new THREE.Mesh(blockGeo, mat);
			entity.mesh.position.set(x, y, 0);
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
					entity.mesh.position.z = -1;
					break;
				case chars.MUSHROOM1:
				case chars.MUSHROOM2:
				case chars.BUSH:
				case chars.PLANT:
				case chars.CACTUS:
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
