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
};

TOMATO.Entity.prototype.setTransform = function(x, y, rot) {
	if (this.body) this.body.SetTransform(new Box2D.b2Vec2(x, y), rot);
	else if (this.visual) {
		this.visual.mesh.position.x = x;
		this.visual.mesh.position.y = y;
		this.visual.mesh.rotation.z = rot;
	}
};

TOMATO.Entity.prototype.setPosition = function(x, y) {
	if (this.body) {
		this.body.SetTransform(new Box2D.b2Vec2(x, y), this.body.GetAngle());
	} else if (this.visual) {
		this.visual.mesh.position.x = x;
		this.visual.mesh.position.y = y;
	}
};

TOMATO.Entity.prototype.getPosition = function() {
	if (this.body)
		return new THREE.Vector2(this.body.GetPosition().get_x(), this.body.GetPosition().get_y());
	else if (this.visual)
		return new THREE.Vector2(this.visual.mesh.position.x, this.visual.mesh.position.y);
	else return null;
};

TOMATO.Entity.prototype.setRotation = function(rot) {
	if (this.body) this.body.SetTransform(this.body.GetPosition(), rot);
	else if (this.visual) this.visual.mesh.rotation.z = rot;
};

TOMATO.Entity.prototype.getRotation = function() {
	if (this.body) return this.body.GetAngle();
	else if (this.visual) return this.visual.mesh.rotation.z;
	else return 0;
};

TOMATO.Entity.prototype.setVelocity = function(x, y) {
	if (this.body) this.body.SetLinearVelocity(new Box2D.b2Vec2(x, y));
};

TOMATO.Entity.prototype.getVelocity = function() {
	if (this.body)
		return new THREE.Vector2(this.body.GetLinearVelocity().get_x(), this.body.GetLinearVelocity().get_y());
	else return new THREE.Vector2(0, 0);
};


TOMATO.System = function() {

};
