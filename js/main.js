"use strict";

var clock = new THREE.Clock();
TOMATO.cache = new TOMATO.Cache(assets);
TOMATO.game = new TOMATO.Game();

function init() {
	//dumpInfo();

	TOMATO.game.world = new TOMATO.World(assets.levels[0]);

	var pl = TOMATO.game.createPlayer({ controller: "keyboard1" });
	TOMATO.game.createPlayer({ controller: "keyboard2" });
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
