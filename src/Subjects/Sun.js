import SimplexNoise from 'simplex-noise';
import * as THREE from 'three'
import song from '../assets/song.mp3'
import v from '../assets/shaders/songVertex.glsl'
import f from '../assets/shaders/Songfragment.glsl'
import Framework from '../assets/libs/Audio';

export default function Sun( scene, time )
{

    const icosahedrongeometry = new THREE.IcosahedronGeometry( 1, 3 );
    const icosahedronMaterial = new THREE.ShaderMaterial(
    {
        uniforms:
        {
            time:
            { // Check the Three.JS documentation for the different allowed types and values
                type: "f",
                value: 0
            },
            noiseStrength:
            {
                type: "f",
                value: 2.0
            },
            numOctaves:
            {
                type: "f",
                value: 3
            },
            audioScale:
            {
                type: "f",
                value: 1
            }
        },
        vertexShader: v,
        fragmentShader: f
    } );
    const mesh = new THREE.Mesh( icosahedrongeometry, icosahedronMaterial );
    scene.add( mesh );
    const framework = new Framework( );


    this.update = function( )
    {
        icosahedronMaterial.uniforms.time.value = Date.now( ) - programStartTime;
        if ( framework.audioSourceBuffer.buffer != undefined )
        {
            var array = new Uint8Array( framework.audioAnalyser.frequencyBinCount );
            framework.audioAnalyser.getByteFrequencyData( array );
            var average = getAverageVolume( array );

            //console.log('VOLUME:' + average); //here's the volume
            var newNoiseStrength = mapVolumeToNoiseStrength( average );
            //console.log(newNoiseStrength);
            icosahedronMaterial.uniforms.noiseStrength.value = newNoiseStrength;

        }
        icosahedronMaterial.needsUpdate = true;
    }


    function timeIsOnBeat( framework, fraction )
    {
        var time = framework.audioContext.currentTime - framework.audioStartTime; // in seconds
        var divisor = ( framework.songBPM == undefined ) ? 120 : framework.songBPM;
        divisor = divisor / 60;
        divisor = divisor / fraction;
        var epsilon = 0.01;
        if ( time % divisor < epsilon )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}