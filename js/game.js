"use strict";

TOMATO.Game = function() {
	this.entities = [];
	this.playerCount = 0;

	this.renderSystem = new TOMATO.RenderSystem();
	this.physicsSystem = new TOMATO.PhysicsSystem();
	this.soundSystem = new TOMATO.SoundSystem();
	this.powerUpSystem = new TOMATO.PowerUpSystem();
	this.world = new TOMATO.World(this);

	//this.physicsSystem.setContactListener(function(a, b) {
		//if (a.entity) console.log(a.entity);
		//if (b.entity) console.log(b.entity);
	//});
};

TOMATO.Game.prototype.add = function(entity) {
	if (entity.id === undefined) throw "Id should be valid or null, not undefined";
	if (entity.id) this.entities.push(entity);
	if (entity.mesh) this.renderSystem.scene.add(entity.mesh);
};

TOMATO.Game.prototype.removeById = function(id) {
	for (var i = 0; i < this.entities.length; ++i) {
		var entity = this.entities[i];
		if (entity.id == id) {
			if (entity.mesh) this.renderSystem.scene.remove(entity.mesh);
			if (entity.body) this.physicsSystem.destroyBody(entity.body);
			this.entities.splice(i, 1);
			return;
		}
	}
};

TOMATO.Game.prototype.findById = function(id) {
	for (var i = 0; i < this.entities.length; ++i) {
		var entity = this.entities[i];
		if (entity.id == id) return entity;
	}
	return null;
};

TOMATO.Game.prototype.remove = function(entity) {
	this.removeById(entity.id);
};

TOMATO.Game.prototype.createPlayer = function(params) {
	var playerMaterials = [
		new THREE.MeshBasicMaterial({ color: 0x22aa22 }),
		new THREE.MeshBasicMaterial({ color: 0xaa2222 }),
		new THREE.MeshBasicMaterial({ color: 0xaaaa22 }),
		new THREE.MeshBasicMaterial({ color: 0xaa2222 })
	];
	var def = {
		controller: !!params.controller,
		size: { x: 0.8, y: 0.8 },
		physics: { mass: 50.0, shape: "circle" }
	};
	var start = this.world.starts[this.playerCount % this.world.starts.length];
	var mat = playerMaterials[this.playerCount % playerMaterials.length];

	var pl = new TOMATO.Entity(params.id);
	pl.mesh = new THREE.Mesh(new THREE.PlaneGeometry(def.size.x, def.size.y), mat);
	pl.body = TOMATO.game.physicsSystem.createBody(def, start.x, start.y);
	pl.body.entity = pl;
	switch (params.controller) {
		case "keyboard1": pl.controller = new TOMATO.KeyboardController(pl); break;
		case "keyboard2": pl.controller = new TOMATO.KeyboardController(pl); break;
		case "gamepad1": pl.controller = new TOMATO.GamepadController(pl); break;
		case "gamepad2": pl.controller = new TOMATO.GamepadController(pl); break;
		case "remote": pl.controller = new TOMATO.RemoteController(pl); break;
		case "ai": pl.controller = new TOMATO.AIController(pl); break;
		default: console.error("Invalid params.controller: " + params.controller); break;
	}
	this.add(pl);
	this.renderSystem.follow(pl);
	this.playerCount++;
	return pl;
};

TOMATO.Game.prototype.spawnPowerUp = function() {

};

TOMATO.Game.prototype.update = function(dt) {
	var i;
	// Update controllers
	for (i = 0; i < this.entities.length; ++i) {
		var controller = this.entities[i].controller;
		if (controller) controller.update(dt);

		var client = this.entities[i].client;
		if (client) client.update(dt);
	}

	// Update systems
	this.powerUpSystem.update(dt);
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
};

TOMATO.Game.prototype.render = function(dt) {
	this.renderSystem.render(dt);
};
