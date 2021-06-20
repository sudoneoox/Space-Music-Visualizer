import { BoxBufferGeometry } from "three";

export default function Cube( )
{
    this.width = 1;
    this.height = 1;
    this.length = 1;
    const cubeBluePrint = new THREE.BoxBufferGeometry(
        new BoxBufferGeometry( this.width, this.height, this.length ),
        new THREE.MeshBasicMaterial( )
    );

}