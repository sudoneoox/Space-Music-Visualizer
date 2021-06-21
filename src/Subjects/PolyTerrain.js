import SimplexNoise from 'simplex-noise';
import * as THREE from 'three'


export default function Terrain( scene )
{
    const dimensions = { width: 1000, height: 1000 }
    const segments = 20;
    const vertices = segments + 1;
    const simplex = new SimplexNoise( 100 )
    const terrainGeometry = new THREE.PlaneBufferGeometry( dimensions.width, dimensions.height, segments, segments )
    const material = new THREE.MeshLambertMaterial( { side: THREE.FrontSide, wireframe: true } )
    terrainGeometry.rotateX( -Math.PI * .5 )
    const terrain = new THREE.Mesh( terrainGeometry, material )
    terrain.position.set( 0, -90, 0 )

    scene.add( terrain )

    this.update = function( )
    {
        return null
    }
}