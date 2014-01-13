"use strict";

var chars = {
	GROUND: "#",
	LADDER: "H",
	BRIDGE: "*",
	BARREL: "U",
	BOX:    "X"
}

var level = {
	map: [
		"                                        ",
		"                                        ",
		"                                        ",
		"           ##################H##        ",
		"                             H          ",
		"                             H          ",
		"                             H          ",
		"                             H          ",
		"           U              ########      ",
		"      ##H######                         ",
		"        H                               ",
		"        H                               ",
		"        H                               ",
		"        H   X                           ",
		"     ########***###H                    ",
		"                   H                    ",
		"                   H                    ",
		"                   #######              ",
		"                                        ",
		"                                        "
	],
	background: "assets/backgrounds/sky.jpg"
};

TOMATO.World = function(game) {
	var gridSize = 1.0;

	// Materials
	var bgMaterial = new THREE.MeshBasicMaterial({ map: loadTexture(level.background) });
	var waterMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
	var blockMaterials = {};
	blockMaterials[chars.GROUND] = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	blockMaterials[chars.LADDER] = new THREE.MeshBasicMaterial({ color: 0xcc8800 });
	blockMaterials[chars.BRIDGE] = new THREE.MeshBasicMaterial({ color: 0xff6600 });

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
		size: { x: 1, y: 1 },
		physics: {
			mass: 0
		}
	};
	for (var j = 0; j < level.map.length; ++j) {
		for (var i = 0; i < level.map[j].length; ++i) {
			var char = level.map[j][i];
			var mesh = null;
			var body = null;
			switch (char) {
				case chars.GROUND:
				case chars.LADDER:
				case chars.BRIDGE:
					mesh = new THREE.Mesh(blockGeo, blockMaterials[char]);
					body = game.physicsSystem.createBody(blockDef, i, level.map.length - j);
					break;
				case chars.BARREL:

					break;
				case chars.BOX:

					break;
			}
			if (mesh) {
				var block = new TOMATO.Entity();
				block.body = body;
				block.mesh = mesh;
				game.add(block);
			}
		}
	}
};
