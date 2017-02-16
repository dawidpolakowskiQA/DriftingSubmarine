class Sea{

    mesh: THREE.Mesh;

    constructor(x?:number, y?:number, z?:number){
        // create the geometry (shape) of the cylinder;
	    // the parameters are: 
	    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
        let geom = new THREE.CylinderGeometry(600,600,800,40,10);
        
        // rotate the geometry on the x axis
	    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

        // create the material 
	    var mat = new THREE.MeshPhongMaterial({
		    color: Colors.BLUE,
		    transparent:true,
		    opacity:.6,
		    shading:THREE.FlatShading,
	    });

        // To create an object in Three.js, we have to create a mesh 
	    // which is a combination of a geometry and some material
	    this.mesh = new THREE.Mesh(geom, mat);

	    // Allow the sea to receive shadows
	    this.mesh.receiveShadow = true; 

        this.mesh.position.x = x!=undefined ? x:0;
        this.mesh.position.y = y!=undefined ? y:0;
        this.mesh.position.z = z!=undefined ? z:0;
    }

	public update(){
		this.mesh.rotation.z += .005;
	}
}