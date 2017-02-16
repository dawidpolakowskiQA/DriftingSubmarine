var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AirPlaneSimple = (function () {
    function AirPlaneSimple(x, y, z) {
        this.mesh = new THREE.Object3D();
        // Create the cabin
        var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
        var matCockpit = new THREE.MeshPhongMaterial({ color: Colors.RED, shading: THREE.FlatShading });
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
        this.mesh.position.x = x != undefined ? x : this.mesh.position.x;
        this.mesh.position.y = y != undefined ? y : this.mesh.position.y;
        this.mesh.position.z = z != undefined ? z : this.mesh.position.z;
    }
    AirPlaneSimple.prototype.update = function (currentMousePosition) {
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
    };
    AirPlaneSimple.prototype.normalize = function (v, vmin, vmax, tmin, tmax) {
        var nv = Math.max(Math.min(v, vmax), vmin);
        var dv = vmax - vmin;
        var pc = (nv - vmin) / dv;
        var dt = tmax - tmin;
        var tv = tmin + (pc * dt);
        return tv;
    };
    Object.defineProperty(AirPlaneSimple.prototype, "scale", {
        get: function () {
            return this.mesh.scale;
        },
        enumerable: true,
        configurable: true
    });
    return AirPlaneSimple;
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
        // create the geometry (shape) of the cylinder;
        // the parameters are: 
        // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
        var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
        // rotate the geometry on the x axis
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        // create the material 
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.BLUE,
            transparent: true,
            opacity: .6,
            shading: THREE.FlatShading,
        });
        // To create an object in Three.js, we have to create a mesh 
        // which is a combination of a geometry and some material
        this.mesh = new THREE.Mesh(geom, mat);
        // Allow the sea to receive shadows
        this.mesh.receiveShadow = true;
        this.mesh.position.x = x != undefined ? x : 0;
        this.mesh.position.y = y != undefined ? y : 0;
        this.mesh.position.z = z != undefined ? z : 0;
    }
    Sea.prototype.update = function () {
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
            c.mesh.position.y = Math.sin(a) * h + 200;
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
/// <reference path="AirPlaneSimple.ts"/>
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
        this.airplane = new AirPlaneSimple(0, 100);
        this.airplane.scale.set(.15, .15, .15);
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
//# sourceMappingURL=game.js.map