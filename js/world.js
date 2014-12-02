"use strict";

TOMATO.World = function(level) {
	this.blockSize = 1.0;
	var i;

	this.width = 16 * 3 * this.blockSize;
	this.height = 9 * 3 * this.blockSize;
	this.waterLevel = 3 * this.blockSize;
	this.starts = [
		new THREE.Vector2(this.width * 0.333, this.height * 0.8),
		new THREE.Vector2(this.width * 0.667, this.height * 0.8)
	];

	// Clutter definitions
	var clutter = [];
	clutter.probability = level.clutterProbability || 0;
	for (var c in level.clutter) {
		for (i = 0; i < level.clutter[c]; ++i) {
			clutter.push(c);
		}
	}

	// Background
	var bg = new TOMATO.Entity(null);
	var bgMaterial = TOMATO.cache.getMaterial("backgrounds/" + level.background);
	bg.visual = new TOMATO.Sprite(bg, new TOMATO.SpriteGeometry(this.width, this.height), bgMaterial);
	bg.visual.mesh.position.set(this.width / 2, this.height / 2, -100);
	TOMATO.game.add(bg);

	// Platforms
	var platform = assets.blocks[level.tiles.platform];
	this.addPlatform(platform, 5, this.waterLevel + 5, this.width - 16, clutter);
	this.addPlatform(platform, 14, this.waterLevel + 7, 10, clutter);
	this.addPlatform(platform, 25, this.waterLevel + 9, 10, clutter);
	this.addPlatform(platform, 38, this.waterLevel + 6, 8, clutter);

	// Ladders
	var ladder = assets.blocks[level.tiles.ladder];
	this.addLadder(ladder, 0, this.waterLevel, 5);
	this.addLadder(ladder, this.width-1, this.waterLevel, 5);
	this.addLadder(ladder, this.width/2, this.waterLevel+6, 2);

	// Objects
	//for (i = 0; i < 50; ++i)
	//	TOMATO.game.add(this.createObject(assets.objects.box, this.width * Math.random(), this.height * 0.8));
	TOMATO.game.add(this.createObject(assets.objects.box, this.width / 2 + 2, this.height / 2));
	TOMATO.game.add(this.createObject(assets.objects.box, 7, this.waterLevel + 6));
	TOMATO.game.add(this.createObject(assets.objects["dirt-rock"], 15, this.waterLevel + 8));
	TOMATO.game.add(this.createObject(assets.objects["stone"], 19, this.waterLevel + 8));

	// Water
	this.addWater(assets.blocks[level.tiles.water]);

	// World borders
	TOMATO.game.physicsSystem.createBorders(0, this.height, this.width, 0);
};


TOMATO.World.prototype.addPlatform = function(def, x, y, width, clutter) {
	width = width | 0;
	if (width < 2) throw("Too narrow platform");
	var entity = new TOMATO.Entity(null);
	var geo = new THREE.Geometry();
	var tempMesh = new THREE.Mesh();
	for (var i = 0; i < width; ++i) {
		var tile = 1;
		if (i == 0) tile = 0;
		else if (i == width-1) tile = 2;
		var tempGeo = new TOMATO.SpriteGeometry(this.blockSize, this.blockSize, tile, 0, 3, 1);
		tempMesh.geometry = tempGeo;
		tempMesh.position.x = i * this.blockSize + this.blockSize / 2 - width / 2;
		THREE.GeometryUtils.merge(geo, tempMesh);
		if (clutter && Math.random() < clutter.probability) {
			var c = clutter[(Math.random() * clutter.length)|0];
			TOMATO.game.add(this.createObject(assets.clutter[c], x + i * this.blockSize , y + this.blockSize));
		}
	}
	var mat = TOMATO.cache.getMaterial("tiles/" + def.sprite);
	entity.visual = new TOMATO.Sprite(entity, geo, mat);
	entity.visual.mesh.position.set(x + width / 2, y + this.blockSize / 2, 0);
	entity.body = TOMATO.game.physicsSystem.createBody({
		size: { x: this.blockSize * width, y: this.blockSize },
		collision: def.collision,
		mass: def.mass
	}, x + width / 2, y + this.blockSize / 2);
	TOMATO.game.add(entity);
	return entity;
};

TOMATO.World.prototype.addLadder = function(def, x, y, height) {
	height = height | 0;
	if (height < 2) throw("Too low ladder");
	var entity = new TOMATO.Entity(null);
	var geo = new THREE.Geometry();
	var tempMesh = new THREE.Mesh();
	for (var i = 0; i < height; ++i) {
		var tile = (i < height-1) ? 1 : 0;
		var tempGeo = new TOMATO.SpriteGeometry(this.blockSize, this.blockSize, 0, tile, 1, 2);
		tempMesh.geometry = tempGeo;
		tempMesh.position.x = this.blockSize / 2;
		tempMesh.position.y = i * this.blockSize + this.blockSize / 2 - height / 2;
		THREE.GeometryUtils.merge(geo, tempMesh);
	}
	var mat = TOMATO.cache.getMaterial("tiles/" + def.sprite);
	entity.visual = new TOMATO.Sprite(entity, geo, mat);
	entity.visual.mesh.position.set(x, y + height/2, 0);
	entity.body = TOMATO.game.physicsSystem.createBody({
		size: { x: this.blockSize, y: this.blockSize * height },
		collision: "box",
		mass: 0,
		sensor: true
	}, x + this.blockSize / 2, y + height * this.blockSize / 2);
	entity.body.ladder = true;
	TOMATO.game.add(entity);
	return entity;
};

TOMATO.World.prototype.addWater = function(def) {
	var layers = (this.waterLevel / this.blockSize)|0;
	var columns = (this.width / this.blockSize)|0;
	var entity = new TOMATO.Entity(null);
	var geo = new THREE.Geometry();
	var tempMesh = new THREE.Mesh();
	for (var j = 0; j < layers; ++j) {
		for (var i = 0; i < columns; ++i) {
			var tile = (j < layers - 1) ? 1 : 0;
			var tempGeo = new TOMATO.SpriteGeometry(this.blockSize, this.blockSize, 0, tile, 1, 2);
			tempMesh.geometry = tempGeo;
			tempMesh.position.x = i * this.blockSize + this.blockSize / 2;
			tempMesh.position.y = j * this.blockSize + this.blockSize / 2;
			THREE.GeometryUtils.merge(geo, tempMesh);
		}
	}
	var mat = TOMATO.cache.getMaterial("tiles/" + def.sprite);
	entity.visual = new TOMATO.Sprite(entity, geo, mat);
	TOMATO.game.add(entity);
};

TOMATO.World.prototype.createObject = function(def, x, y) {
	var entity = new TOMATO.Entity();
	x += def.size.x / 2;
	y += def.size.y / 2;
	// Visuals
	if (def.sprite) {
		var mat = TOMATO.cache.getMaterial(def.sprite);
		var geo = new TOMATO.SpriteGeometry(def.size.x, def.size.y);
		geo.dynamic = false;
		entity.visual = new TOMATO.Sprite(entity, geo, mat);
		entity.visual.mesh.position.set(x, y, 0);
	}
	// Physics
	if (def.collision)
		entity.body = TOMATO.game.physicsSystem.createBody(def, x, y);
	// Determine if the entity needs tracking
	if (!def.mass) entity.id = null;
	else entity.body.entity = entity;
	return entity;
};
