"use strict";

TOMATO.Controller = function(entity) {
	TOMATO.Component.call(this, entity);
	this.moveForce = 10.0;
	this.jumpForce = 60.0;
	this.brakeForce = -0.1;
	this.moveInput = 0;
	this.jumpInput = 0;
};
TOMATO.Controller.prototype = Object.create(TOMATO.Component.prototype);

TOMATO.Controller.prototype.update = function(dt) {
	if (!this.enabled) return;

	var body = this.entity.body;
	if (body) {
		var ZERO = new Box2D.b2Vec2(0, 0);
		var steer = this.moveInput * this.moveForce;
		var jump = this.jumpInput * this.jumpForce;
		if (this.entity.status.airborne) {
			if (jump > 0) jump = 0;
			else jump *= 0.5;
			steer *= 0.5;
		}
		var vec = new Box2D.b2Vec2(steer, jump);
		body.ApplyLinearImpulse(vec, ZERO);
		vec = body.GetLinearVelocity();
		vec.set_x(vec.get_x() * this.brakeForce);
		vec.set_y(0);
		body.ApplyLinearImpulse(vec, ZERO);
	}
};


TOMATO.KeyboardController = function(entity, mapping) {
	TOMATO.Controller.call(this, entity);
	this.mapping = mapping;

	var pressed = [];

	function onKeyDown(event) {
		pressed[event.keyCode] = true;
	}

	function onKeyUp(event) {
		pressed[event.keyCode] = false;
	}

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	this.update = function(dt) {
		TOMATO.Controller.prototype.update.call(this, dt);

		this.moveInput = 0;
		this.jumpInput = 0;

		// Jump / climb
		if (pressed[this.mapping.up]) this.jumpInput = 1;
		else if (pressed[this.mapping.down]) this.jumpInput = -1;
		// Steering
		if (pressed[this.mapping.left]) this.moveInput = -1;
		else if (pressed[this.mapping.right]) this.moveInput = 1;
	};
};
TOMATO.KeyboardController.prototype = Object.create(TOMATO.Controller.prototype);
TOMATO.KeyboardController.DefaultMapping1 = { up: 38, down: 40, left: 37, right: 39 } // Arrows
TOMATO.KeyboardController.DefaultMapping2 = { up: 87, down: 83, left: 65, right: 68 } // WASD


TOMATO.GamepadController = function(entity) {
	TOMATO.Controller.call(this, entity);
};
TOMATO.GamepadController.prototype = Object.create(TOMATO.Controller.prototype);


TOMATO.AIController = function(entity) {
	TOMATO.Controller.call(this, entity);

	this.update = function(dt) {
		TOMATO.Controller.prototype.update.call(this, dt);

		this.jumpInput = 0;
		if (Math.random() < 0.01) this.jumpInput = 1;
		if (Math.random() < 0.05) this.moveInput = Math.random() * 2 - 1;
	};
};
TOMATO.AIController.prototype = Object.create(TOMATO.Controller.prototype);


TOMATO.RemoteController = function(entity) {
	TOMATO.Controller.call(this, entity);
};
TOMATO.RemoteController.prototype = Object.create(TOMATO.Controller.prototype);
