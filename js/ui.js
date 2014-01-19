"use strict";

TOMATO.initUI = function() {
	var container = document.getElementById('container');
	container.appendChild(TOMATO.game.renderSystem.renderer.domElement);

	TOMATO.renderStats = new Stats();
	container.appendChild(TOMATO.renderStats.domElement);
};

TOMATO.updateUI = function(dt) {
};
