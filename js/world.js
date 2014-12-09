"use strict";

TOMATO.World = function(level) {
	this.blockSize = 1.0;

	this.width = 16 * 3 * this.blockSize;
	this.height = 9 * 3 * this.blockSize;
	this.waterLevel = 3 * this.blockSize;
	this.starts = [];
	this.clouds = [];
	this.ladders = [];
	this.ropes = [];

	// Clutter definitions
	var clutter = [];
	clutter.probability = level.clutterProbability || 0;
	for (var c in level.clutter) {
		for (var i = 0; i < level.clutter[c]; ++i) {
			clutter.push(c);
		}
	}

	// Background
	var bg = new TOMATO.Entity(null);
	var bgMaterial = TOMATO.cache.getMaterial("backgrounds/" + level.background);
	bg.visual = new TOMATO.Sprite(bg, new TOMATO.SpriteGeometry(this.width, this.height), bgMaterial);
	bg.setPosition(this.width / 2, this.height / 2, -100);
	TOMATO.game.add(bg);

	// Clouds
	var cloudMats = [
		TOMATO.cache.getMaterial("objects/cloud.png"),
		TOMATO.cache.getMaterial("objects/cloud2.png"),
		TOMATO.cache.getMaterial("objects/cloud3.png")
	];
	var cloudGeo = new TOMATO.SpriteGeometry(2, 1);
	var windSpeed = 0.2;
	for (var i = 0; i < 10; ++i) {
		var cloud = new TOMATO.Entity(null);
		cloud.visual = new TOMATO.Sprite(cloud, cloudGeo, randElem(cloudMats));
		cloud.setPosition(Math.random() * this.width, Math.random() * this.height * 0.333 + this.height * 0.667, -50);
		cloud.velocity = windSpeed * rand(0.8, 1.2);
		this.clouds.push(cloud);
		TOMATO.game.add(cloud);
	}
	
	if (window.location.hash.contains("testlevel"))
		this.createTestLevel(level, clutter);
	else this.createLevel(LEVEL.map, level, clutter);

	// Water
	this.addWater(assets.blocks[level.tiles.water]);

	// World borders
	TOMATO.game.physicsSystem.createBorders(0, this.height, this.width, 0);
};


TOMATO.World.prototype.update = function(dt) {
	for (var i = 0, l = this.clouds.length; i < l; ++i) {
		var cloud = this.clouds[i];
		cloud.visual.mesh.position.x += cloud.velocity * dt;
		if (cloud.visual.mesh.position.x > this.width + 2)
			cloud.setPosition(-2, Math.random() * this.height * 0.333 + this.height * 0.667);
	}
};


TOMATO.World.prototype.createLevel = function(map, level, clutter) {
	this.width = map[0].length * this.blockSize;
	this.height = map.length * this.blockSize + this.waterLevel;
	function parseLength(tile, x, y, dx, dy) {
		var l = 0;
		while (map[y][x] == tile) {
			l++;
			x += dx;
			y += dy;
		}
		return l;
	}
	var i, j, y, l;
	// Platforms, bridges and start points
	for (j = 0; j < map.length; ++j) {
		for (i = 0; i < map[0].length; ) {
			y = map.length + this.waterLevel - j - 1;
			l = parseLength("#", i, j, 1, 0);
			if (l) {
				this.addPlatform(assets.blocks[level.tiles.platform], i, y, l, clutter);
				i += l;
				continue;
			}
			l = parseLength("-", i, j, 1, 0);
			if (l) {
				this.addBridge(assets.interactives[level.tiles.bridge], i, y, l);
				i += l;
				continue;
			}
			if (map[j][i] == "S")
				this.starts.push(new THREE.Vector2(i * this.blockSize, y * this.blockSize));
			i++;
		}
	}
	// Ladders are scanned one column at a time, starting from the bottom
	for (i = 0; i < map[0].length; ++i) {
		for (j = map.length-1; j >= 0; --j) {
			y = map.length + this.waterLevel - j - 1;
			l = parseLength("H", i, j, 0, -1);
			if (l) {
				this.addLadder(assets.blocks[level.tiles.ladder], i, y, l);
				j -= l;
			}
		}
	}
	// Ropes scanned one column at a time, starting from the top
	for (i = 0; i < map[0].length; ++i) {
		for (j = 0; j < map.length; ++j) {
			y = map.length + this.waterLevel - j - 1;
			l = parseLength("|", i, j, 0, 1);
			if (l) {
				this.addRope(assets.interactives[level.tiles.rope], i, y, l);
				j += l;
			}
		}
	}
	// Objects
	for (var obj in level.objects)
		for (i = 0; i < level.objects[obj]; ++i)
			TOMATO.game.add(this.createObject(assets.objects[obj], this.width * Math.random(), this.height * Math.random()));

};

