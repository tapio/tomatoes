"use strict";

TOMATO.RulesSystem = function() {
	this.players = [];
	this.container = document.getElementById("points-container");
};

TOMATO.RulesSystem.prototype.add = function(player) {
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
	this.players.push(player);
};

TOMATO.RulesSystem.prototype.update = function(dt) {
	var playersAlive = 0;
	var winner = -1;
	for (var i = 0; i < this.players.length; ++i) {
		var pl = this.players[i];
		var status = pl.status;
		if (!status.dead) {
			++playersAlive;
			winner = i;
			pl.domPoints.innerHTML = "❤" + (status.respawns+1);
		} else pl.domPoints.innerHTML = "☠";
	}
	if (playersAlive <= 1 && TOMATO.game.running) {
		TOMATO.game.running = false;
		this.endScreen(winner);
	}
};

TOMATO.RulesSystem.prototype.endScreen = function(winner) {
	var title = (winner >= 0) ? "Player " + winner + " Wins!" : "Draw!";
	document.getElementById("winner").innerHTML = title;
	document.getElementById("results").className = "";
	document.getElementById("restart").addEventListener("click", function() { window.location.reload(); });
};
