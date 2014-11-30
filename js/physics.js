"use strict";

TOMATO.PhysicsSystem = function() {
	this.world = new p2.World({
		gravity : [0, -9.81],
	});
	this.world.solver.iterations = 20;
	this.world.solver.frictionIterations = 10;
	this.timeStep = 1 / 60.0;
	this.timeAccumulator = 0;
};

TOMATO.PhysicsSystem.prototype.update = function(dt) {
	var timeStep = this.timeStep;
	this.timeAccumulator += timeStep
	while (this.timeAccumulator >= timeStep) {
		this.world.step(timeStep);
		this.timeAccumulator -= timeStep;
	}
};

TOMATO.PhysicsSystem.prototype.setContactListener = function(callback) {
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

	this.world.addBody(body);
	return body;
};

TOMATO.PhysicsSystem.prototype.destroyBody = function(body) {
	this.world.removeBody(body);
};

TOMATO.PhysicsSystem.prototype.createChainShape = function(vertices, closedLoop) {
	return null;
};

TOMATO.PhysicsSystem.prototype.createBorders = function(x1, y1, x2, y2) {
	/*var topLeft = new Box2D.b2Vec2(x1, y1);
	var topRight = new Box2D.b2Vec2(x2, y1);
	var bottomLeft = new Box2D.b2Vec2(x1, y2);
	var bottomRight = new Box2D.b2Vec2(x2, y2);

	var chainShape = this.createChainShape([ topLeft, topRight, bottomRight, bottomLeft ], true); // true for closed loop

	var bodyDef = new Box2D.b2BodyDef();
	bodyDef.set_type(Box2D.b2_staticBody);
	var body = this.world.CreateBody(bodyDef);

	var fixtureDef = new Box2D.b2FixtureDef();
	fixtureDef.set_shape(chainShape);
	body.CreateFixture(fixtureDef);*/
};

TOMATO.PhysicsSystem.prototype.rayCast = function(x1, y1, x2, y2) {
	return null;
}

