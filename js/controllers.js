"use strict";

TOMATO.Controller = function(entity) {
	TOMATO.Component.call(this, entity);
	this.moveForce = 1000.0;
	this.jumpForce = 8000.0;
	this.brakeCoeff = -4.0;
	this.moveInput = 0;
	this.jumpInput = 0;
};
TOMATO.Controller.prototype = Object.create(TOMATO.Component.prototype);

TOMATO.Controller.prototype.update = function(dt) {
	if (!this.enabled) return;

	var body = this.entity.body;
	if (body) {
		var steer = this.moveInput * this.moveForce;
		var jump = this.jumpInput * this.jumpForce;
		if (this.entity.status.airborne) {
			if (jump > 0) jump = 0;
			else jump *= 0.5;
			steer *= 0.5;
		}
		body.applyForce([steer, jump], body.position);
		var vec = [this.brakeCoeff * body.velocity[0] * Math.abs(body.velocity[0]), 0];
		body.applyForce(vec, body.position);
	}
};


//
// KeyboardController
//
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
		this.moveInput = 0;
		this.jumpInput = 0;

		// Jump / climb
		if (pressed[this.mapping.up]) this.jumpInput = 1;
		else if (pressed[this.mapping.down]) this.jumpInput = -1;
		// Steering
		if (pressed[this.mapping.left]) this.moveInput = -1;
		else if (pressed[this.mapping.right]) this.moveInput = 1;

		TOMATO.Controller.prototype.update.call(this, dt);
	};
};
TOMATO.KeyboardController.prototype = Object.create(TOMATO.Controller.prototype);
TOMATO.KeyboardController.DefaultMapping1 = { up: 38, down: 40, left: 37, right: 39 } // Arrows
TOMATO.KeyboardController.DefaultMapping2 = { up: 87, down: 83, left: 65, right: 68 } // WASD


//
// GamepadController
//
TOMATO.GamepadController = function(entity, index) {
	TOMATO.Controller.call(this, entity);
	this.index = index;
	navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads || navigator.mozGetGamepads;
};
TOMATO.GamepadController.prototype = Object.create(TOMATO.Controller.prototype);

TOMATO.GamepadController.prototype.update = function(dt) {
	if (!navigator.getGamepads) return;

	var gamepads = navigator.getGamepads();
	if (this.index >= gamepads.length) return;

	var gamepad = gamepads[this.index];
	if (!gamepad) return;

	this.moveInput = gamepad.axes[0];
	this.jumpInput = -gamepad.axes[1];
	if (this.jumpInput < 0.5)
		this.jumpInput = 0;

	TOMATO.Controller.prototype.update.call(this, dt);
}


//
// AIController
//
TOMATO.AIController = function(entity) {
	TOMATO.Controller.call(this, entity);

	this.update = function(dt) {
		this.jumpInput = 0;
		if (Math.random() < 0.01) this.jumpInput = 1;
		if (Math.random() < 0.05) this.moveInput = Math.random() * 2 - 1;

		TOMATO.Controller.prototype.update.call(this, dt);
	};
};
TOMATO.AIController.prototype = Object.create(TOMATO.Controller.prototype);


//
// RemoteController
//
TOMATO.RemoteController = function(entity) {
	TOMATO.Controller.call(this, entity);
};
TOMATO.RemoteController.prototype = Object.create(TOMATO.Controller.prototype);