TOMATO.World.prototype.createTestLevel = function(level, clutter) {
	this.starts = [
		new THREE.Vector2(this.width * 0.333, this.height * 0.8),
		new THREE.Vector2(this.width * 0.667, this.height * 0.8)
	];

	// Platforms
	var platform = assets.blocks[level.tiles.platform];
	this.addPlatform(platform, 5, this.waterLevel + 5, this.width - 16, clutter);
	this.addPlatform(platform, 14, this.waterLevel + 7, 10, clutter);
	this.addPlatform(platform, 25, this.waterLevel + 9, 10, clutter);
	this.addPlatform(platform, 15, this.waterLevel + 9, 2, clutter);
	this.addPlatform(platform, 38, this.waterLevel + 6, 8, clutter);

	// Bridges
	var bridge = assets.interactives[level.tiles.bridge];
	this.addBridge(bridge, 17, this.waterLevel + 9, 8);
	
	// Ladders
	var ladder = assets.blocks[level.tiles.ladder];
	this.addLadder(ladder, 0, this.waterLevel, 8);
	this.addLadder(ladder, this.width-1, this.waterLevel, 8);
	this.addLadder(ladder, this.width/2, this.waterLevel+6, 2);

	// Objects
	var boxes = [ assets.objects.box, assets.objects.box, assets.objects.box2, assets.objects.box3 ];
	for (var i = 0; i < 25; ++i)
		TOMATO.game.add(this.createObject(randElem(boxes), this.width * Math.random(), this.waterLevel + Math.random()));
	TOMATO.game.add(this.createObject(assets.objects.box, this.width / 2 + 2, this.height / 2));
	TOMATO.game.add(this.createObject(assets.objects.box2, 7, this.waterLevel + 6));
	TOMATO.game.add(this.createObject(assets.objects["dirt-rock"], 15, this.waterLevel + 8));
	TOMATO.game.add(this.createObject(assets.objects["stone"], 19, this.waterLevel + 8));
};


TOMATO.World.prototype.addPlatform = function(def, x, y, width, clutter) {
	width = width | 0;
	if (width < 2) throw("Too narrow platform");
	var entity = new TOMATO.Entity(null);
	var geo = new THREE.Geometry();
	var transform = new THREE.Matrix4();
	for (var i = 0; i < width; ++i) {
		var tile = 1;
		if (i == 0) tile = 0;
		else if (i == width-1) tile = 2;
		var tempGeo = new TOMATO.SpriteGeometry(this.blockSize, this.blockSize, tile, 0, 3, 1);
		transform.makeTranslation(i * this.blockSize + this.blockSize / 2 - width / 2, 0, 0);
		geo.merge(tempGeo, transform);
		if (clutter && Math.random() < clutter.probability) {
			var c = randElem(clutter);
			TOMATO.game.add(this.createObject(assets.clutter[c], x + i * this.blockSize , y + this.blockSize));
		}
	}
	var mat = TOMATO.cache.getMaterial("tiles/" + def.sprite);
	entity.visual = new TOMATO.Sprite(entity, geo, mat);
	entity.visual.mesh.position.set(x + width / 2, y + this.blockSize / 2, 0);
	entity.body = TOMATO.game.physicsSystem.createBody({
		size: [ this.blockSize * width, this.blockSize ],
		collision: def.collision,
		mass: def.mass
	}, x + width / 2, y + this.blockSize / 2);
	TOMATO.game.add(entity);
	return entity;
};

