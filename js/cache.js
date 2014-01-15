"use strict";

TOMATO.Cache = function() {
	this.materials = {};

	this.getMaterial = function(texture) {
		var t = this.materials[texture];
		if (t) return t;
		this.materials[texture] = t = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture("assets/" + texture),
			transparent: true,
			overdraw: true
		});
		return t;
	};
};
