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
	var bodies = this.world.bodies;
	var waterLevel = TOMATO.game.world.waterLevel - 0.5;
	for (var i = 0, l = bodies.length; i < l; i++) {
		var body = bodies[i];
		body.standing = false; // Reset standing status
		// Buoyancy
		if (body.floating && body.position[1] < waterLevel) {
			var f = -1.8 * body.mass * this.world.gravity[1];
			body.applyForce([0, f], body.position);
			// Water friction
			body.damping = 0.9;
			body.angularDamping = 0.6;
		}
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

	var shape, shapeAngle = 0;
	var shapeDef = def.collision || "box";
	if (shapeDef === "circle") {
		shape = new p2.Circle(def.size.x * 0.5);
	} else if (shapeDef === "capsule") {
		shape = new p2.Capsule(def.size.y - def.size.x, def.size.x * 0.5);
		shapeAngle = Math.PI * 0.5;
	} else if (shapeDef === "hcapsule") {
		shape = new p2.Capsule(def.size.x - def.size.y, def.size.y * 0.5);
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
	body.addShape(shape, [0, 0], shapeAngle);
	body.floating = def.floating;

	if (def.character) {
		body.allowSleep = false;
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

TOMATO.PhysicsSystem.prototype.addConstraint = function(bodyA, bodyB) {
	var constraint = new p2.DistanceConstraint(bodyA, bodyB);
	this.world.addConstraint(constraint);
};

TOMATO.PhysicsSystem.prototype.createBorders = function(x1, y1, x2, y2) {
	var offset = 50;
	var midx = (x2 - x1) * 0.5;
	var midy = (y1 - y2) * 0.5;
	var horShape = new p2.Rectangle(x2 - x1, offset * 2);
	var verShape = new p2.Rectangle(offset * 2, y1 - y2);

	var body = new p2.Body({ position: [midx, y1 + offset], mass: 0 });
	body.addShape(horShape);
	this.world.addBody(body);
	body = new p2.Body({ position: [midx, y2 - offset], mass: 0 });
	body.addShape(horShape);
	this.world.addBody(body);
	body = new p2.Body({ position: [x1 - offset, midy], mass: 0 });
	body.addShape(verShape);
	this.world.addBody(body);
	body = new p2.Body({ position: [x2 + offset, midy], mass: 0 });
	body.addShape(verShape);
	this.world.addBody(body);
};

TOMATO.PhysicsSystem.prototype.rayCast = function(x1, y1, x2, y2) {
	return null;
}

TOMATO.PhysicsSystem.prototype.overlaps = function(bodyA, bodyB) {
	return bodyA.overlaps(bodyB);
}
