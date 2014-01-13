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
