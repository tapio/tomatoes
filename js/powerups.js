"use strict";

TOMATO.PowerUpSystem = function() {
	this.minPowerUpTime = 3;
	this.maxPowerUpTime = 15;
	this.powerUpTime = this.minPowerUpTime;
};

TOMATO.PowerUpSystem.prototype.spawnPowerUp = function() {
	var def = assets.powerups["random"];
	var power = TOMATO.game.world.createObject(def,
		THREE.Math.randInt(1, TOMATO.game.world.width - 2),
		THREE.Math.randInt(TOMATO.game.world.waterLevel + 5, TOMATO.game.world.height - 1)
	);
	power.powerUp = def;
	power.status = new TOMATO.Status(power);
	power.status.respawns = 0;
	power.status.lifeTime = 10;
	TOMATO.game.add(power);
};

TOMATO.PowerUpSystem.prototype.update = function(dt) {
	// Spawn power ups
	this.powerUpTime -= dt;
	if (this.powerUpTime <= 0) {
		this.powerUpTime = THREE.Math.randInt(this.minPowerUpTime, this.maxPowerUpTime);
		this.spawnPowerUp();
	}
};
