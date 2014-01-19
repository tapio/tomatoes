"use strict";

TOMATO.Status = function(entity) {
	TOMATO.Component.call(this, entity);
	this.dead = false;
	this.airborne = false;
	this.respawns = 10;
	this.lifeTime = Infinity;
	this.powerUp = null;
	this.deaths = 0;
};
TOMATO.Status.prototype = Object.create(TOMATO.Component.prototype);

TOMATO.Status.prototype.update = function(dt) {
	if (this.dead) return;
	this.lifeTime -= dt;

	var pos = this.entity.getPosition();

	// Check drowning and life time
	if (pos.y < TOMATO.game.world.waterLevel || this.lifeTime <= 0) {
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
	++this.deaths;
	if (!this.respawn()) {
		this.dead = true;
		if (this.entity.controller)
			this.entity.controller.enabled = false;
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

TOMATO.Status.prototype.setPowerUp = function(powerUp) {
	this.powerUp = powerUp;
};
