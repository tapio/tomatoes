"use strict";

var clock = new THREE.Clock();
TOMATO.cache = new TOMATO.Cache();
TOMATO.game = new TOMATO.Game();

function init() {
	//dumpInfo();

	// Currently needed for Firefox
	window.addEventListener("gamepadconnected", function(gamepad) {
		console.log("Gamepad connected:", gamepad);
	});

	var env = 0;
	if (window.location.search.contains("snow")) env = 1;
	else if (window.location.search.contains("desert")) env = 2;
	
	TOMATO.game.world = new TOMATO.World(assets.levels[env]);

	var pl = TOMATO.game.createPlayer({ controller: "keyboard1" });
	TOMATO.game.createPlayer({ controller: "keyboard2" });
	TOMATO.game.createPlayer({ controller: "gamepad1" });
	TOMATO.game.createPlayer({ controller: "ai" });

	if (window.location.hash.contains("connect"))
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
