import SceneManager from './SceneManager.js';


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