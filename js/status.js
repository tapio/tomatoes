"use strict";

TOMATO.Status = function(entity) {
	TOMATO.Component.call(this, entity);
	this.dead = false;
	this.canClimb = false;
	this.airborne = false;
	this.jump = 0;
	this.punchCharge = 0;
	this.respawns = 2;
	this.lifeTime = Infinity;
	this.powerUp = null;
	this.attachedRope = null;
	this.attachedConstraint = null;
	this.deaths = 0;
	this.dir = 0;
};
TOMATO.Status.prototype = Object.create(TOMATO.Component.prototype);

TOMATO.Status.prototype.update = function(dt) {
	if (this.dead) return;
	this.lifeTime -= dt;
	var entity = this.entity;
	var controller = entity.controller;
	var physics = TOMATO.game.physicsSystem;

	var pos = entity.getPosition();

	// Check drowning and life time
	if (pos.y < TOMATO.game.world.waterLevel-1 || this.lifeTime <= 0) {
		this.kill();
		return;
	}

	var body = entity.body;
	if (body && body.tracked) {
		// Update ladder status
		this.canClimb = false;
		var ladders = TOMATO.game.world.ladders;
		for (var i = 0, l = ladders.length; i < l; ++i) {
			if (physics.overlaps(body, ladders[i].body)) {
				this.canClimb = true;
				break;
			}
		}
		// Update airborne status and jumping
		this.airborne = !body.standing && !this.canClimb;
		if (this.airborne) {
			if (controller.jumpInput <= 0)
				this.jump = 0;
			else
				this.jump -= dt;
		} else
			this.jump = 0.400; // Max jump time
		// Update rope status
		if ((!this.airborne || controller.jumpInput < 0.1) && this.attachedRope) {
			physics.world.enableBodyCollision(body, this.attachedRope);
			physics.removeConstraint(this.attachedConstraint);
			this.attachedRope = null;
			this.attachedConstraint = null;
		} else if (controller.jumpInput > 0.1 && !this.attachedRope) {
			var ropes = TOMATO.game.world.ropes;
			for (var i = 0, l = ropes.length; i < l; ++i) {
				var rope = ropes[i].body;
				if (physics.overlaps(body, rope)) {
					physics.world.disableBodyCollision(body, rope);
					this.attachedConstraint = physics.addConstraint(body, rope, { type: "lock" });
					this.attachedRope = rope;
					this.jump = 0;
					break;
				}
			}
		}
	}
	if (body && Math.abs(body.velocity[0]) > 0.1)
		this.dir = Math.sign(body.velocity[0]);
	
	// Punch
	if (controller) {
		if (controller.actionInput > 0.1) {
			this.punchCharge += controller.actionInput * dt;
			if (this.punchCharge > 1) this.punchCharge = 1;
		} else if (this.punchCharge > 0) {
			var x = body.position[0] + 0.6 * this.dir;
			var targetBodies = physics.findBodies(x, body.position[1]);
			if (targetBodies.length) {
				var force = [1e5 * this.punchCharge * this.dir, 1e4 * this.punchCharge];
				for (var i = 0, l = targetBodies.length; i < l; ++i) {
					var targetBody = targetBodies[i];
					targetBody.wakeUp();
					targetBody.applyForce(force, targetBody.position);
				}
			}
			this.punchCharge = 0;
		}
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

TOMATO.Status.prototype.contact = function(other) {
	if (other.powerUp) {
		this.setPowerUp(other.powerUp);
		other.status.kill();
		TOMATO.game.soundSystem.play("pickup");
	}
};