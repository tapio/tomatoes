"use strict";
// Component-Entity-System

TOMATO.Component = function(owner) {
	this.entity = owner;
	this.enabled = true;
};

TOMATO.Component.prototype.update = function(dt) { };
TOMATO.Component.prototype.frameEnd = function(dt) { };


TOMATO.Entity = function(id) {
	this.id = (id !== undefined) ? id : Math.floor(Math.random()*100000000).toString(36);
	this.visual = null;
	this.body = null;
	this.controller = null;
	this.status = null;
	this.client = null;
};

TOMATO.Entity.prototype.setTransform = function(x, y, rot) {
	if (this.body) {
		this.body.position[0] = x;
		this.body.position[1] = y;
		this.body.angle = rot;
	}
	else if (this.visual) {
		this.visual.mesh.position.x = x;
		this.visual.mesh.position.y = y;
		this.visual.mesh.rotation.z = rot;
	}
};

TOMATO.Entity.prototype.setPosition = function(x, y) {
	if (this.body) {
		this.body.position[0] = x;
		this.body.position[1] = y;
	} else if (this.visual) {
		this.visual.mesh.position.x = x;
		this.visual.mesh.position.y = y;
	}
};

TOMATO.Entity.prototype.getPosition = function() {
	if (this.body)
		return new THREE.Vector2(this.body.position[0], this.body.position[1]);
	else if (this.visual)
		return new THREE.Vector2(this.visual.mesh.position.x, this.visual.mesh.position.y);
	else return null;
};

TOMATO.Entity.prototype.setRotation = function(rot) {
	if (this.body) this.body.angle = rot;
	else if (this.visual) this.visual.mesh.rotation.z = rot;
};

TOMATO.Entity.prototype.getRotation = function() {
	if (this.body) return this.body.angle;
	else if (this.visual) return this.visual.mesh.rotation.z;
	else return 0;
};

TOMATO.Entity.prototype.setVelocity = function(x, y) {
	if (this.body) {
		this.body.velocity[0] = x;
		this.body.velocity[1] = y;
	}
};

TOMATO.Entity.prototype.getVelocity = function() {
	if (this.body)
		return new THREE.Vector2(this.body.velocity[0], this.body.velocity[1]);
	else return new THREE.Vector2(0, 0);
};


TOMATO.System = function() {

};
