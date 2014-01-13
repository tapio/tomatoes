"use strict";

TOMATO.RenderSystem = function() {
	var aspect = window.innerWidth / window.innerHeight;
	var vertHalfFov = 20;
	var horizHalfFov = vertHalfFov * aspect;

	//camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 150);
	this.camera = new THREE.OrthographicCamera(-horizHalfFov, horizHalfFov, vertHalfFov, -vertHalfFov, 0.1, 150);
	this.camera.position.set(0, 0, 50);

	this.renderer = new THREE.WebGLRenderer({
		antialias: true,
		preserveDrawingBuffer: true
	});
	this.renderer.setClearColor(0x000000);
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.shadowMapDebug = false;
	this.renderer.gammaInput = true;
	this.renderer.gammaOutput = true;
	this.renderer.autoClear = false;

	this.scene = new THREE.Scene();
};

TOMATO.RenderSystem.prototype.render = function(dt) {
	this.renderer.clear();
	this.renderer.render(this.scene, this.camera);
	if (CONFIG.showStats) TOMATO.renderStats.update();
};

TOMATO.RenderSystem.prototype.onWindowResize = function() {
	var scale = 1.0;
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize(window.innerWidth * scale, window.innerHeight * scale);
};
