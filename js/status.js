"use strict";

TOMATO.Status = function(entity) {
	TOMATO.Component.call(this, entity);
	this.dead = false;
	this.airborne = false;
	this.respawns = Infinity;
};
TOMATO.Status.prototype = Object.create(TOMATO.Component.prototype);

TOMATO.Status.prototype.update = function(dt) {
	if (this.dead) return;

	var pos = this.entity.getPosition();

	// Check drowning
	if (pos.y < TOMATO.game.world.waterLevel) {
		this.kill();
		return;
	}

	// Check airborne status
	if (this.entity.controller) {
		// TODO: Proper height offset
		this.airborne = !TOMATO.game.physicsSystem.rayCast(pos.x, pos.y, pos.x, pos.y - 0.6);
	}
};

TOMATO.Status.prototype.kill = function() {
	if (!this.respawn()) {
		this.dead = true;
		if (this.entity.controller)
			this.entity.controller.enabled = false;
		console.log("Player " + this.entity.id + " died");
	}
};

TOMATO.Status.prototype.respawn = function() {
	if (this.respawns > 0) {
		--this.respawns;
		var starts = TOMATO.game.world.starts;
		var start = starts[(Math.random() * starts.length)|0];
		this.entity.setPosition(start.x, start.y);
		return true;
	}
	return false;
};
