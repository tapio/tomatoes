"use strict";

TOMATO.Game = function() {
	this.entities = [];
	this.powerUpTime = 3;

	this.renderSystem = new TOMATO.RenderSystem();
	this.physicsSystem = new TOMATO.PhysicsSystem();
	this.soundSystem = new TOMATO.SoundSystem();
	this.world = new TOMATO.World(this);
};

TOMATO.Game.prototype.add = function(entity) {
	this.entities.push(entity);
	this.renderSystem.scene.add(entity.mesh);
};

TOMATO.Game.prototype.spawnPowerUp = function() {

};

TOMATO.Game.prototype.update = function(dt) {
	var i;
	// Update controllers
	for (i = 0; i < this.entities.length; ++i) {
		var controller = this.entities[i].controller;
		if (controller)
			controller.update(dt);
	}

	// Update systems
	this.physicsSystem.update(dt);
	this.renderSystem.update(dt);

	// Sync render and physics
	for (i = 0; i < this.entities.length; ++i) {
		var body = this.entities[i].body;
		var mesh = this.entities[i].mesh;
		if (body && mesh) {
			var pos = body.GetPosition();
			var rot = body.GetAngle();
			mesh.position.x = pos.get_x();
			mesh.position.y = pos.get_y();
			mesh.rotation.z = rot;
		}
	}

	// Spawn power ups
	this.powerUpTime -= dt;
	if (this.powerUpTime <= 0) {
		this.powerUpTime = 10;
		this.spawnPowerUp();
	}
};

TOMATO.Game.prototype.render = function(dt) {
	this.renderSystem.render(dt);
};

TOMATO.Game.prototype.onWindowResize = function() {
	this.renderSystem.onWindowResize();
}
