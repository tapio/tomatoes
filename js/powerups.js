"use strict";

TOMATO.PowerUpSystem = function() {
	this.powerUpTime = 3;
};

TOMATO.PowerUpSystem.prototype.spawnPowerUp = function() {

};

TOMATO.PowerUpSystem.prototype.update = function(dt) {
	// Spawn power ups
	this.powerUpTime -= dt;
	if (this.powerUpTime <= 0) {
		this.powerUpTime = 10;
		this.spawnPowerUp();
	}
};
