export function fractionate( val, minVal, maxVal )
{
    return ( val - minVal ) / ( maxVal - minVal );
}
export function modulate( val, minVal, maxVal, outMin, outMax )
{
    var fr = fractionate( val, minVal, maxVal );
    var delta = outMax - outMin;
    return outMin + ( fr * delta );
}
export function avg( arr )
{
    var total = arr.reduce( function( sum, b ) { return sum + b; } );
    return ( total / arr.length );
}
export function max( arr )
{
    return arr.reduce( function( a, b ) { return Math.max( a, b ); } )
}
export function getRandomInt( min, max )
{
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random( ) * ( max - min ) ) + min;
}
export function getRandomArbitrary( min, max )
{
    return Math.random( ) * ( max - min ) + min;
}
export let tanh = Math.tanh || function tanh( x )
{
    return ( Math.exp( x ) - Math.exp( -x ) ) / ( Math.exp( x ) + Math.exp( -x ) );
};
export let cosh = Math.cosh || function cosh( x )
{
    return ( Math.exp( x ) + Math.exp( -x ) ) / 2;
};
export let sinh = Math.sinh || function sinh( x )
{
    return ( Math.exp( x ) - Math.exp( -x ) ) / 2;
};
export function getAverageVolume( array )
{
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for ( var i = 0; i < length; i++ )
    {
        values += array[ i ];
    }

    average = values / length;
    return average;
}
export function mapVolumeToNoiseStrength( vol )
{
    // map range from 0 -> 150 to 4 -> 1
    var result = vol / 150 * ( 1 - 4 ) + 4;
    return result;
}

export const e = 2.7181718