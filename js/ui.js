
TOMATO.initUI = function() {
	var container = document.getElementById('container');
	container.appendChild(TOMATO.game.renderSystem.renderer.domElement);

	TOMATO.renderStats = new Stats();
	TOMATO.renderStats.domElement.style.position = 'absolute';
	TOMATO.renderStats.domElement.style.bottom = '0px';
	container.appendChild(TOMATO.renderStats.domElement);

	if (!CONFIG.showStats) {
		TOMATO.renderStats.domElement.style.display = "none";
	}

	window.addEventListener('resize', TOMATO.onWindowResize);
};

TOMATO.onWindowResize = function() {
	TOMATO.game.onWindowResize();
};
