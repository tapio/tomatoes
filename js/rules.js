"use strict";

TOMATO.RulesSystem = function() {
	this.players = [];
	this.container = document.getElementById("points-container");
};

TOMATO.RulesSystem.prototype.add = function(player) {
	this.players.push(player);
	var div = document.createElement("div");
	div.className = "points-row";
	var icon = document.createElement("img");
	icon.className = "icon";
	icon.src = player.visual.mesh.material.map.sourceFile;
	div.appendChild(icon);
	var points = document.createElement("span");
	points.className = "points";
	div.appendChild(points);
	player.domPoints = points;
	this.container.appendChild(div);
};

TOMATO.RulesSystem.prototype.update = function(dt) {
	for (var i = 0; i < this.players.length; ++i) {
		var pl = this.players[i];
		var status = pl.status;
		pl.domPoints.innerHTML = /*"☠" + status.deaths +*/ "❤" + status.respawns;
	}
};