TOMATO.World.prototype.addBridge = function(def, x, y, width) {
	width = width | 0;
	if (width < 2) throw("Too narrow bridge");
	var geo = new TOMATO.SpriteGeometry(def.size[0], def.size[1]);
	geo.dynamic = false;
	var mat = TOMATO.cache.getMaterial(def.sprite);
	var constraintOpts = {
		type: "distance",
		distance: 0,
		localAnchorA: [ -this.blockSize * 0.5, 0 ],
		localAnchorB: [ this.blockSize * 0.5, 0 ]
	};
	var prevBody = null;
	for (var i = 0; i < width; ++i) {
		var entity = new TOMATO.Entity();
		entity.visual = new TOMATO.Sprite(entity, geo, mat);
		entity.body = TOMATO.game.physicsSystem.createBody({
			size: def.size,
			collision: def.collision,
			mass: (i == 0 || i == width-1) ? 0 : def.mass
		}, x + (i + 0.5) * this.blockSize, y + this.blockSize - this.blockSize / 6);
		if (prevBody)
			TOMATO.game.physicsSystem.addConstraint(entity.body, prevBody, constraintOpts);
		TOMATO.game.add(entity);
		prevBody = entity.body;
	}
};

TOMATO.World.prototype.addLadder = function(def, x, y, height) {
	height = height | 0;
	if (height < 2) throw("Too short ladder");
	var entity = new TOMATO.Entity(null);
	var geo = new THREE.Geometry();
	var transform = new THREE.Matrix4();
	for (var i = 0; i < height; ++i) {
		var tile = (i < height-1) ? 1 : 0;
		var tempGeo = new TOMATO.SpriteGeometry(this.blockSize, this.blockSize, 0, tile, 1, 2);
		transform.makeTranslation(this.blockSize / 2, i * this.blockSize + this.blockSize / 2 - height / 2, 0);
		geo.merge(tempGeo, transform);
	}
	var mat = TOMATO.cache.getMaterial("tiles/" + def.sprite);
	entity.visual = new TOMATO.Sprite(entity, geo, mat);
	entity.visual.mesh.position.set(x, y + height/2, 0);
	entity.body = TOMATO.game.physicsSystem.createBody({
		size: [ this.blockSize, this.blockSize * height ],
		collision: "box",
		mass: 0,
		sensor: true
	}, x + this.blockSize / 2, y + height * this.blockSize / 2);
	this.ladders.push(entity);
	TOMATO.game.add(entity);
	return entity;
};

TOMATO.World.prototype.addRope = function(def, x, y, height) {
	height = height | 0;
	if (height < 1) throw("Too short rope");
	var geo = new TOMATO.SpriteGeometry(def.size[0], def.size[1]);
	geo.dynamic = false;
	var mat = TOMATO.cache.getMaterial(def.sprite);
	var prevBody = null;
	for (var j = 0; j < height; j += 0.25) {
		var entity = new TOMATO.Entity();
		entity.visual = new TOMATO.Sprite(entity, geo, mat);
		entity.body = TOMATO.game.physicsSystem.createBody({
			size: def.size,
			collision: def.collision,
			mass: (j == 0) ? 0 : def.mass
		}, x + 0.5, y + this.blockSize - j);
		entity.body.allowSleep = false;
		if (prevBody)
			TOMATO.game.physicsSystem.addConstraint(entity.body, prevBody, { type: "lock" });
		this.ropes.push(entity);
		TOMATO.game.add(entity);
		prevBody = entity.body;
	}
};

TOMATO.World.prototype.addWater = function(def) {
	var layers = (this.waterLevel / this.blockSize)|0;
	var columns = (this.width / this.blockSize)|0;
	var entity = new TOMATO.Entity(null);
	var geo = new THREE.Geometry();
	var transform = new THREE.Matrix4();
	for (var j = 0; j < layers; ++j) {
		for (var i = 0; i < columns; ++i) {
			var tile = (j < layers - 1) ? 1 : 0;
			var tempGeo = new TOMATO.SpriteGeometry(this.blockSize, this.blockSize, 0, tile, 1, 2);
			transform.makeTranslation(i * this.blockSize + this.blockSize / 2, j * this.blockSize + this.blockSize / 2, 0);
			geo.merge(tempGeo, transform);
		}
	}
	var mat = TOMATO.cache.getMaterial("tiles/" + def.sprite);
	entity.visual = new TOMATO.Sprite(entity, geo, mat);
	entity.visual.mesh.position.z = 10; // Make sure water is in front of everything
	TOMATO.game.add(entity);
};

TOMATO.World.prototype.createObject = function(def, x, y) {
	var entity = new TOMATO.Entity();
	x += def.size[0] / 2;
	y += def.size[1] / 2;
	// Visuals
	if (def.sprite) {
		var mat = TOMATO.cache.getMaterial(def.sprite);
		var geo = new TOMATO.SpriteGeometry(def.size[0], def.size[1]);
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
