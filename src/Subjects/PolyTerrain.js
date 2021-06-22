import * as THREE from 'three'
import { Float32BufferAttribute } from 'three';
import { getRandomArbitrary } from '../assets/libs/math';
import AudioManager from '../AudioManager';
import { getAverageVolume, mapVolumeToNoiseStrength, } from '../assets/libs/math';

const COUNT = 10000;
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
export default function Terrain( scene )
{
    let particles = [ ];
    let materials = [ ];
    const geometry = new THREE.BufferGeometry( );
    const positions = [ ];
    let color, size;

    for ( let i = 0; i < COUNT; i++ )
    {

        let x = getRandomArbitrary( -1000, 1000 );
        let y = getRandomArbitrary( -10, 10 );;
        let z = getRandomArbitrary( -1000, 1000 );
        // x < 100 && x > 100 ? x = 100 : x = x;
        // y < 100 && y > 100 ? y = 10 : y = y;
        // z < 100 && z > 100 ? z = 100 : z = z;
        positions.push( x, y, z );
    }
    geometry.setAttribute( 'position', new Float32BufferAttribute( new Float32Array( positions ), 3 ) );

    for ( let i = 0; i < PARAMATERS.length; i++ )
    {
        color = PARAMATERS[ i ][ 0 ];
        size = PARAMATERS[ i ][ 1 ];
        materials[ i ] = new THREE.PointsMaterial( { size: size } );
        particles = new THREE.Points( geometry, materials[ i ] );
        particles.rotation.x = Math.random( ) * 6;
        particles.rotation.y = Math.random( ) * 6;
        particles.rotation.z = Math.random( ) * 6;
        scene.add( particles );
    }
    const AUDIOSOBJECT = new AudioManager( );
    this.update = function( )
    {
        var time = Date.now( ) * 0.00005;

        for ( var i = 0; i < materials.length; i++ )
        {
            color = PARAMATERS[ i ][ 0 ];
            var h = color[ 0 ] + time * 2;
            materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );
        }
        if ( AUDIOSOBJECT.audioSourceBuffer.buffer != undefined )
        {
            var array = new Uint8Array( AUDIOSOBJECT.audioAnalyser.frequencyBinCount );
            AUDIOSOBJECT.audioAnalyser.getByteFrequencyData( array );
            for ( var i = 0; i < scene.children.length; i++ )
            {
                var object = scene.children[ i ];
                if ( object instanceof THREE.Points )
                {
                    object.rotation.y = time * ( i < 4 ? i + 1 : -( i + 1 ) );
                    var offset;
                    if ( offset < 100 )
                    {
                        offset = 1;
                    }
                    else
                    {
                        offset = getAverageVolume( array ) / 100;
                    }
                    object.scale.set( offset, offset, offset );
                }
            }
        }
    };
}