import { PointLight, AmbientLight } from "three";

export default function GeneralLights( scene )
{
    // color 2222ff
    const pointLight = new PointLight( "#ffffff", 1 );
    pointLight.position.set( 0, 40, 0 )
    const ambientLight = new AmbientLight( '#ffff00', .1 )
    scene.add( ambientLight )
    scene.add( pointLight );

    this.update = function( time )
    {
        pointLight.intensity = ( Math.sin( time ) + 1.5 ) / 1.5;
        pointLight.color.setHSL( Math.sin( time ), 0.5, 0.5 );
    }
}