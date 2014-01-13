"use strict";

var clock = new THREE.Clock();
var cache = new TOMATO.Cache();
TOMATO.game = new TOMATO.Game();

function init() {
	dumpInfo();

	var def = {
		controller: true,
		size: { x: 0.8, y: 0.8 },
		physics: { mass: 50.0 }
	};
	var start = TOMATO.game.world.starts[0];

	var pl = new TOMATO.Entity();
	pl.mesh = new THREE.Mesh(new THREE.PlaneGeometry(def.size.x, def.size.y), new THREE.MeshBasicMaterial({ color: 0xaa22aa }));
	pl.body = TOMATO.game.physicsSystem.createBody(def, start.x, start.y);
	pl.controller = new TOMATO.KeyboardController(pl);
	TOMATO.game.add(pl);
	TOMATO.game.renderSystem.follow(pl);

	start = TOMATO.game.world.starts[1];
	var ai = new TOMATO.Entity();
	ai.mesh = new THREE.Mesh(new THREE.PlaneGeometry(def.size.x, def.size.y), new THREE.MeshBasicMaterial({ color: 0xaa2222 }));
	ai.body = TOMATO.game.physicsSystem.createBody(def, start.x, start.y);
	ai.controller = new TOMATO.AIController(ai);
	TOMATO.game.add(ai);
	TOMATO.game.renderSystem.follow(ai);

	TOMATO.initUI();
}

function main() {
	function render() {
		requestAnimationFrame(render);

		var dt = clock.getDelta();
		if (dt > 0.05) dt = 0.05; // Limit delta to 20 FPS

		TOMATO.game.update(dt);
		TOMATO.game.render(dt);
	}

	init();
	render();
}

main();
