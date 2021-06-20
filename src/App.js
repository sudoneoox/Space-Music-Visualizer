import SceneManager from './Components/SceneManager/SceneManager';
import NotesGenerator from './Components/Audio/Audio'

const canvas = document.querySelector( '#webgl' )

var sceneManager = new SceneManager( canvas );

function render( time )
{
    requestAnimationFrame( render );
    sceneManager.update( );
}

render( )

function resizeCanvas( ) { sceneManager ? sceneManager.onWindowResize : null }



function TuneGenerator( )
{
    const notesGenerator = new NotesGenerator( );
    setInterval( function( )
    {
        notesGenerator.playNote( 3 );
    }, 800 );

    setInterval( function( )
    {
        notesGenerator.playNote( 0 );
    }, 4200 );
}
TuneGenerator( );