import GeneralLights from "./Subjects/GeneralLights";
import SceneSubject from "./Subjects/SceneSubject";
import Terrain from "./Subjects/PolyTerrain";
import Sun from './Subjects/Sun'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three'
import Stats from "stats.js";

export default function SceneManager( canvas )
{

    const clock = new THREE.Clock( );

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const scene = buildScene( );
    const renderer = buildRender( screenDimensions );
    const camera = buildCamera( screenDimensions );
    const controls = new OrbitControls( camera, canvas )
    const sceneSubjects = createSceneSubjects( scene );
    const stats = new Stats( );
    document.body.appendChild( stats.dom )

    function buildScene( )
    {
        const scene = new THREE.Scene( );
        scene.background = new THREE.Color( "#000" );

        return scene;
    }

    function buildRender( { width, height } )
    {
        const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
        const DPR = Math.min( devicePixelRatio, 2 )
        renderer.setPixelRatio( DPR );
        renderer.setSize( width, height );

        return renderer;
    }

    function buildCamera( { width, height } )
    {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = .01;
        const farPlane = 1000;
        const camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );
        camera.position.set( 0, 40, 10 )

        return camera;
    }

    function createSceneSubjects( scene )
    {
        const sceneSubjects = [
            new GeneralLights( scene ),
            new SceneSubject( scene ),
            new Terrain( scene ),
            // new Sun( scene )
        ];

        return sceneSubjects;
    }

    this.update = function( )
    {
        stats.begin( );
        const elapsedTime = clock.getElapsedTime( );

        for ( let i = 0; i < sceneSubjects.length; i++ )
            sceneSubjects[ i ].update( elapsedTime );

        controls.update( )
        renderer.render( scene, camera );
        stats.end( )
    }

    this.onWindowResize = function( )
    {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix( );

        renderer.setSize( width, height );
    }
}