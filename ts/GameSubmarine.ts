/// <reference path="../threeLib/three.d.ts" />
/// <reference path="AirPlaneCube.ts"/>
/// <reference path="Sea.ts"/>
/// <reference path="Sky.ts"/>
/// <reference path="Point.ts"/>

class Game {

    scene : GameScene
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer
    width: number;
    height: number;

    gameContainer:any;

    sea: Sea;
    sky: Sky;
    airplane: AirPlaneCube;

    currentMousePosition: Point;


    constructor(){
        this.currentMousePosition = new Point();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer();

        this.createLights();

        this.airplane = new AirPlaneCube(0,100);
        this.airplane.scale.set(.22,.22,.22);

        this.sea = new Sea(0,-600);
        this.sky = new Sky(25,0,-600);

        this.scene.add(this.airplane.mesh);
        this.scene.add(this.sea.mesh);
        this.scene.add(this.sky.mesh)

        // Add the DOM element of the renderer to the 
	    // container we created in the HTML
	    this.gameContainer = document.getElementById('world');
	    this.gameContainer.appendChild(this.renderer.domElement);

        this.update();
    }

    update = () => {
      // Rotate the propeller, the sea and the sky
	    this.airplane.update(this.currentMousePosition);
	    this.sea.update();
	    this.sky.update();

	    // render the scene
	    this.renderer.render(this.scene, this.camera);

	    // call the loop function again
      requestAnimationFrame(this.update);
   }   

   public handleMouseMove(event:any){
        // here we are converting the mouse position value received 
	    // to a normalized value varying between -1 and 1;
	    // this is the formula for the horizontal axis:
    
	    this.currentMousePosition.x =  -1 + (event.clientX / this.width)*2;

	    // for the vertical axis, we need to inverse the formula 
	    // because the 2D y-axis goes the opposite direction of the 3D y-axis
    
	    this.currentMousePosition.y = 1 - (event.clientY / this.height)*2;
   }

    public handleWindowResize(){
        // update height and width of the renderer and the camera
	    this.height = window.innerHeight;
	    this.width= window.innerWidth;
	    this.renderer.setSize(this.width , this.height);
	    this.camera.aspect = this.width  / this.height;
	    this.camera.updateProjectionMatrix();
    }

    private createScene():GameScene {
        //Create the scene and add fog effect
        let scene = new GameScene();
        scene.generateFog(0xf7d9aa, 100, 950);

        return scene;
    }

    private createCamera(): THREE.PerspectiveCamera{
         // Create the camera
        let acceptRatio = this.width / this.height;
        let fieldOfView = 60;
        let nearPlane = 1;
        let farPlane = 10000;

        let camera = new THREE.PerspectiveCamera( fieldOfView, acceptRatio,nearPlane, farPlane);
        camera.position.x = 0;
        camera.position.z = 200;
        camera.position.y = 100;

        return camera;
    }

    private createRenderer() : THREE.WebGLRenderer{
        let renderer = new THREE.WebGLRenderer({ 
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
    }

    private createLights(){
	    // A hemisphere light is a gradient colored light; 
	    // the first parameter is the sky color, the second parameter is the ground color, 
	    // the third parameter is the intensity of the light
	    let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
    
	    // A directional light shines from a specific direction. 
	    // It acts like the sun, that means that all the rays produced are parallel. 
	    let shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	    // Set the direction of the light  
	    shadowLight.position.set(150, 350, 350);
    
	    // Allow shadow casting 
	    shadowLight.castShadow = true;

	    // define the visible area of the projected shadow
	    (<THREE.OrthographicCamera>shadowLight.shadow.camera).left = -400;
	    (<THREE.OrthographicCamera>shadowLight.shadow.camera).right = 400;
	    (<THREE.OrthographicCamera>shadowLight.shadow.camera).top = 400;
	    (<THREE.OrthographicCamera>shadowLight.shadow.camera).bottom = -400;
	    (<THREE.OrthographicCamera>shadowLight.shadow.camera).near = 1;
	    (<THREE.OrthographicCamera>shadowLight.shadow.camera).far = 1000;

	    // define the resolution of the shadow; the higher the better, 
	    // but also the more expensive and less performant
	    shadowLight.shadow.mapSize.width = 2048;
	    shadowLight.shadow.mapSize.height = 2048;
    
	    // to activate the lights, just add them to the scene
	    this.scene.add(hemisphereLight);  
	    this.scene.add(shadowLight);
    }

}


window.addEventListener('load', init, false);

var game;

function init(){
    game = new Game();

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', game.handleWindowResize, false);

    //add the listener
    document.addEventListener('mousemove', this.handleMouseMove, false);
}

function handleMouseMove(event){
    game.handleMouseMove(event);
}