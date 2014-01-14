"use strict";

TOMATO.CharacterMaterialLib = [
	new THREE.MeshBasicMaterial({ map: loadTexture("assets/characters/red.png"), transparent: true }),
	new THREE.MeshBasicMaterial({ map: loadTexture("assets/characters/green.png"), transparent: true }),
	new THREE.MeshBasicMaterial({ map: loadTexture("assets/characters/yellow.png"), transparent: true }),
	new THREE.MeshBasicMaterial({ map: loadTexture("assets/characters/blue.png"), transparent: true })
];


TOMATO.Visual = function(entity) {
	TOMATO.Component.call(this, entity);
	this.mesh = null;
};
TOMATO.Visual.prototype = Object.create(TOMATO.Component.prototype);


TOMATO.Sprite = function(entity, mesh) {
	TOMATO.Visual.call(this, entity);
	this.mesh = mesh;

};
TOMATO.Visual.prototype = Object.create(TOMATO.Visual.prototype);
