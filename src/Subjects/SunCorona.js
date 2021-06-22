import * as THREE from 'three'
import { Float32BufferAttribute } from 'three';
import { getRandomArbitrary, getAverageVolume } from '../assets/libs/math';

const COUNT = 2500;
const PARAMATERS = [
    [
        [ 1, 1, 0.5 ], 5
    ],
    [
        [ 0.95, 1, 0.5 ], 4
    ],
    [
        [ 0.90, 1, 0.5 ], 3
    ],
    [
        [ 0.85, 1, 0.5 ], 2
    ],
    [
        [ 0.80, 1, 0.5 ], 1
    ]
]
export default function SunCorona( scene, AUDIOSOBJECT )
{
    let particles = [ ];
    let materials = [ ];
    const geometry = new THREE.BufferGeometry( );
    const positions = [ ];
    let color, size;

    for ( let i = 0; i < COUNT; i++ )
    {

        let x = getRandomArbitrary( -100, 100 );
        let y = getRandomArbitrary( -100, 100 );;
        let z = getRandomArbitrary( -100, 100 );
        positions.push( x, y, z );
    }
    geometry.setAttribute( 'position', new Float32BufferAttribute( new Float32Array( positions ), 3 ) );

    for ( let i = 0; i < PARAMATERS.length; i++ )
    {
        color = PARAMATERS[ i ][ 0 ];
        size = PARAMATERS[ i ][ 1 ];
        materials[ i ] = new THREE.PointsMaterial( { size: size, color: "#ffff00", transparent: true } );
        particles = new THREE.Points( geometry, materials[ i ] );
        particles.rotation.x = Math.random( ) * 6;
        particles.rotation.y = Math.random( ) * 6;
        particles.rotation.z = Math.random( ) * 6;
        scene.add( particles );
    }

    this.update = function( elapsedTime )
    {
        var time = elapsedTime
        if ( AUDIOSOBJECT.audioSourceBuffer.buffer != undefined )
        {
            var array = new Uint8Array( AUDIOSOBJECT.audioAnalyser.frequencyBinCount );
            AUDIOSOBJECT.audioAnalyser.getByteFrequencyData( array );
            for ( var i = 0; i < materials.length; i++ )
            {
                let object = scene.children[ i ];
                if ( object instanceof THREE.Points )
                {
                    object.rotation.y = time * ( i < 4 ? i + 1 : -( i + 1 ) );
                    let offset = ( getAverageVolume( array ) / 100 ) + 1;
                    object.scale.set( offset, offset, offset );
                }
                color = PARAMATERS[ i ][ 0 ];
                var h = color[ 0 ] + time * 2;
                materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );
            }
        }
    }
}