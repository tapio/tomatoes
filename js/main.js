"use strict";

var clock = new THREE.Clock();
var cache = new TOMATO.Cache();
TOMATO.game = new TOMATO.Game();

function init() {
	dumpInfo();

	TOMATO.game.createPlayer({ controller: "keyboard1" });
	TOMATO.game.createPlayer({ controller: "ai" });

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
