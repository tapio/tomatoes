"use strict";

TOMATO.Status = function(entity) {
	this.entity = entity;
	this.dead = false;
	this.airborne = false;
};

TOMATO.Status.prototype.update = function(dt) {
	if (this.dead) return;

	var pos = this.entity.getPosition();

	if (pos.y < TOMATO.game.world.waterLevel) {
		this.dead = true;
		if (this.entity.controller)
			this.entity.controller.enabled = false;
		console.log("Player " + this.entity.id + " died");
		return;
	}
};
