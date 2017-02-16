class Sky{

    mesh:THREE.Object3D;
    numberOfClounds: number

    constructor(numberOfClounds:number, x?:number, y?:number, z?:number){

        // Create an empty container
	    this.mesh = new THREE.Object3D();
	
	    // choose a number of clouds to be scattered in the sky
	    this.numberOfClounds = numberOfClounds;
	
	    // To distribute the clouds consistently,
	    // we need to place them according to a uniform angle
	    var stepAngle = Math.PI*2 / this.numberOfClounds;
    
	    // create the clouds
	    for(var i=0; i<this.numberOfClounds; i++){
	    	var c = new Cloud();
        
	    	// set the rotation and the position of each cloud;
	    	// for that we use a bit of trigonometry
	    	var a = stepAngle*i; // this is the final angle of the cloud
	    	var h = 850 + Math.random(); // this is the distance between the center of the axis and the cloud itself

	    	// Trigonometry!!! I hope you remember what you've learned in Math :)
	    	// in case you don't: 
	    	// we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
	    	c.mesh.position.y = Math.sin(a)*h+200;
	    	c.mesh.position.x = Math.cos(a)*h;

	    	// rotate the cloud according to its position
	    	c.mesh.rotation.z = a + Math.PI/2;

	    	// for a better result, we position the clouds 
	    	// at random depths inside of the scene
	    	c.mesh.position.z = -400-Math.random()*400;
        
	    	// we also set a random scale for each cloud
	    	var s = 1+Math.random()*2;
	    	c.mesh.scale.set(s,s,s);

	    	// do not forget to add the mesh of each cloud in the scene
	    	this.mesh.add(c.mesh);  
	    }

        this.mesh.position.x = x!=undefined ? x:0;
        this.mesh.position.y = y!=undefined ? y:0;
        this.mesh.position.z = z!=undefined ? z:0;
    }

	public update(){
		this.mesh.rotation.z += .01;
	}
}