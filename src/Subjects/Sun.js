import SimplexNoise from 'simplex-noise';
import * as THREE from 'three'
import song from '../assets/song.mp3'
import vertex from '../assets/libs/shaders/songVertex.glsl'
import fragment from '../assets/libs/shaders/Songfragment.glsl'
import { analyze } from 'web-audio-beat-detector';
import { getAverageVolume, mapVolumeToNoiseStrength, } from '../assets/libs/math';
import { FileLoader } from 'three';

const AUDIOSOBJECT = {
    paused: false,
    audioStartOffset: 0,
    audioStartTime: 0,
    audioBuffer: undefined,
    cameraPaused: false,
    automaticSwitchingOn: true,
    songBPM: null,
}


export default function Sun( scene, time )
{
    window.addEventListener( "dragenter", dragenter, false );
    window.addEventListener( "dragover", dragover, false );
    window.addEventListener( "drop", drop, false );


    const sound = new Audio( song )
    sound.play( )
    AUDIOSOBJECT.audioContext = new AudioContext( );
    AUDIOSOBJECT.audioAnalyser = AUDIOSOBJECT.audioContext.createAnalyser( );
    AUDIOSOBJECT.smoothingTimeCnstant = .3;
    AUDIOSOBJECT.fftSize = 1024;
    AUDIOSOBJECT.audioSourceBuffer = AUDIOSOBJECT.audioContext.createBufferSource( );
    AUDIOSOBJECT.audioSourceBuffer.connect( AUDIOSOBJECT.audioAnalyser )
    AUDIOSOBJECT.audioAnalyser.connect( AUDIOSOBJECT.audioContext.destination )

    // playAudio( song )

    const icosahedrongeometry = new THREE.IcosahedronGeometry( 5, 10 );
    const icosahedronMaterial = new THREE.ShaderMaterial(
    {
        uniforms:
        {
            time:
            {
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
        vertexShader: vertex,
        fragmentShader: fragment
    } );
    const mesh = new THREE.Mesh( icosahedrongeometry, icosahedronMaterial );
    scene.add( mesh );



    this.update = function( elapsedTime )
    {
        icosahedronMaterial.uniforms.time.value = elapsedTime
        if ( AUDIOSOBJECT.buffer != undefined )
        {
            const array = new Uint8Array( AUDIOSOBJECT.audioAnalyser.frequencyBitCount );
            AUDIOSOBJECT.audioAnalyser.getByteFrequencyData( array );
            const avg = getAverageVolume( array );
            const newNoise = mapVolumeToNoiseStrength( average );
            icosahedronMaterial.uniforms.noiseStrength.value = newNoise;
        }
        icosahedronMaterial.needsUpdate
        // console.log( AUDIOSOBJECT )
    }

    function createAndConnectAudioBuffer( )
    {
        // create the source buffer
        AUDIOSOBJECT.audioSourceBuffer = AUDIOSOBJECT.audioContext.createBufferSource( );
        // connect source and analyser
        AUDIOSOBJECT.audioSourceBuffer.connect( AUDIOSOBJECT.audioAnalyser );
        AUDIOSOBJECT.audioAnalyser.connect( AUDIOSOBJECT.audioContext.destination );
    }

    function playAudio( file )
    {
        AUDIOSOBJECT.file = file;
        console.log( file )
        createAndConnectAudioBuffer( )
        const fileReader = new FileReader( );

        fileReader.onload = function( e )
        {
            var fileResult = fileReader.result;
            AUDIOSOBJECT.audioContext.decodeAudioData( fileResult, function( buffer )
            {
                AUDIOSOBJECT.audioSourceBuffer.buffer = buffer;
                AUDIOSOBJECT.audioBuffer = buffer;
                AUDIOSOBJECT.audioSourceBuffer.start( );
                AUDIOSOBJECT.audioSourceBuffer.loop = true;
                analyze( AUDIOSOBJECT.audioSourceBuffer.buffer ).then( ( bpm ) =>
                    {
                        // the bpm could be analyzed 
                        AUDIOSOBJECT.songBPM = bpm;
                    } )
                    .catch( ( err ) =>
                    {
                        // something went wrong 
                        console.log( "couldn't detect BPM" );
                    } );
            }, function( e ) { "Error with decoding audio data" + e.err } );
        };
        fileReader.readAsArrayBuffer( AUDIOSOBJECT.audioFile );
    }



    function dragenter( e )
    {
        e.stopPropagation( );
        e.preventDefault( );
    }

    function dragover( e )
    {
        e.stopPropagation( );
        e.preventDefault( );
    }

    function drop( e )
    {
        console.log( e )
        e.stopPropagation( );
        e.preventDefault( );
        if ( AUDIOSOBJECT.audioFile == undefined )
        {
            playAudio( e.dataTransfer.files[ 0 ] );
        }
        else
        {
            // stop current visualization and load new song
            AUDIOSOBJECT.audioSourceBuffer.stop( );
            playAudio( e.dataTransfer.files[ 0 ] );
        }
    }
}