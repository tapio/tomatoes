"use strict";

function lerp(a, b, f) { return a + (b - a) * f; }

function dumpInfo() {
	var gl = TOMATO.game.renderSystem.renderer.context;
	var gl_info = {
		"Version": gl.getParameter(gl.VERSION),
		"Shading language": gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
		"Vendor": gl.getParameter(gl.VENDOR),
		"Renderer": gl.getParameter(gl.RENDERER),
		"Max varying vectors": gl.getParameter(gl.MAX_VARYING_VECTORS),
		"Max vertex attribs": gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
		"Max vertex uniform vectors": gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
		"Max fragment uniform vectors": gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
		"Max renderbuffer size": gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
		"Max texture size": gl.getParameter(gl.MAX_TEXTURE_SIZE),
		"Max cube map texture size": gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
		"Max texture image units": gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
		"Max vertex texture units": gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
		"Max combined texture units": gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
		"Max viewport dims": gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0] + "x" + gl.getParameter(gl.MAX_VIEWPORT_DIMS)[1]
	};
	console.log("WebGL info: ", gl_info);
}

function screenshot(dontDownload, useJPG) {
	var imgtype = useJPG ? "image/jpeg" : "image/png";
	var dataUrl = TOMATO.game.renderSystem.renderer.domElement.toDataURL(imgtype);
	if (!dontDownload) dataUrl = dataUrl.replace(imgtype, "image/octet-stream");
	window.open(dataUrl, "_blank");
}

var performance = window.performance || {};
performance.now = (function() {
	return performance.now ||
		performance.mozNow ||
		performance.msNow ||
		performance.oNow ||
		performance.webkitNow ||
		function() { return new Date().getTime(); };
})();

function diagnose() {
	var geometries = [];
	var meshes = [];
	var materials = [];
	TOMATO.game.renderSystem.scene.traverse(function(node) {
		meshes.push(node);
		if (node.geometry) geometries.push(node.geometry);
		if (node.material) {
			if (node.material.materials)
				for (var m = 0; m < node.material.materials.length; ++m)
					materials.push(node.material.materials[m]);
			else materials.push(node.material);
		}
	});
	console.log("Geometries: " + geometries.length, geometries);
	console.log("Meshes: " + meshes.length, meshes);
	console.log("Materials: " + materials.length, materials);
	console.log("GeometryIdCount:", THREE.GeometryIdCount, "Object3DIdCount:", THREE.Object3DIdCount, "MaterialIdCount:", THREE.MaterialIdCount);
	console.log("GeometryCount:", geometries.length, "MeshCount:", meshes.length, "MaterialCount:", materials.length);
}
