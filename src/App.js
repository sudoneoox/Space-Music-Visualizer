import SceneManager from './SceneManager.js';
import NotesGenerator from './Helpers/Audio/Audio.js'

const canvas = document.querySelector( '#webgl' )

const sceneManager = new SceneManager( canvas )
bindEventListensers( )
render( )


function bindEventListensers( )
{
    window.onresize = resizeCanvas;
    resizeCanvas( )
}

function resizeCanvas( )
{
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize( );
}

function render( )
{
    requestAnimationFrame( render );
    sceneManager.update( );
}


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