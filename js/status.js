"use strict";

TOMATO.Status = function(entity) {
	TOMATO.Component.call(this, entity);
	this.dead = false;
	this.airborne = false;
	this.respawns = 2;
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

	// Update airborne and ladder status
	var body = this.entity.body;
	if (body && body.tracked) {
		this.climbing = false;
		var ladders = TOMATO.game.world.ladders;
		for (var i = 0, l = ladders.length; i < l; ++i) {
			if (TOMATO.game.physicsSystem.overlaps(body, ladders[i].body)) {
				this.climbing = true;
				break;
			}
		}
		this.airborne = !body.standing && !body.climbing;
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
