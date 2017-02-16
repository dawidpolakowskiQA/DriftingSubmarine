var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AirPlaneCube = (function () {
    function AirPlaneCube(x, y, z) {
        this.mesh = new THREE.Object3D();
        // Create the cabin
        var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
        var matCockpit = new THREE.MeshPhongMaterial({ color: Colors.RED, shading: THREE.FlatShading });
        // we can access a specific vertex of a shape through 
        // the vertices array, and then move its x, y and z property:
        geomCockpit.vertices[4].y -= 10;
        geomCockpit.vertices[4].z += 20;
        geomCockpit.vertices[5].y -= 10;
        geomCockpit.vertices[5].z -= 20;
        geomCockpit.vertices[6].y += 30;
        geomCockpit.vertices[6].z += 20;
        geomCockpit.vertices[7].y += 30;
        geomCockpit.vertices[7].z -= 20;
        var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);
        // Create the engine
        var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
        var matEngine = new THREE.MeshPhongMaterial({ color: Colors.WHITE, shading: THREE.FlatShading });
        var engine = new THREE.Mesh(geomEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        this.mesh.add(engine);
        // Create the tail
        var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        var matTailPlane = new THREE.MeshPhongMaterial({ color: Colors.RED, shading: THREE.FlatShading });
        var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
        tailPlane.position.set(-35, 25, 0);
        tailPlane.castShadow = true;
        tailPlane.receiveShadow = true;
        this.mesh.add(tailPlane);
        // Create the wing
        var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
        var matSideWing = new THREE.MeshPhongMaterial({ color: Colors.RED, shading: THREE.FlatShading });
        var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
        sideWing.castShadow = true;
        sideWing.receiveShadow = true;
        this.mesh.add(sideWing);
        // propeller
        var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
        var matPropeller = new THREE.MeshPhongMaterial({ color: Colors.BROWN, shading: THREE.FlatShading });
        this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
        this.propeller.castShadow = true;
        this.propeller.receiveShadow = true;
        // blades
        var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
        var matBlade = new THREE.MeshPhongMaterial({ color: Colors.BRWONDARK, shading: THREE.FlatShading });
        var blade = new THREE.Mesh(geomBlade, matBlade);
        blade.position.set(8, 0, 0);
        blade.castShadow = true;
        blade.receiveShadow = true;
        this.propeller.add(blade);
        this.propeller.position.set(50, 0, 0);
        this.mesh.add(this.propeller);
        this.pilot = new Pilot();
        this.pilot.mesh.position.set(-10, 27, 0);
        this.mesh.add(this.pilot.mesh);
        this.mesh.position.x = x != undefined ? x : this.mesh.position.x;
        this.mesh.position.y = y != undefined ? y : this.mesh.position.y;
        this.mesh.position.z = z != undefined ? z : this.mesh.position.z;
    }
    AirPlaneCube.prototype.update = function (currentMousePosition) {
        // let's move the airplane between -100 and 100 on the horizontal axis, 
        // and between 25 and 175 on the vertical axis,
        // depending on the mouse position which ranges between -1 and 1 on both axes;
        // to achieve that we use a normalize function (see below)
        var targetX = this.normalize(currentMousePosition.x, -1, 1, -100, 100);
        var targetY = this.normalize(currentMousePosition.y, -1, 1, 25, 175);
        // update the airplane's position
        this.mesh.position.y = targetY;
        this.mesh.position.x = targetX;
        this.propeller.rotation.x += 0.3;
        this.pilot.update();
    };
    AirPlaneCube.prototype.normalize = function (v, vmin, vmax, tmin, tmax) {
        var nv = Math.max(Math.min(v, vmax), vmin);
        var dv = vmax - vmin;
        var pc = (nv - vmin) / dv;
        var dt = tmax - tmin;
        var tv = tmin + (pc * dt);
        return tv;
    };
    Object.defineProperty(AirPlaneCube.prototype, "scale", {
        get: function () {
            return this.mesh.scale;
        },
        enumerable: true,
        configurable: true
    });
    return AirPlaneCube;
}());
var Cloud = (function () {
    function Cloud() {
        // Create an empty container that will hold the different parts of the cloud
        this.mesh = new THREE.Object3D();
        // create a cube geometry;
        // this shape will be duplicated to create the cloud
        var geom = new THREE.BoxGeometry(20, 20, 20);
        // create a material; a simple white material will do the trick
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.WHITE,
        });
        // duplicate the geometry a random number of times
        var nBlocs = 3 + Math.floor(Math.random() * 3);
        for (var i = 0; i < nBlocs; i++) {
            // create the mesh by cloning the geometry
            var m = new THREE.Mesh(geom, mat);
            // set the position and the rotation of each cube randomly
            m.position.x = i * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;
            // set the size of the cube randomly
            var s = .1 + Math.random() * .9;
            m.scale.set(s, s, s);
            // allow each cube to cast and to receive shadows
            m.castShadow = true;
            m.receiveShadow = true;
            // add the cube to the container we first created
            this.mesh.add(m);
        }
    }
    return Cloud;
}());
var Colors;
(function (Colors) {
    Colors[Colors["RED"] = 15881030] = "RED";
    Colors[Colors["WHITE"] = 14209233] = "WHITE";
    Colors[Colors["BROWN"] = 5845806] = "BROWN";
    Colors[Colors["PINK"] = 16095342] = "PINK";
    Colors[Colors["BRWONDARK"] = 2300175] = "BRWONDARK";
    Colors[Colors["BLUE"] = 6865856] = "BLUE";
})(Colors || (Colors = {}));
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this) || this;
    }
    GameScene.prototype.generateFog = function (hex, near, far) {
        this.fog = new THREE.Fog(hex, near, far);
    };
    return GameScene;
}(THREE.Scene));
var Sea = (function () {
    function Sea(x, y, z) {
        var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        // important: by merging vertices we ensure the continuity of the waves
        geom.mergeVertices();
        // get the vertices
        var l = geom.vertices.length;
        // create an array to store new data associated to each vertex
        this.waves = new Array();
        for (var i = 0; i < l; i++) {
            // get each vertex
            var v = geom.vertices[i];
            // store some data associated to it
            this.waves.push({ y: v.y,
                x: v.x,
                z: v.z,
                // a random angle
                ang: Math.random() * Math.PI * 2,
                // a random distance
                amp: 5 + Math.random() * 15,
                // a random speed between 0.016 and 0.048 radians / frame
                speed: 0.016 + Math.random() * 0.032
            });
        }
        ;
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.BLUE,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.receiveShadow = true;
        this.mesh.position.x = x != undefined ? x : 0;
        this.mesh.position.y = y != undefined ? y : 0;
        this.mesh.position.z = z != undefined ? z : 0;
    }
    Sea.prototype.update = function () {
        // get the vertices
        var verts = this.mesh.geometry.vertices;
        var l = verts.length;
        for (var i = 0; i < l; i++) {
            var v = verts[i];
            // get the data associated to it
            var vprops = this.waves[i];
            // update the position of the vertex
            v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
            v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
            // increment the angle for the next frame
            vprops.ang += vprops.speed;
        }
        // Tell the renderer that the geometry of the sea has changed.
        // In fact, in order to maintain the best level of performance, 
        // three.js caches the geometries and ignores any changes
        // unless we add this line
        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.rotation.z += .005;
    };
    return Sea;
}());
var Sky = (function () {
    function Sky(numberOfClounds, x, y, z) {
        // Create an empty container
        this.mesh = new THREE.Object3D();
        // choose a number of clouds to be scattered in the sky
        this.numberOfClounds = numberOfClounds;
        // To distribute the clouds consistently,
        // we need to place them according to a uniform angle
        var stepAngle = Math.PI * 2 / this.numberOfClounds;
        // create the clouds
        for (var i = 0; i < this.numberOfClounds; i++) {
            var c = new Cloud();
            // set the rotation and the position of each cloud;
            // for that we use a bit of trigonometry
            var a = stepAngle * i; // this is the final angle of the cloud
            var h = 850 + Math.random(); // this is the distance between the center of the axis and the cloud itself
            // Trigonometry!!! I hope you remember what you've learned in Math :)
            // in case you don't: 
            // we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
            c.mesh.position.y = Math.sin(a) * h;
            c.mesh.position.x = Math.cos(a) * h;
            // rotate the cloud according to its position
            c.mesh.rotation.z = a + Math.PI / 2;
            // for a better result, we position the clouds 
            // at random depths inside of the scene
            c.mesh.position.z = -400 - Math.random() * 400;
            // we also set a random scale for each cloud
            var s = 1 + Math.random() * 2;
            c.mesh.scale.set(s, s, s);
            // do not forget to add the mesh of each cloud in the scene
            this.mesh.add(c.mesh);
        }
        this.mesh.position.x = x != undefined ? x : 0;
        this.mesh.position.y = y != undefined ? y : 0;
        this.mesh.position.z = z != undefined ? z : 0;
    }
    Sky.prototype.update = function () {
        this.mesh.rotation.z += .01;
    };
    return Sky;
}());
var Point = (function () {
    function Point(x, y) {
        this._x = x || 0;
        this._y = y || 0;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Point.prototype.addToX = function (value) {
        this._x += value;
    };
    Point.prototype.addToY = function (value) {
        this._y += value;
    };
    return Point;
}());
/// <reference path="../threeLib/three.d.ts" />
/// <reference path="AirPlaneCube.ts"/>
/// <reference path="Sea.ts"/>
/// <reference path="Sky.ts"/>
/// <reference path="Point.ts"/>
var Game = (function () {
    function Game() {
        var _this = this;
        this.update = function () {
            // Rotate the propeller, the sea and the sky
            _this.airplane.update(_this.currentMousePosition);
            _this.sea.update();
            _this.sky.update();
            // render the scene
            _this.renderer.render(_this.scene, _this.camera);
            // call the loop function again
            requestAnimationFrame(_this.update);
        };
        this.currentMousePosition = new Point();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer();
        this.createLights();
        this.airplane = new AirPlaneCube(0, 100);
        this.airplane.scale.set(.22, .22, .22);
        this.sea = new Sea(0, -600);
        this.sky = new Sky(25, 0, -600);
        this.scene.add(this.airplane.mesh);
        this.scene.add(this.sea.mesh);
        this.scene.add(this.sky.mesh);
        // Add the DOM element of the renderer to the 
        // container we created in the HTML
        this.gameContainer = document.getElementById('world');
        this.gameContainer.appendChild(this.renderer.domElement);
        this.update();
    }
    Game.prototype.handleMouseMove = function (event) {
        // here we are converting the mouse position value received 
        // to a normalized value varying between -1 and 1;
        // this is the formula for the horizontal axis:
        this.currentMousePosition.x = -1 + (event.clientX / this.width) * 2;
        // for the vertical axis, we need to inverse the formula 
        // because the 2D y-axis goes the opposite direction of the 3D y-axis
        this.currentMousePosition.y = 1 - (event.clientY / this.height) * 2;
    };
    Game.prototype.handleWindowResize = function () {
        // update height and width of the renderer and the camera
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    };
    Game.prototype.createScene = function () {
        //Create the scene and add fog effect
        var scene = new GameScene();
        scene.generateFog(0xf7d9aa, 100, 950);
        return scene;
    };
    Game.prototype.createCamera = function () {
        // Create the camera
        var acceptRatio = this.width / this.height;
        var fieldOfView = 60;
        var nearPlane = 1;
        var farPlane = 10000;
        var camera = new THREE.PerspectiveCamera(fieldOfView, acceptRatio, nearPlane, farPlane);
        camera.position.x = 0;
        camera.position.z = 200;
        camera.position.y = 100;
        return camera;
    };
    Game.prototype.createRenderer = function () {
        var renderer = new THREE.WebGLRenderer({
            // Allow transparency to show the gradient background
            // we defined in the CSS
            alpha: true,
            // Activate the anti-aliasing; this is less performant,
            // but, as our project is low-poly based, it should be fine :)
            antialias: true,
        });
        // Define the size of the renderer; in this case,
        // it will fill the entire screen
        renderer.setSize(this.width, this.height);
        // Enable shadow rendering - this only available in WebGLRenderer, unavailable is Renderer simple class.
        renderer.shadowMap.enabled = true;
        return renderer;
    };
    Game.prototype.createLights = function () {
        // A hemisphere light is a gradient colored light; 
        // the first parameter is the sky color, the second parameter is the ground color, 
        // the third parameter is the intensity of the light
        var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
        // A directional light shines from a specific direction. 
        // It acts like the sun, that means that all the rays produced are parallel. 
        var shadowLight = new THREE.DirectionalLight(0xffffff, .9);
        // Set the direction of the light  
        shadowLight.position.set(150, 350, 350);
        // Allow shadow casting 
        shadowLight.castShadow = true;
        // define the visible area of the projected shadow
        shadowLight.shadow.camera.left = -400;
        shadowLight.shadow.camera.right = 400;
        shadowLight.shadow.camera.top = 400;
        shadowLight.shadow.camera.bottom = -400;
        shadowLight.shadow.camera.near = 1;
        shadowLight.shadow.camera.far = 1000;
        // define the resolution of the shadow; the higher the better, 
        // but also the more expensive and less performant
        shadowLight.shadow.mapSize.width = 2048;
        shadowLight.shadow.mapSize.height = 2048;
        // to activate the lights, just add them to the scene
        this.scene.add(hemisphereLight);
        this.scene.add(shadowLight);
    };
    return Game;
}());
window.addEventListener('load', init, false);
var game;
function init() {
    game = new Game();
    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', game.handleWindowResize, false);
    //add the listener
    document.addEventListener('mousemove', this.handleMouseMove, false);
}
function handleMouseMove(event) {
    game.handleMouseMove(event);
}
var Pilot = (function () {
    function Pilot() {
        this.mesh = new THREE.Object3D();
        this.mesh.name = "pilot";
        this.angleHairs = 0;
        // Body of the pilot
        var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
        var bodyMat = new THREE.MeshPhongMaterial({ color: Colors.BROWN, shading: THREE.FlatShading });
        var body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.set(2, -12, 0);
        this.mesh.add(body);
        // Face of the pilot
        var faceGeom = new THREE.BoxGeometry(10, 10, 10);
        var faceMat = new THREE.MeshLambertMaterial({ color: Colors.PINK });
        var face = new THREE.Mesh(faceGeom, faceMat);
        this.mesh.add(face);
        // Hair element
        var hairGeom = new THREE.BoxGeometry(4, 4, 4);
        var hairMat = new THREE.MeshLambertMaterial({ color: Colors.BROWN });
        var hair = new THREE.Mesh(hairGeom, hairMat);
        // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
        hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
        // create a container for the hair
        var hairs = new THREE.Object3D();
        // create a container for the hairs at the top 
        // of the head (the ones that will be animated)
        this.hairsTop = new THREE.Object3D();
        // create the hairs at the top of the head 
        // and position them on a 3 x 4 grid
        for (var i = 0; i < 12; i++) {
            var h = hair.clone();
            var col = i % 3;
            var row = Math.floor(i / 3);
            var startPosZ = -4;
            var startPosX = -4;
            h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
            this.hairsTop.add(h);
        }
        hairs.add(this.hairsTop);
        // create the hairs at the side of the face
        var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
        hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
        var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
        var hairSideL = hairSideR.clone();
        hairSideR.position.set(8, -2, 6);
        hairSideL.position.set(8, -2, -6);
        hairs.add(hairSideR);
        hairs.add(hairSideL);
        // create the hairs at the back of the head
        var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
        var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
        hairBack.position.set(-1, -4, 0);
        hairs.add(hairBack);
        hairs.position.set(-5, 5, 0);
        this.mesh.add(hairs);
        var glassGeom = new THREE.BoxGeometry(5, 5, 5);
        var glassMat = new THREE.MeshLambertMaterial({ color: Colors.BROWN });
        var glassR = new THREE.Mesh(glassGeom, glassMat);
        glassR.position.set(6, 0, 3);
        var glassL = glassR.clone();
        glassL.position.z = -glassR.position.z;
        var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
        var glassA = new THREE.Mesh(glassAGeom, glassMat);
        this.mesh.add(glassR);
        this.mesh.add(glassL);
        this.mesh.add(glassA);
        var earGeom = new THREE.BoxGeometry(2, 3, 2);
        var earL = new THREE.Mesh(earGeom, faceMat);
        earL.position.set(0, 0, -6);
        var earR = earL.clone();
        earR.position.set(0, 0, 6);
        this.mesh.add(earL);
        this.mesh.add(earR);
    }
    Pilot.prototype.update = function () {
        // get the hair
        var hairs = this.hairsTop.children;
        // update them according to the angle angleHairs
        var l = hairs.length;
        for (var i = 0; i < l; i++) {
            var h = hairs[i];
            // each hair element will scale on cyclical basis between 75% and 100% of its original size
            h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25;
        }
        // increment the angle for the next frame
        this.angleHairs += 0.16;
    };
    return Pilot;
}());
//# sourceMappingURL=game.js.map