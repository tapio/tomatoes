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
	var start = { x: 6, y: 8 };

	var pl = new TOMATO.Entity();
	pl.controller = new TOMATO.KeyboardController(pl);
	pl.mesh = new THREE.Mesh(new THREE.PlaneGeometry(def.size.x, def.size.y), new THREE.MeshBasicMaterial({ color: 0xaa22aa }));
	pl.body = TOMATO.game.physicsSystem.createBody(def, start.x, start.y);
	TOMATO.game.add(pl);
	TOMATO.game.renderSystem.follow(pl);

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
