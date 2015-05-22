'use strict';

// Famous dependencies
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Mesh = require('famous/webgl-renderables/Mesh');
var Color = require('famous/utilities/Color');
var OBJLoader = require('famous/webgl-geometries/OBJLoader');
var Geometry = require('famous/webgl-geometries/Geometry');
var Camera = require('famous/components/Camera');
var PointLight = require('famous/webgl-renderables/lights/PointLight');

// Boilerplate code to make your life easier
FamousEngine.init();

// Initialize with a scene; then, add a 'node' to the scene root
var scene = FamousEngine.createScene();
var camera = new Camera(scene).setDepth(1000);
var logo = scene.addChild();
var rotateNode = logo.addChild();

rotateNode.setRotation(0,0, 1.66);

var lightNode = scene.addChild()
.setAlign(0.5, 0.5, 0.5)
.setPosition(0, 0, 250);

var light = new PointLight(lightNode)
.setColor(new Color('red'));

OBJLoader.load('obj/dna.obj', function(geometries) {
    for (var i = 0; i < geometries.length; i++) {
        var buffers = geometries[i];
        console.log(buffers);
        var geometry = new Geometry({
            buffers: [
                { name: 'a_pos', data: buffers.vertices, size: 3 },
                { name: 'a_normals', data: buffers.normals, size: 3 },
                { name: 'a_texCoords', data: buffers.textureCoords, size: 2},
                { name: 'indices', data: buffers.indices, size: 1 }
            ]
        });

        var pieceNode = rotateNode.addChild();
        var mesh = new Mesh(pieceNode)
            .setGeometry(geometry);

    }
});



// Chainable API
logo
    // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
    .setSizeMode('absolute', 'absolute', 'absolute')
    .setAbsoluteSize(3.5, 3.5, 3.5)
    // Center the 'node' to the parent (the screen, in this instance)
    .setAlign(0.5, 0.5)
    // Set the translational origin to the center of the 'node'
    .setMountPoint(-20,-90,95)
    // Set the rotational origin to the center of the 'node'
    .setOrigin(-20, -90, 95);

// Add a spinner component to the logo 'node' that is called, every frame
var spinner = logo.addComponent({
    onUpdate: function(time) {
        logo.setRotation(0, time/1000,  0);
        logo.requestUpdateOnNextTick(spinner);
    }
});

// Let the magic begin...
logo.requestUpdate(spinner);
