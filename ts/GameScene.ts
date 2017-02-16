class GameScene extends THREE.Scene{

    constructor(){
        super();
    }

    public generateFog(hex: number, near?: number, far?: number){
        this.fog = new THREE.Fog(hex, near, far);
    }
}