"use strict";

var clock = new THREE.Clock();
var cache = new TOMATO.Cache();
TOMATO.game = new TOMATO.Game();

function init() {
	dumpInfo();

	var pl = TOMATO.game.createPlayer({ controller: "keyboard1" });
	TOMATO.game.createPlayer({ controller: "ai" });

	pl.client = new TOMATO.Client(pl);

	TOMATO.initUI();
}

function main() {
	function render() {
		requestAnimationFrame(render);

		var dt = clock.getDelta();
		if (dt > 0.05) dt = 0.05; // Limit delta to 20 FPS

		TOMATO.game.update(dt);
		TOMATO.game.render(dt);
		TOMATO.updateUI(dt);
	}

	init();
	render();
}

main();
