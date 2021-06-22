import * as THREE from 'three'
import vertex from '../assets/libs/shaders/song/songVertex.glsl'
import fragment from '../assets/libs/shaders/song/Songfragment.glsl'
import { getAverageVolume, mapVolumeToNoiseStrength, } from '../assets/libs/math';


export default function Sun( scene, gui, AUDIOSOBJECT )
{
    const multiplier = {
        value: .25,
    }
    const sun = gui.addFolder( 'SUN' )
    sun.add( multiplier, 'value' ).min( .1 ).max( .6 ).step( .001 ).name( 'SoundMultiplier' )

    const programStartTime = Date.now( );
    const icosahedrongeometry = new THREE.IcosahedronGeometry( 5, 8 );
    const icosahedronMaterial = new THREE.ShaderMaterial(
    {
        wireframe: false,
        uniforms:
        {
            uResolution: { value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
            time: { value: Date.now( ) },
            noiseStrength: { value: 2.0 },
            numOctaves: { value: 3.0 },
            audioScale: { value: 1.0 }
        },
        vertexShader: vertex,
        fragmentShader: fragment
    } );
    const mesh = new THREE.Mesh( icosahedrongeometry, icosahedronMaterial );
    mesh.scale.set( 10, 10, 10 )
    scene.add( mesh );

    // const AUDIOSOBJECT = new AudioManager( )
    // const AUDIOSOBJECT = 0;

    this.update = function( )
    {
        icosahedronMaterial.uniforms.time.value = Date.now( ) - programStartTime;
        if ( AUDIOSOBJECT.audioBuffer != undefined )
        {
            const array = new Uint8Array( AUDIOSOBJECT.audioAnalyser.frequencyBinCount );
            AUDIOSOBJECT.audioAnalyser.getByteFrequencyData( array );
            const average = getAverageVolume( array );
            const newNoise = mapVolumeToNoiseStrength( average );
            icosahedronMaterial.uniforms.noiseStrength.value = newNoise * multiplier.value;
        }
        icosahedronMaterial.needsUpdate;
    }

}