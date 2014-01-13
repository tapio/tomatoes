"use strict";

function addMessage(msg) { console.log(msg); };

TOMATO.Client = function(entity, host) {
	this.entity = entity;
	this.gaming = false;
	this.connected = false;
	host = host || "ws://" + window.location.hostname + ":10667";
	addMessage("Attempting connection to " + host + "...");
	this.socket = new WebSocket(host);
	var client = this;
	var pingInterval = null;
	var pingTime = performance.now();
	var v = new THREE.Vector2();

	this.send = function(msg) {
		this.socket.send(JSON.stringify(msg));
	};

	this.socket.onopen = function() {
		addMessage("Connection established!");
		client.send({ type: "hello", id: client.entity.id });
		client.connected = true;
		pingInterval = window.setInterval(function() {
			pingTime = performance.now();
			client.send({ type: "ping" });
		}, 2000);
		//document.getElementById("ping-container").className = "";
	};

	this.socket.onmessage = function(event) {
		console.log("Received: " + event.data);
		var msg = JSON.parse(event.data);
		switch (msg.type) {
			// Update
			case "state":
				client.gaming = true;
				for (var i = 0; i < msg.data.length; ++i) {
					var state = msg.data[i];
					var peer = TOMATO.game.findById(state.id);
					if (!peer) { // New player?
						addMessage("Player " + state.id + " joined.");
						peer = TOMATO.game.createPlayer({
							id: state.id,
							controller: "remote"
						});
					}
					// Set player state
					peer.setPosition(state.pos[0], state.pos[1]);
					peer.setVelocity(state.vel[0], state.vel[1]);
				}
				break;
			case "pong":
				entity.ping = performance.now() - pingTime;
				break;
			// Someone left
			case "leave":
				//TOMATO.game.removeById(msg.id);
				addMessage("Player " + msg.id + " left.", "warn");
				break;
			// Introduction ok, join a game
			case "hello":
				client.send({ type: "join", game: "global" });
				break;
			// Unknown
			default:
				console.log("Unknown message: " + msg);
				break;
		}
	};

	this.socket.onclose = function() {
		client.connected = false;
		if (pingInterval) window.clearInterval(pingInterval);
		if (client.gaming) addMessage("Connection terminated!", "error");
		else console.log("No connection");
	};

};

TOMATO.Client.prototype.update = function(dt) {
	if (!this.gaming) return;

	// Send my data
	var packet = {
		type: "upd",
		pos: [ this.entity.getPosition().x, this.entity.getPosition().y ],
		vel: [ this.entity.getVelocity().x, this.entity.getVelocity().y ]
	};
	this.send(packet);
};

