"use strict";

TOMATO.PhysicsSystem = function() {
	this.world = new p2.World({
		gravity : [0, -9.81],
	});
	this.world.sleepMode = p2.World.BODY_SLEEPING;
	this.world.solver.iterations = 20;
	this.world.solver.frictionIterations = 10;
	this.world.defaultContactMaterial.friction = 0.5;
	this.world.defaultContactMaterial.restitution = 0.2;
	this.timeStep = 1 / 60.0;
	this.timeAccumulator = 0;
	this.trackedBodies = [];
};

TOMATO.PhysicsSystem.prototype.update = function(dt) {
	for (var i = 0, l = this.trackedBodies.length; i < l; i++) {
		this.trackedBodies[i].standing = false;
		this.trackedBodies[i].climbing = false;
	}

	//var timeStep = this.timeStep;
	//this.timeAccumulator += dt
	//while (this.timeAccumulator >= timeStep) {
	//	this.world.step(timeStep);
	//	this.timeAccumulator -= timeStep;
	//}
	this.world.step(this.timeStep, dt, 10);

	for (var i = 0, l = this.world.narrowphase.contactEquations.length; i < l; i++) {
		var c = this.world.narrowphase.contactEquations[i];
		if (c.bodyA.tracked && c.normalA[1] < -0.5)
			c.bodyA.standing = true;
		if (c.bodyB.tracked && c.normalA[1] > 0.5)
			c.bodyB.standing = true;
	}
};

TOMATO.PhysicsSystem.prototype.setContactListener = function(callback) {
	this.world.on("beginContact", function(e) {
		callback(e.bodyA, e.bodyB);	
	});
};

TOMATO.PhysicsSystem.prototype.createBody = function(def, x, y) {
	if (!def.collision) return null;

	var shape;
	var shapeDef = def.collision || "box";
	if (shapeDef === "circle") {
		shape = new p2.Circle(def.size.x * 0.5);
	} else {
		shape = new p2.Rectangle(def.size.x, def.size.y);
	}
	shape.sensor = def.sensor || false;
	shape.material = new p2.Material(); // TODO: Share according to def
	// TODO: friction: 0.9, restitution: 0.1

	var body = new p2.Body({
		mass: def.mass || 0,
		position: [ x || 0, y ||0 ],
		fixedRotation: def.character ? true : false,
		damping: 0, // 0.1 is p2's default
		angularDamping: 0.1 // 0.1 is p2's default
	});
	body.addShape(shape);

	if (def.character) {
		body.tracked = true;
		body.standing = false;
		body.climbing = false;
		this.trackedBodies.push(body);
	}
	this.world.addBody(body);
	return body;
};

TOMATO.PhysicsSystem.prototype.destroyBody = function(body) {
	this.world.removeBody(body);
};

TOMATO.PhysicsSystem.prototype.createBorders = function(x1, y1, x2, y2) {
	var midx = (x2 - x1) * 0.5;
	var midy = (y1 - y2) * 0.5;
	var topShape = new p2.Line(x2 - x1);
	var bottomShape = new p2.Line(x2 - x1);
	var leftShape = new p2.Line(y1 - y2);
	var rightShape = new p2.Line(y1 - y2);

	var body = new p2.Body({ mass: 0 });
	body.addShape(topShape, [midx, y1], 0);
	body.addShape(bottomShape, [midx, y2], 0);
	body.addShape(leftShape, [x1, midy], Math.PI / 2);
	body.addShape(rightShape, [x2, midy], Math.PI / 2);

	this.world.addBody(body);
};

TOMATO.PhysicsSystem.prototype.rayCast = function(x1, y1, x2, y2) {
	return null;
}

