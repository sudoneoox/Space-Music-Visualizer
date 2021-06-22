import { analyze } from 'web-audio-beat-detector';
export default function AudioManager( )
{
    const AUDIOSOBJECT = {
        paused: false,
        audioStartOffset: 0,
        audioStartTime: 0,
        audioBuffer: undefined,
        cameraPaused: false,
        automaticSwitchingOn: true,
        songBPM: null,
        audioBuffer: null,
        audioAnalyser: null,
        audioContext: null,
        audioSourceBuffer: null,
        songBPM: null,
        fftSize: null,
        smoothingTimeCnstant: null,
    };

    AUDIOSOBJECT.audioContext = new( window.AudioContext || window.webkitAudioContext )( );
    AUDIOSOBJECT.audioAnalyser = AUDIOSOBJECT.audioContext.createAnalyser( );
    AUDIOSOBJECT.smoothingTimeCnstant = .3;
    AUDIOSOBJECT.fftSize = 1024;
    AUDIOSOBJECT.audioSourceBuffer = AUDIOSOBJECT.audioContext.createBufferSource( );
    AUDIOSOBJECT.audioSourceBuffer.connect( AUDIOSOBJECT.audioAnalyser );
    AUDIOSOBJECT.audioAnalyser.connect( AUDIOSOBJECT.audioContext.destination );

    function handleFileSelect( evt )
    {
        let files = evt.target.files
        playFile( files[ 0 ] )
    }

    function playFile( file )
    {
        var freader = new FileReader( );
        AUDIOSOBJECT.audioSourceBuffer = AUDIOSOBJECT.audioContext.createBufferSource( );
        // connect source and analyser
        AUDIOSOBJECT.audioSourceBuffer.connect( AUDIOSOBJECT.audioAnalyser );
        AUDIOSOBJECT.audioAnalyser.connect( AUDIOSOBJECT.audioContext.destination );

        freader.onload = function( e )
        {
            const fileResult = e.target.result;
            console.log( fileResult );
            AUDIOSOBJECT.audioContext.decodeAudioData( fileResult, function( buffer )
            {
                AUDIOSOBJECT.audioSourceBuffer.buffer = buffer;
                AUDIOSOBJECT.audioBuffer = buffer;
                AUDIOSOBJECT.audioSourceBuffer.start( );
                AUDIOSOBJECT.audioSourceBuffer.loop = true;
                console.log( AUDIOSOBJECT )
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
            }, function( e ) { "Error with decoding audio data" + e.err; } );
        };
        freader.readAsArrayBuffer( file );
        const texttochange = document.querySelector( '#top' );
        texttochange.innerHTML = 'Press H for even more fun!'
        const fileinput = document.querySelector( '#filemp3' )
        fileinput.style.visibility = "hidden";
        texttochange.style.top = "95.5%"
        texttochange.style.color = "#ff00ff"
    }

    document.getElementById( 'filemp3' ).addEventListener( 'change', handleFileSelect, false );
    return AUDIOSOBJECT;
}