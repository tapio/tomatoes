"use strict";

TOMATO.Sound = function(samples, minPlayers) {
	if (typeof samples === "string") samples = [ samples ];
	minPlayers = minPlayers || 1;

	this.sampleIndex = 0;
	this.samples = [];

	while (this.samples.length < minPlayers)
		for (var i = 0; i < samples.length; ++i)
			this.samples.push(new Audio("assets/sounds/" + samples[i]));

	this.play = function(volume) {
		if (!CONFIG.sounds) return;
		try { // Firefox fails at GitHub MIME types
			var sample = this.samples[this.sampleIndex];
			if (window.chrome) sample.load(); // Chrome requires reload
			else sample.currentTime = 0;
			if (volume !== undefined)
				sample.volume = volume;
			sample.play();
			this.sampleIndex = (this.sampleIndex + 1) % this.samples.length;
		} catch(e) {}
	};
};


TOMATO.SoundSystem = function() {
	var sounds = {};
	var music;
	for (var s in assets.sounds)
		sounds[s] = new TOMATO.Sound(assets.sounds[s], 5);

	this.play = function(name) {
		sounds[name].play();
	};

	this.playMusic = function(name) {
		if (!name) {
			if (this.currentMusic) name = this.currentMusic;
			else return;
		}
		this.stopMusic();
		music = new Audio("assets/music/" + name + ".ogg");
		music.loop = true;
		music.play();
	};

	this.stopMusic = function() {
		if (music) music.pause();
	};

	this.currentMusic = "";
};
