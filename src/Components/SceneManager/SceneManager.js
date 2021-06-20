import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// TODO import box from objects/box


const sizes = { width: window.innerWidth, height: window.innerHeight };

export default function SceneManager( canvas )
{
    const clock = new THREE.Clock( );
    const scene = new THREE.Scene( );
    scene.background = new THREE.Color( "#000000" );
    scene.fog = new THREE.Fog( "#990099", 1, 4000 )

    const renderer = buildRender( sizes.width, sizes.height );
    const camera = buildCamera( sizes.width, sizes.height );
    const light = buildLights( scene );
    const controls = new OrbitControls( camera, canvas )
    const sceneSubjects = [ ];
    // TODO: sceneSubjects.push(box) 


    function buildRender( width, height )
    {
        let renderer = new THREE.WebGLRenderer( { canvas, antialias: true, alpha: true } );
        let DPR = Math.min( window.devicePixelRatio, 2 );
        renderer.setPixelRatio( DPR );
        renderer.setSize( width, height );

        renderer.gammaInput = true
        renderer.gammaOutput = true;

        return renderer;
    }


    function buildCamera( width, height )
    {
        let aspectRatio = width / height;
        let fieldOfView = 60;
        let nearPlane = 5;
        let farPlane = 10000;
        let camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );

        return camera;
    }

    function buildLights( scene )
    {
        let light = new THREE.SpotLight( "#2222ff", 1 );
        light.position.set( -1400, 700, 0 )


        light.decay = 2;
        light.penumbra = 1;
        scene.add( light );

        return light;
    }

    this.update = function( )
    {

        //TODO: for (const i of scene.objects) {
        //     sceneSubjects[i].update(clock.getElapsedTime())
        // }
        controls.update( )
        renderer.render( scene, camera );
    }

    this.onWindowResize = function( )
    {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight

        camera.aspect = width / height;
        camera.updateProjectionMatrix( );

        renderer.setSize( width, height );
        renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
    }
}