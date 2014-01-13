"use strict";
// Component-Entity-System

TOMATO.Component = function() {

};

TOMATO.Component.update = function(dt) { };


TOMATO.Entity = function() {
	this.mesh = null;
	this.body = null;
	this.controller = null;
};

TOMATO.Entity.prototype.setPosition = function(x, y) {
	if (this.body) this.body.SetPosition(x, y);
	else if (this.mesh) return this.mesh.position.set(x, y, 0);
};

TOMATO.Entity.prototype.getPosition = function() {
	if (this.body) return this.body.GetPosition();
	else if (this.mesh) return this.mesh.position;
	else return null;
};

TOMATO.Entity.prototype.setRotation = function(rot) {
	if (this.body) return this.body.GetPosition();
	else if (this.mesh) return this.mesh.position;
};

TOMATO.Entity.prototype.getRotation = function() {
	if (this.body) return this.body.GetAngle();
	else if (this.mesh) return this.mesh.rotation.z;
	else return 0;
};


TOMATO.System = function() {

};
