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

	this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 202);
	this.camera.position.set(0, 0, 101);
	this.refreshCamera = true;
	this.onWindowResize();

	this.scene = new THREE.Scene();
	this.trackedEntities = [];
};

TOMATO.RenderSystem.prototype.follow = function(entity) {
	this.trackedEntities.push(entity);
};

TOMATO.RenderSystem.prototype.update = function(dt) {
	if (!this.trackedEntities.length) return;

	var xmargin = 10.0;
	var ymargin = 4.0;
	var w = TOMATO.game.world.width;
	var h = TOMATO.game.world.height;
	var x1 = w, y1 = h, x2 = 0, y2 = 0;
	var ar = window.innerWidth / window.innerHeight;

	// Calculate viewport borders
	for (var i = 0; i < this.trackedEntities.length; ++i) {
		var pos = this.trackedEntities[i].getPosition();
		if (pos.x < x1) x1 = pos.x;
		if (pos.x > x2) x2 = pos.x;
		if (pos.y < y1) y1 = pos.y;
		if (pos.y > y2) y2 = pos.y;
	}
	// Add margins and clamp box to world
	x1 -= xmargin; x2 += xmargin;
	y1 -= ymargin; y2 += ymargin;
	if (x2 - x1 >= w) { x1 = 0; x2 = w; }
	if (y2 - y1 >= h) { y1 = 0; y2 = h; }
	// Correct aspect ratio
	var boxw = x2 - x1, boxh = y2 - y1;
	if (boxh > boxw / ar) boxw = boxh * ar;
	else boxh = boxw / ar;
	var midx = (x1 + x2) * 0.5;
	var midy = (y1 + y2) * 0.5;
	x1 = midx - boxw * 0.5;
	x2 = midx + boxw * 0.5;
	y1 = midy - boxh * 0.5;
	y2 = midy + boxh * 0.5;
	// Move back inside screen
	var xcorr = 0, ycorr = 0;
	if (x1 < 0) xcorr = -x1;
	if (x2 > w) xcorr = w-x2;
	if (y1 < 0) ycorr = -y1;
	if (y2 > h) ycorr = h-y2;
	x1 += xcorr; x2 += xcorr;
	y1 += ycorr; y2 += ycorr;
	// Interplate smoothly to the new viewport
	var interp = this.refreshCamera ? 1.0 : 0.05;
	this.camera.left = lerp(this.camera.left, x1, interp);
	this.camera.bottom = lerp(this.camera.bottom, y1, interp);
	this.camera.right = lerp(this.camera.right, x2, interp);
	this.camera.top = lerp(this.camera.top, y2, interp);
	this.camera.updateProjectionMatrix();
	this.refreshCamera = false;
};

TOMATO.RenderSystem.prototype.render = function(dt) {
	this.renderer.clear();
	this.renderer.render(this.scene, this.camera);
	if (CONFIG.showStats) TOMATO.renderStats.update();
};

TOMATO.RenderSystem.prototype.onWindowResize = function() {
	this.refreshCamera = true;
	this.renderer.setSize(window.innerWidth, window.innerHeight);
};
