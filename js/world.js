"use strict";

var chars = {
	GROUND: "#",
	GROUND_LEFT: "(",
	GROUND_RIGHT: ")",
	LADDER: "H",
	LADDER_TOP: "h",
	BRIDGE: "*",
	BARREL: "U",
	BOX:    "X"
}

var level = {
	map: [
		"                                        ",
		"                                        ",
		"                             h          ",
		"           (#################H#)        ",
		"                             H          ",
		"                             H          ",
		"                             H          ",
		"                             H          ",
		"        h  U              (######)      ",
		"      (#H#####)                         ",
		"        H                               ",
		"        H                               ",
		"        H                               ",
		"        H   X      h                    ",
		"    (########***###H                    ",
		"                   H                    ",
		"                   H                    ",
		"                  (#######)             ",
		"                                        ",
		"                                        "
	],
	background: "assets/backgrounds/sky.jpg",
	tileset: "assets/tiles/"
};

TOMATO.World = function(game) {
	var gridSize = 1.0;
	var i, j;

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
	for (var m in materials) {
		materials[m].transparent = true;
	}

	// Background
	var bg = new TOMATO.Entity();
	var bgGeo = new THREE.PlaneGeometry(200, 200);
	bg.mesh = new THREE.Mesh(bgGeo, bgMaterial);
	bg.mesh.position.z = -1;
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
			var mat = materials[char];
			if (!mat) continue;

			var x = i;
			var y = level.map.length - j;
			var entity = new TOMATO.Entity();
			entity.mesh = new THREE.Mesh(blockGeo, mat);
			entity.mesh.position.set(x, y, 0);
			switch (char) {
				case chars.GROUND:
				case chars.GROUND_LEFT:
				case chars.GROUND_RIGHT:
				case chars.BRIDGE:
					entity.body = game.physicsSystem.createBody(blockDef, x, y);
					break;
				case chars.BOX:
					entity.body = game.physicsSystem.createBody(boxDef, x, y);
					break;
			}
			game.add(entity);
		}
	}
};
