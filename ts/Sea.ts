class Sea{

    mesh: THREE.Mesh;
	waves:any[];

    constructor(x?:number, y?:number, z?:number){
        var geom = new THREE.CylinderGeometry(600,600,800,40,10);
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	// important: by merging vertices we ensure the continuity of the waves
	geom.mergeVertices();

	// get the vertices
	var l = geom.vertices.length;

	// create an array to store new data associated to each vertex
	this.waves = new Array();

	for (var i=0; i<l; i++){
		// get each vertex
		var v = geom.vertices[i];

		// store some data associated to it
		this.waves.push({y:v.y,
										 x:v.x,
										 z:v.z,
										 // a random angle
										 ang:Math.random()*Math.PI*2,
										 // a random distance
										 amp:5 + Math.random()*15,
										 // a random speed between 0.016 and 0.048 radians / frame
										 speed:0.016 + Math.random()*0.032
										});
	};
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.BLUE,
		transparent:true,
		opacity:.8,
		shading:THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;

        this.mesh.position.x = x!=undefined ? x:0;
        this.mesh.position.y = y!=undefined ? y:0;
        this.mesh.position.z = z!=undefined ? z:0;
    }

	public update(){
		// get the vertices
		var verts = (<THREE.PolyhedronGeometry>this.mesh.geometry).vertices;
		var l = verts.length;

		for (var i=0; i<l; i++){
			var v = verts[i];

			// get the data associated to it
			var vprops = this.waves[i];

			// update the position of the vertex
			v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
			v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

			// increment the angle for the next frame
			vprops.ang += vprops.speed;

		}

		// Tell the renderer that the geometry of the sea has changed.
		// In fact, in order to maintain the best level of performance, 
		// three.js caches the geometries and ignores any changes
		// unless we add this line
		(<THREE.PolyhedronGeometry>this.mesh.geometry).verticesNeedUpdate=true;

		this.mesh.rotation.z += .005;
	}
}