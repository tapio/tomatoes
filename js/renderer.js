"use strict";

TOMATO.RenderSystem = function() {
	this.renderer = new THREE.WebGLRenderer({
		antialias: true,
		preserveDrawingBuffer: true
	});
	this.renderer.setClearColor(0x000000);
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.gammaInput = true;
	this.renderer.gammaOutput = true;
	this.renderer.autoClear = false;

	this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 100);
	this.camera.position.set(10, 10, 10);
	this.onWindowResize();

	this.scene = new THREE.Scene();
	this.trackedEntities = [];
};

TOMATO.RenderSystem.prototype.follow = function(entity) {
	this.trackedEntities.push(entity);
};

TOMATO.RenderSystem.prototype.update = function(dt) {
	if (!this.trackedEntities.length) return;

	var center = new THREE.Vector2(0, 0);
	for (var i = 0; i < this.trackedEntities.length; ++i) {
		var pos = this.trackedEntities[i].getPosition();
		center.x += pos.x;
		center.y += pos.y;
	}
	center.x /= this.trackedEntities.length;
	center.y /= this.trackedEntities.length;
	this.camera.position.set(center.x, center.y, this.camera.position.z);
};

TOMATO.RenderSystem.prototype.render = function(dt) {
	this.renderer.clear();
	this.renderer.render(this.scene, this.camera);
	if (CONFIG.showStats) TOMATO.renderStats.update();
};

TOMATO.RenderSystem.prototype.onWindowResize = function() {
	var aspect = window.innerWidth / window.innerHeight;
	var vertHalfFov = 12;
	var horizHalfFov = vertHalfFov * aspect;
	this.camera.left = -horizHalfFov;
	this.camera.right = horizHalfFov;
	this.camera.top = vertHalfFov;
	this.camera.bottom = -vertHalfFov;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
};
