"use strict";

TOMATO.Game = function() {
	this.entities = [];
	this.playerCount = 0;

	this.renderSystem = new TOMATO.RenderSystem();
	this.physicsSystem = new TOMATO.PhysicsSystem();
	this.soundSystem = new TOMATO.SoundSystem();
	this.powerUpSystem = new TOMATO.PowerUpSystem();
	this.rulesSystem = new TOMATO.RulesSystem();
	this.world = null;
	this.running = true;

	this.physicsSystem.setContactListener(function(a, b) {
		var aa = a.entity, bb = b.entity;
		if (!aa || !bb) return;
		if (aa && aa.status) aa.status.contact(bb);
		if (bb && bb.status) bb.status.contact(aa);
		if (aa.status || bb.status)
			TOMATO.game.soundSystem.play("bump");
	});
};

TOMATO.Game.prototype.add = function(entity) {
	if (entity.id === undefined) throw "Id should be valid or null, not undefined";
	if (entity.id) this.entities.push(entity);
	if (entity.visual) this.renderSystem.scene.add(entity.visual.mesh);
};

TOMATO.Game.prototype.removeById = function(id) {
	for (var i = 0; i < this.entities.length; ++i) {
		var entity = this.entities[i];
		if (entity.id == id) {
			if (entity.visual) this.renderSystem.scene.remove(entity.visual.mesh);
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
	var start = this.world.starts[this.playerCount % this.world.starts.length];
	var def = assets.characters[this.playerCount % assets.characters.length];
	var pl = this.world.createObject(def, start.x, start.y);
	if (params.id !== undefined) pl.id = params.id;
	pl.status = new TOMATO.Status(pl);
	switch (params.controller) {
		case "keyboard1": pl.controller = new TOMATO.KeyboardController(pl, TOMATO.KeyboardController.DefaultMapping1); break;
		case "keyboard2": pl.controller = new TOMATO.KeyboardController(pl, TOMATO.KeyboardController.DefaultMapping2); break;
		case "gamepad1": pl.controller = new TOMATO.GamepadController(pl, 0); break;
		case "gamepad2": pl.controller = new TOMATO.GamepadController(pl, 1); break;
		case "remote": pl.controller = new TOMATO.RemoteController(pl); break;
		case "ai": pl.controller = new TOMATO.AIController(pl); break;
		default: console.error("Invalid params.controller: " + params.controller); break;
	}
	this.add(pl);
	this.rulesSystem.add(pl);
	this.renderSystem.follow(pl);
	this.playerCount++;
	return pl;
};

TOMATO.Game.prototype.update = function(dt) {
	if (!this.running) return;
	var i, c;
	// Update components
	for (i = 0; i < this.entities.length; ++i) {
		var entity = this.entities[i];
		if (entity.status) entity.status.update(dt);
		if (entity.controller) entity.controller.update(dt);
		if (entity.client) entity.client.update(dt);
		if (entity.visual) entity.visual.update(dt);
		//for (c in entity) {
		//	var component = entity[c];
		//	if (component instanceof TOMATO.Component)
		//		component.update(dt);
		//}
	}

	// Update systems
	this.powerUpSystem.update(dt);
	this.physicsSystem.update(dt);
	this.rulesSystem.update(dt);
	this.renderSystem.update(dt);

	// Sync render and physics
	for (i = 0; i < this.entities.length; ++i) {
		var body = this.entities[i].body;
		var visual = this.entities[i].visual;
		if (body && visual) {
			var meshPos = visual.mesh.position;
			meshPos.x = body.position[0];
			meshPos.y = body.position[1];
			visual.mesh.rotation.z = body.angle;
		}
	}

	// Remove dead
	for (i = this.entities.length-1; i >= 0; --i) {
		var entity = this.entities[i];
		if (entity && entity.status && entity.status.dead) {
			this.remove(entity);
		}
	}
};

TOMATO.Game.prototype.render = function(dt) {
	this.renderSystem.render(dt);
};
