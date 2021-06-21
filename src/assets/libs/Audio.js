import { analyze } from 'web-audio-beat-detector';

// when the scene is done initializing, the function passed as `callback` will be executed
// then, every frame, the function passed as `update` will be executed
// export default function Framework( callback, update )
// {
//     //var gui = new DAT.GUI();

//     var framework = {
//         //gui: gui,
//         paused: false,
//         audioStartOffset: 0,
//         audioStartTime: 0,
//         audioBuffer: undefined,
//         cameraPaused: false,
//         automaticSwitchingOn: true,
//         audioSourceBuffer: null
//     };

//     function createAndConnectAudioBuffer( )
//     {
//         // create the source buffer
//         framework.audioSourceBuffer = framework.audioContext.createBufferSource( );
//         // connect source and analyser
//         framework.audioSourceBuffer.connect( framework.audioAnalyser );
//         framework.audioAnalyser.connect( framework.audioContext.destination );
//     }

//     this.playAudio = function( file )
//     {
//         createAndConnectAudioBuffer( );
//         framework.audioFile = file;

//         var fileName = framework.audioFile.name;
//         document.getElementById( 'guide' ).innerHTML = "Playing " + fileName;
//         var fileReader = new FileReader( );

//         fileReader.onload = function( e )
//         {
//             var fileResult = fileReader.result;
//             framework.audioContext.decodeAudioData( fileResult, function( buffer )
//             {
//                 framework.audioSourceBuffer.buffer = buffer;
//                 framework.audioBuffer = buffer;
//                 framework.audioSourceBuffer.start( );
//                 framework.audioSourceBuffer.loop = true;
//                 analyze( framework.audioSourceBuffer.buffer ).then( ( bpm ) =>
//                     {
//                         // the bpm could be analyzed 
//                         framework.songBPM = bpm;
//                     } )
//                     .catch( ( err ) =>
//                     {
//                         // something went wrong 
//                         console.log( "couldn't detect BPM" );
//                     } );
//             }, function( e ) { "Error with decoding audio data" + e.err } );
//         };
//         fileReader.readAsArrayBuffer( framework.audioFile );
//     }

//     // run this function after the window loads
//     window.addEventListener( 'load', function( )
//     {
//         // set up audio processing
//         framework.audioContext = new( window.AudioContext || window.webkitAudioContext )( );
//         // create analyser
//         framework.audioAnalyser = framework.audioContext.createAnalyser( );
//         framework.audioAnalyser.smoothingTimeConstant = 0.3;
//         framework.audioAnalyser.fftSize = 1024;
//         // create the source buffer
//         framework.audioSourceBuffer = framework.audioContext.createBufferSource( );

//         // connect source and analyser
//         framework.audioSourceBuffer.connect( framework.audioAnalyser );
//         framework.audioAnalyser.connect( framework.audioContext.destination );

//         // add drag and drop functionality for uploading audio file
//         window.addEventListener( "dragenter", dragenter, false );
//         window.addEventListener( "dragover", dragover, false );
//         window.addEventListener( "drop", drop, false );
//         // add pausing functionality via spacebar
//         window.addEventListener( "keypress", keypress, false );

//         function dragenter( e )
//         {
//             e.stopPropagation( );
//             e.preventDefault( );
//         }

//         function dragover( e )
//         {
//             e.stopPropagation( );
//             e.preventDefault( );
//         }

//         function drop( e )
//         {
//             e.stopPropagation( );
//             e.preventDefault( );
//             if ( framework.audioFile == undefined )
//             {
//                 playAudio( e.dataTransfer.files[ 0 ] );
//             }
//             else
//             {
//                 // stop current visualization and load new song
//                 framework.audioSourceBuffer.stop( );
//                 playAudio( e.dataTransfer.files[ 0 ] );
//             }
//         }


//         // assign THREE.js objects to the object we will return

//         this.updateframework = function( )
//         {
//             update( framework )
//         }

//         // we will pass the scene, gui, renderer, camera, etc... to the callback function
//         return callback( framework );
//     } );

// }