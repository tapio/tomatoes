"use strict";


TOMATO.PhysicsSystem = function() {
	this.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -9.81));
};

TOMATO.PhysicsSystem.prototype.update = function(dt) {
	var timeStep = 1.0 / 60.0;
	var velIters = 8;
	var posIters = 3;
	this.world.Step(timeStep, velIters, posIters);
};

TOMATO.PhysicsSystem.prototype.createBody = function(def, x, y) {
	if (!def.physics) return null;

	var shape;
	var shapeDef = def.physics.shape || "box";
	if (shapeDef === "circle") {
		shape = new Box2D.b2CircleShape();
		shape.set_m_radius(def.size.x * 0.5);
	} else {
		shape = new Box2D.b2PolygonShape();
		shape.SetAsBox(def.size.x * 0.5, def.size.y * 0.5);
	}

	var bodyDef = new Box2D.b2BodyDef();
	bodyDef.set_type(def.physics.mass ? Box2D.b2_dynamicBody : Box2D.b2_staticBody);
	bodyDef.set_position(new Box2D.b2Vec2(x || 0.0, y || 0.0));
	bodyDef.set_fixedRotation(def.controller ? true : false);

	var fixtureDef = new Box2D.b2FixtureDef();
	fixtureDef.set_density(def.physics.mass || 0);
	fixtureDef.set_friction(def.physics.friction || 0.9);
	fixtureDef.set_restitution(def.physics.restitution || 0.1);
	fixtureDef.set_shape(shape);

	var body = this.world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	return body;
};

TOMATO.PhysicsSystem.prototype.destroyBody = function(body) {
	this.world.DestroyBody(body);
};

TOMATO.PhysicsSystem.prototype.createChainShape = function(vertices, closedLoop) {
	var shape = new Box2D.b2ChainShape();
	var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
	var offset = 0;
	for (var i = 0; i < vertices.length; ++i) {
		Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float');
		Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float');
		offset += 8;
	}
	var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
	if (closedLoop) shape.CreateLoop(ptr_wrapped, vertices.length);
	else shape.CreateChain(ptr_wrapped, vertices.length);
	return shape;
};

TOMATO.PhysicsSystem.prototype.createBorders = function(x1, y1, x2, y2) {
	var topLeft = new Box2D.b2Vec2(x1, y1);
	var topRight = new Box2D.b2Vec2(x2, y1);
	var bottomLeft = new Box2D.b2Vec2(x1, y2);
	var bottomRight = new Box2D.b2Vec2(x2, y2);

	var chainShape = this.createChainShape([ topLeft, topRight, bottomRight, bottomLeft ], true); // true for closed loop

	var bodyDef = new Box2D.b2BodyDef();
	bodyDef.set_type(Box2D.b2_staticBody);
	var body = this.world.CreateBody(bodyDef);

	var fixtureDef = new Box2D.b2FixtureDef();
	fixtureDef.set_shape(chainShape);
	body.CreateFixture(fixtureDef);
};

