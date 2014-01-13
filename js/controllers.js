"use strict";

TOMATO.Controller = function(entity) {
	this.entity = entity;
	this.enabled = true;
	this.moveForce = 10.0;
	this.jumpForce = 12.0;
	this.brakeForce = -0.1;
	this.moveInput = 0;
	this.jumpInput = 0;
};

TOMATO.Controller.prototype.update = function(dt) {
	if (!this.enabled) return;

	var body = this.entity.body;
	if (body) {
		var ZERO = new Box2D.b2Vec2(0, 0);
		var vec = new Box2D.b2Vec2(this.moveInput * this.moveForce, this.jumpInput * this.jumpForce);
		body.ApplyLinearImpulse(vec, ZERO);
		vec = body.GetLinearVelocity();
		vec.set_x(vec.get_x() * this.brakeForce);
		vec.set_y(vec.get_y() * this.brakeForce);
		body.ApplyLinearImpulse(vec, ZERO);
	}
};


TOMATO.KeyboardController = function(entity) {
	TOMATO.Controller.call(this, entity);

	var pressed = [];

	function onKeyDown(event) {
		var key = event.keyCode;
		pressed[key] = true;
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
		if (pressed[87] || pressed[38]) { // W || Up
			this.jumpInput = 1;
		} else if (pressed[83] || pressed[40]) { // S || Down
			this.jumpInput = -1;
		}
		// Steering
		if (pressed[65] || pressed[37]) { // A || Left
			this.moveInput = -1;
		} else if (pressed[68] || pressed[39]) { // D || Right
			this.moveInput = 1;
		}
	};
};

TOMATO.KeyboardController.prototype = Object.create(TOMATO.Controller.prototype);


TOMATO.GamepadController = function() {
	TOMATO.Controller.call(this);
};

TOMATO.GamepadController.prototype = Object.create(TOMATO.Controller.prototype);


TOMATO.AIController = function() {
	TOMATO.Controller.call(this);
};

TOMATO.AIController.prototype = Object.create(TOMATO.Controller.prototype);


TOMATO.RemoteController = function() {
	TOMATO.Controller.call(this);
};

TOMATO.RemoteController.prototype = Object.create(TOMATO.Controller.prototype);
