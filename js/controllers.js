"use strict";

TOMATO.Controller = function(entity) {
	TOMATO.Component.call(this, entity);
	this.moveForce = 1000.0;
	this.jumpSpeed = 4.0;
	this.climbSpeed = 3.0;
	this.brakeCoeff = -4.0;
	this.moveInput = 0;
	this.jumpInput = 0;
	this.actionInput = 0;
};
TOMATO.Controller.prototype = Object.create(TOMATO.Component.prototype);

TOMATO.Controller.prototype.update = function(dt) {
	if (!this.enabled) return;

	var body = this.entity.body;
	if (body) {
		if (Math.abs(this.jumpInput) > 0.25 && this.entity.status.canClimb) {
			body.velocity[1] = this.jumpInput * this.climbSpeed;
		}
		else if (this.jumpInput > 0.25 && this.entity.status.jump > 0) {
			body.velocity[1] = this.jumpInput * this.jumpSpeed;
		}
		var steer = this.moveInput * this.moveForce;
		var brake = this.brakeCoeff * body.velocity[0] * Math.abs(body.velocity[0]);
		if (this.entity.status.airborne)
			steer *= 0.5;
		body.applyForce([steer + brake, 0], body.position);
	}
};


//
// KeyboardController
//
TOMATO.KeyboardController = function(entity, mapping) {
	TOMATO.Controller.call(this, entity);
	this.mapping = mapping;

	var pressed = [];

	function onKeyDown(e) {
		pressed[e.keyCode] = true;
		if (pressed[17] || pressed[18]) // CTRL/ALT for browser hotkeys
			return;
		if (e.keyCode >= 112 && e.keyCode <= 123) // F1-F12
			return;
		e.preventDefault();
	}

	function onKeyUp(e) {
		pressed[e.keyCode] = false;
	}

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	this.update = function(dt) {
		this.moveInput = 0;
		this.jumpInput = 0;
		this.actionInput = 0;

		// Jump / climb
		if (pressed[this.mapping.up]) this.jumpInput = 1;
		else if (pressed[this.mapping.down]) this.jumpInput = -1;
		// Steering
		if (pressed[this.mapping.left]) this.moveInput = -1;
		else if (pressed[this.mapping.right]) this.moveInput = 1;
		// Action
		if (pressed[this.mapping.action]) this.actionInput = 1;

		TOMATO.Controller.prototype.update.call(this, dt);
	};
};
TOMATO.KeyboardController.prototype = Object.create(TOMATO.Controller.prototype);
TOMATO.KeyboardController.DefaultMapping1 = { // Arrows + CTRL
	up: 38, down: 40, left: 37, right: 39, action: 17
};
TOMATO.KeyboardController.DefaultMapping2 = { // WASD + Tab
	up: 87, down: 83, left: 65, right: 68, action: 9
};


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
	this.actionInput = gamepad.buttons[0].value;

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
		this.actionInput = Math.random() < 0.01 ? 0 : 1;

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
