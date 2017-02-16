class AirPlaneCube {

    mesh: THREE.Object3D;
    propeller: THREE.Mesh;
	pilot: Pilot;

    constructor(x?:number, y?:number, z?:number){

        this.mesh = new THREE.Object3D();

        // Create the cabin
	    var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
	    var matCockpit = new THREE.MeshPhongMaterial({color:Colors.RED, shading:THREE.FlatShading});

		// we can access a specific vertex of a shape through 
		// the vertices array, and then move its x, y and z property:
		geomCockpit.vertices[4].y-=10;
		geomCockpit.vertices[4].z+=20;
		geomCockpit.vertices[5].y-=10;
		geomCockpit.vertices[5].z-=20;
		geomCockpit.vertices[6].y+=30;
		geomCockpit.vertices[6].z+=20;
		geomCockpit.vertices[7].y+=30;
		geomCockpit.vertices[7].z-=20;

	    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	    cockpit.castShadow = true;
	    cockpit.receiveShadow = true;
	    this.mesh.add(cockpit);
	
	    // Create the engine
	    var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
	    var matEngine = new THREE.MeshPhongMaterial({color:Colors.WHITE, shading:THREE.FlatShading});
	    var engine = new THREE.Mesh(geomEngine, matEngine);
	    engine.position.x = 40;
	    engine.castShadow = true;
	    engine.receiveShadow = true;
	    this.mesh.add(engine);
    
	    // Create the tail
	    var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	    var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.RED, shading:THREE.FlatShading});
	    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	    tailPlane.position.set(-35,25,0);
	    tailPlane.castShadow = true;
	    tailPlane.receiveShadow = true;
	    this.mesh.add(tailPlane);
    
	    // Create the wing
	    var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
	    var matSideWing = new THREE.MeshPhongMaterial({color:Colors.RED, shading:THREE.FlatShading});
	    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	    sideWing.castShadow = true;
	    sideWing.receiveShadow = true;
	    this.mesh.add(sideWing);
    
	    // propeller
	    var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
	    var matPropeller = new THREE.MeshPhongMaterial({color:Colors.BROWN, shading:THREE.FlatShading});
	    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	    this.propeller.castShadow = true;
	    this.propeller.receiveShadow = true;
    
	    // blades
	    var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
	    var matBlade = new THREE.MeshPhongMaterial({color:Colors.BRWONDARK, shading:THREE.FlatShading});
    
	    var blade = new THREE.Mesh(geomBlade, matBlade);
	    blade.position.set(8,0,0);
	    blade.castShadow = true;
	    blade.receiveShadow = true;
	    this.propeller.add(blade);
	    this.propeller.position.set(50,0,0);
	    this.mesh.add(this.propeller);

		this.pilot = new Pilot();
  		this.pilot.mesh.position.set(-10,27,0);
  		this.mesh.add(this.pilot.mesh);

        this.mesh.position.x = x!=undefined ? x:this.mesh.position.x ;
        this.mesh.position.y = y!=undefined ? y:this.mesh.position.y ;
        this.mesh.position.z = z!=undefined ? z:this.mesh.position.z ;
    }

    public update(currentMousePosition: Point){
       
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
    }

	private normalize(v,vmin,vmax,tmin, tmax){

		var nv = Math.max(Math.min(v,vmax), vmin);
		var dv = vmax-vmin;
		var pc = (nv-vmin)/dv;
		var dt = tmax-tmin;
		var tv = tmin + (pc*dt);
		return tv;

	}

    public get scale():THREE.Vector3{
        return this.mesh.scale
    }

}