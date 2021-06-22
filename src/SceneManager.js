import * as THREE from 'three'
import Stats from "stats.js";
import * as dat from 'dat.gui'
import SunCorona from "./Subjects/SunCorona";
import Sun from './Subjects/Sun'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import px from './assets/textures/px.jpg'
import nx from './assets/textures/nx.jpg'
import py from './assets/textures/py.jpg'
import ny from './assets/textures/ny.jpg'
import pz from './assets/textures/pz.jpg'
import nz from './assets/textures/nz.jpg'
import AudioManager from './AudioManager';
import { getRandomInt } from './assets/libs/math';
import { point } from 'cli-spinners';

export default function SceneManager( canvas )
{
    const clock = new THREE.Clock( );
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    };
    const scene = buildScene( );

    const renderer = buildRender( screenDimensions );
    const camera = buildCamera( screenDimensions );
    const controls = new OrbitControls( camera, canvas );
    controls.enableDamping = true;


    // Post Processing
    let renderTargetClass = null;
    if ( renderer.getPixelRatio( ) === 1 && renderer.capabilities.isWebGL2 )
    {
        renderTargetClass = THREE.WebGLMultisampleRenderTarget
        console.log( 'using WebGLMultisampleRenderTarget' );
    }
    else
    {
        renderTargetClass = THREE.WebGLRenderTarget
        console.log( 'using WebGLRenderTarget' );
    }
    const renderTarget = new renderTargetClass(
        800,
        600,
        {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            encoding: THREE.sRGBEncoding
        }
    );
    const shuffleComposer = [ ];


    const composer = new EffectComposer( renderer, renderTarget );
    composer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
    composer.setSize( screenDimensions.width, screenDimensions.height )

    const renderPass = new RenderPass( scene, camera );
    renderPass.enabled = true
    composer.addPass( renderPass );

    const glitchPass = new GlitchPass( )
    glitchPass.enabled = false
    composer.addPass( glitchPass )

    const afterImage = new AfterimagePass( )
    composer.addPass( afterImage );
    afterImage.enabled = false
    afterImage.uniforms[ 'damp' ].value = .7;

    const unrealBloomPass = new UnrealBloomPass( )
    unrealBloomPass.strength = 1.2;
    unrealBloomPass.radius = 0;
    unrealBloomPass.threshold = 0;
    unrealBloomPass.exposure = 1;
    unrealBloomPass.enabled = false;
    composer.addPass( unrealBloomPass );

    const rgbShiftPass = new ShaderPass( RGBShiftShader );
    rgbShiftPass.uniforms.amount.value = .5;
    rgbShiftPass.uniforms.tDiffuse.value = 10;
    rgbShiftPass.enabled = false;
    composer.addPass( rgbShiftPass );

    const dotScreenpass = new DotScreenPass( );
    dotScreenpass.enabled = false;
    composer.addPass( dotScreenpass )

    shuffleComposer.push( dotScreenpass, rgbShiftPass, unrealBloomPass, afterImage, glitchPass )

    // FPS panel
    const stats = new Stats( );
    document.body.appendChild( stats.dom );

    // GUI
    const gui = buildGui( );

    // handles all the audio
    const audioManager = new AudioManager( );
    // Components the scene has to take care of
    const sceneSubjects = createSceneSubjects( scene, gui, audioManager )

    function composerMagic( composerArray )
    {
        const randomInt = getRandomInt( 0, composerArray.length - 1 );
        composerArray[ randomInt ].enabled = true;
    }

    function disableCurrentComposer( )
    {
        for ( let i = 0; i < shuffleComposer.length; i++ )
        {
            shuffleComposer[ i ].enabled = false;
        }
    }

    window.setInterval( ( ) =>
    {
        disableCurrentComposer( )
        composerMagic( shuffleComposer )

    }, 5000 )

    function buildGui( )
    {
        const gui = new dat.GUI( );

        const rgb = gui.addFolder( "RGBSHIFTPASS" );
        rgb.add( rgbShiftPass, 'enabled' ).name( 'enable' )
        rgb.add( rgbShiftPass.uniforms.amount, 'value' ).min( 0 ).max( .5 ).step( .001 ).name( 'amount' )
        rgb.add( rgbShiftPass.uniforms.tDiffuse, 'value' ).min( 0 ).max( 10 ).step( .001 ).name( 'tDiffuse' )
        rgb.close( );

        const unrealFolder = gui.addFolder( 'UNREALBLOOMPASS' )
        unrealFolder.add( unrealBloomPass, 'enabled' ).name( 'enable' )
        unrealFolder.add( unrealBloomPass, 'strength' ).min( 0 ).max( 3 ).step( .001 );
        unrealFolder.add( unrealBloomPass, 'radius' ).min( 0 ).max( 1 ).step( .001 )
        unrealFolder.add( unrealBloomPass, 'threshold' ).min( 0 ).max( 1 ).step( .001 )
        unrealFolder.add( unrealBloomPass, 'exposure' ).min( 0 ).max( 2 ).step( .001 )
        unrealFolder.open( );

        const afterImageFolder = gui.addFolder( "AFTERIMAGEPASS" )
        afterImageFolder.add( afterImage, 'enabled' ).name( 'enable' )
        afterImageFolder.add( afterImage.uniforms[ 'damp' ], 'value' ).min( 0 ).max( 2 ).step( .001 );
        afterImageFolder.close( );

        const glitchpassFolder = gui.addFolder( 'GLITCHPASS' )
        glitchpassFolder.add( glitchPass, 'enabled' ).name( 'GLITCHPASS' )
        glitchpassFolder.add( glitchPass, 'goWild' ).name( 'goWild' )
        glitchpassFolder.close( );

        const dotscreenFolder = gui.addFolder( 'DOTSCREENPASS' )
        dotscreenFolder.add( dotScreenpass, 'enabled' ).name( 'DOTSCREENPASS' )
        dotscreenFolder.add( dotScreenpass.uniforms.scale, 'value' ).min( 0 ).max( 2 ).name( 'scale' )
        dotscreenFolder.close( );

        gui.hide( );
        return gui;
    }

    function buildScene( )
    {
        const scene = new THREE.Scene( );

        const cubeTextureLoader = new THREE.CubeTextureLoader( )
        const environmentMap = cubeTextureLoader.load( [ px, nx, py, ny, pz, nz ] )
        // ( ) => console.log( 'worked' ), ( ) => console.log( 'working on it' ), ( e ) => console.log( 'error', e ) )

        environmentMap.encoding = THREE.sRGBEncoding;
        scene.background = environmentMap
        scene.environment = environmentMap
        return scene;
    }

    function buildRender( { width, height } )
    {
        const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
        renderer.outputEncoding = THREE.sRGBEncoding;

        const DPR = Math.min( devicePixelRatio, 2 )
        renderer.setPixelRatio( DPR );
        renderer.setSize( width, height );
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.5;
        return renderer;
    }

    function buildCamera( { width, height } )
    {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = .01;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );
        camera.position.set( 0, 200, 200 )

        return camera;
    }

    function createSceneSubjects( scene, gui, audioManager )
    {
        const sceneSubjects = [
            new SunCorona( scene, audioManager ),
            new Sun( scene, gui, audioManager )
        ];
        return sceneSubjects;
    }

    this.update = function( )
    {
        stats.begin( );
        const elapsedTime = clock.getElapsedTime( );
        for ( let i = 0; i < sceneSubjects.length; i++ )
        {
            sceneSubjects[ i ].update( elapsedTime );
        }
        camera.position.x += Math.sin( elapsedTime ) * 4;
        camera.position.z += Math.cos( elapsedTime ) * 4;
        controls.update( )
        if ( rgbShiftPass.enabled )
        {
            rgbShiftPass.uniforms.angle.value = elapsedTime * .3;
        }
        composer.render( );
        stats.end( )
    }

    this.onWindowResize = function( )
    {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix( );

        composer.setSize( width, height )
        renderer.setSize( width, height );
    }
}