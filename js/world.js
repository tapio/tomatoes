"use strict";

TOMATO.World = function(level) {
	this.gridSize = 1.0;
	var i;

	this.width = 16 * 3 * this.gridSize;
	this.height = 9 * 3 * this.gridSize;
	this.waterLevel = 3 * this.gridSize;
	this.starts = [
		new THREE.Vector2(this.width * 0.333, this.height * 0.8),
		new THREE.Vector2(this.width * 0.667, this.height * 0.8)
	];

	// Background
	var bg = new TOMATO.Entity(null);
	var bgMaterial = new THREE.MeshBasicMaterial({ map: loadTexture("assets/backgrounds/" + level.background), overdraw: true });
	bg.visual = new TOMATO.Sprite(bg, new TOMATO.SpriteGeometry(this.width, this.height), bgMaterial);
	bg.visual.mesh.position.set(this.width / 2, this.height / 2, -100);
	TOMATO.game.add(bg);

	// Platforms
	TOMATO.game.add(this.createPlatform(assets.blocks[level.tiles.platform], 5, this.waterLevel + 5, this.width - 10));

	// Objects
	TOMATO.game.add(this.createObject(assets.objects.box, this.width / 2, this.height / 2));

	// Water
	for (i = 0; i < this.waterLevel / this.gridSize; ++i) {
		TOMATO.game.add(this.createPlatform(assets.blocks[level.tiles.water], 0, i, this.width));
	}

	// World borders
	TOMATO.game.physicsSystem.createBorders(0, this.height, this.width, 0);
};


TOMATO.World.prototype.createPlatform = function(def, x, y, width) {
	width = width | 0;
	if (width < 2) throw("Too narrow platform");
	var entity = new TOMATO.Entity(null);
	var geo = new THREE.Geometry();
	var tempMesh = new THREE.Mesh();
	for (var i = 0; i < width; ++i) {
		var tile = 1;
		if (i == 0) tile = 0;
		else if (i == width-1) tile = 2;
		var tempGeo = new TOMATO.SpriteGeometry(this.gridSize, this.gridSize, tile, 0, 3, 1);
		tempMesh.geometry = tempGeo;
		tempMesh.position.x = i * this.gridSize + this.gridSize / 2 - width / 2;
		THREE.GeometryUtils.merge(geo, tempMesh);
	}
	var mat = new THREE.MeshBasicMaterial({
		map: loadTexture("assets/tiles/" + def.sprite),
		transparent: true, overdraw: true
	});
	entity.visual = new TOMATO.Sprite(entity, geo, mat);
	entity.visual.mesh.position.set(x + width/2, y, 0);
	entity.body = TOMATO.game.physicsSystem.createBody({
		size: { x: this.gridSize * width, y: this.gridSize },
		collision: def.collision,
		mass: def.mass
	}, x + width/2, y);
	return entity;
};

TOMATO.World.prototype.createObject = function(def, x, y) {
	var entity = new TOMATO.Entity();
	if (!def.mass) entity.id = null;
	if (def.sprite) {
		var mat = new THREE.MeshBasicMaterial({
			map: loadTexture("assets/" + def.sprite),
			transparent: true, overdraw: true
		});
		var geo = new TOMATO.SpriteGeometry(def.size.x, def.size.y);
		geo.dynamic = false;
		entity.visual = new TOMATO.Sprite(entity, geo, mat);
		entity.visual.mesh.position.set(x, y, 0);
	}
	if (def.collision)
		entity.body = TOMATO.game.physicsSystem.createBody(def, x, y);
	return entity;
};
