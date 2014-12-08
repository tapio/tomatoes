"use strict";

TOMATO.SpriteGeometry = function(width, height, tileX, tileY, numHorTiles, numVerTiles) {
	THREE.Geometry.call( this );

	numHorTiles = numHorTiles || 1;
	numVerTiles = numVerTiles || 1;
	tileX = tileX || 0;
	tileY = tileY || 0;

	var hw = width * 0.5;
	var hh = height * 0.5;

	this.vertices.push(new THREE.Vector3(-hw,  hh, 0));
	this.vertices.push(new THREE.Vector3( hw,  hh, 0));
	this.vertices.push(new THREE.Vector3(-hw, -hh, 0));
	this.vertices.push(new THREE.Vector3( hw, -hh, 0));

	var uva = new THREE.Vector2(tileX / numHorTiles, 1.0 - tileY / numVerTiles);
	var uvb = new THREE.Vector2((tileX+1) / numHorTiles, 1.0 - tileY / numVerTiles);
	var uvc = new THREE.Vector2(tileX / numHorTiles, 1.0 - (tileY+1) / numVerTiles);
	var uvd = new THREE.Vector2((tileX+1) / numHorTiles, 1.0 - (tileY+1) / numVerTiles);

	var normal = new THREE.Vector3(0, 0, 1);

	var face = new THREE.Face3(1, 0, 2);
	face.normal.copy(normal);
	face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());
	this.faces.push(face);
	this.faceVertexUvs[0].push([ uvb, uva, uvc ]);

	face = new THREE.Face3(1, 2, 3);
	face.normal.copy(normal);
	face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());
	this.faces.push(face);
	this.faceVertexUvs[0].push([ uvb.clone(), uvc.clone(), uvd ]);
};
TOMATO.SpriteGeometry.prototype = Object.create(THREE.Geometry.prototype);


TOMATO.Visual = function(entity) {
	TOMATO.Component.call(this, entity);
	this.mesh = null;
};
TOMATO.Visual.prototype = Object.create(TOMATO.Component.prototype);


TOMATO.Sprite = function(entity, geometry, material) {
	TOMATO.Visual.call(this, entity);
	this.mesh = new THREE.Mesh(geometry, material);
};
TOMATO.Sprite.prototype = Object.create(TOMATO.Visual.prototype);
