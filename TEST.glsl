//	Creative Commons CC0 1.0 Universal (CC-0)
//	
//	area lights based on Brian Karis's Siggraph 2013 presentation
//	http://blog.selfshadow.com/publications/s2013-shading-course/
//	
//	kind of pointless for a ray marched scene, but they work with rasterized stuff too.
//	I still need to do attenuation and some noodling. comments too, though everything's
//	in the course notes at the site above for anyone interested.
//	
//	raymarching code and anything else that looks well written courtesy of iq.
//	
//	~bj.2013

//#define DISABLE_ALBEDO
//#define DISABLE_NORMALS
//#define DISABLE_ROUGHNESS

float sphereRad;
vec3 spherePos;
float tubeRad;
vec3 tubeStart;
vec3 tubeEnd;

float specTrowbridgeReitz( float HoN, float a, float aP )
{
    float a2 = a * a;
    float aP2 = aP * aP;
    return ( a2 * aP2 ) / pow( HoN * HoN * ( a2 - 1.0 ) + 1.0, 2.0 );
}

float visSchlickSmithMod( float NoL, float NoV, float r )
{
    float k = pow( r * 0.5 + 0.5, 2.0 ) * 0.5;
    float l = NoL * ( 1.0 - k ) + k;
    float v = NoV * ( 1.0 - k ) + k;
    return 1.0 / ( 4.0 * l * v );
}

float fresSchlickSmith( float HoV, float f0 )
{
    return f0 + ( 1.0 - f0 ) * pow( 1.0 - HoV, 5.0 );
}

float sphereLight( vec3 pos, vec3 N, vec3 V, vec3 r, float f0, float roughness, float NoV, out float NoL )
{
    vec3 L				= spherePos - pos;
    vec3 centerToRay	= dot( L, r ) * r - L;
    vec3 closestPoint	= L + centerToRay * clamp( sphereRad / length( centerToRay ), 0.0, 1.0 );
    vec3 l				= normalize( closestPoint );
    vec3 h				= normalize( V + l );

    NoL				= clamp( dot( N, l ), 0.0, 1.0 );
    float HoN		= clamp( dot( h, N ), 0.0, 1.0 );
    float HoV		= dot( h, V );

    float distL		= length( L );
    float alpha		= roughness * roughness;
    float alphaPrime	= clamp( sphereRad / ( distL * 2.0 ) + alpha, 0.0, 1.0 );

    float specD		= specTrowbridgeReitz( HoN, alpha, alphaPrime );
    float specF		= fresSchlickSmith( HoV, f0 );
    float specV		= visSchlickSmithMod( NoL, NoV, roughness );

    return specD * specF * specV * NoL;
}

float tubeLight( vec3 pos, vec3 N, vec3 V, vec3 r, float f0, float roughness, float NoV, out float NoL )
{
    vec3 L0			= tubeStart - pos;
    vec3 L1			= tubeEnd - pos;
    float distL0	= length( L0 );
    float distL1	= length( L1 );

    float NoL0		= dot( L0, N ) / ( 2.0 * distL0 );
    float NoL1		= dot( L1, N ) / ( 2.0 * distL1 );
    NoL				= ( 2.0 * clamp( NoL0 + NoL1, 0.0, 1.0 ) )
    / ( distL0 * distL1 + dot( L0, L1 ) + 2.0 );

    vec3 Ld			= L1 - L0;
    float RoL0		= dot( r, L0 );
    float RoLd		= dot( r, Ld );
    float L0oLd 	= dot( L0, Ld );
    float distLd	= length( Ld );
    float t			= ( RoL0 * RoLd - L0oLd )
    / ( distLd * distLd - RoLd * RoLd );

    vec3 closestPoint	= L0 + Ld * clamp( t, 0.0, 1.0 );
    vec3 centerToRay	= dot( closestPoint, r ) * r - closestPoint;
    closestPoint		= closestPoint + centerToRay * clamp( tubeRad / length( centerToRay ), 0.0, 1.0 );
    vec3 l				= normalize( closestPoint );
    vec3 h				= normalize( V + l );

    float HoN		= clamp( dot( h, N ), 0.0, 1.0 );
    float HoV		= dot( h, V );

    float distLight	= length( closestPoint );
    float alpha		= roughness * roughness;
    float alphaPrime	= clamp( tubeRad / ( distLight * 2.0 ) + alpha, 0.0, 1.0 );

    float specD		= specTrowbridgeReitz( HoN, alpha, alphaPrime );
    float specF		= fresSchlickSmith( HoV, f0 );
    float specV		= visSchlickSmithMod( NoL, NoV, roughness );

    return specD * specF * specV * NoL;
}

vec3 areaLights( vec3 pos, vec3 nor, vec3 rd )
{
    float noise		=  texture( iChannel1, pos.xz ).x * 0.5;
    noise			+= texture( iChannel1, pos.xz * 0.5 ).y;
    noise			+= texture( iChannel1, pos.xz * 0.25 ).z * 2.0;
    noise			+= texture( iChannel1, pos.xz * 0.125 ).w * 4.0;

    vec3 albedo		= pow( texture( iChannel0, pos.xz ).xyz, vec3( 2.2 ) );
    albedo			= mix( albedo, albedo * 1.3, noise * 0.35 - 1.0 );
    float roughness = 0.7 - clamp( 0.5 - dot( albedo, albedo ), 0.05, 0.95 );
    float f0		= 0.3;

    #ifdef DISABLE_ALBEDO
    albedo			= vec3(0.1);
    #endif

    #ifdef DISABLE_ROUGHNESS
    roughness		= 0.05;
    #endif

    vec3 v			= -normalize( rd );
    float NoV		= clamp( dot( nor, v ), 0.0, 1.0 );
    vec3 r			= reflect( -v, nor );

    float NdotLSphere;
    float specSph	= sphereLight( pos, nor, v, r, f0, roughness, NoV, NdotLSphere );

    float NdotLTube;
    float specTube	= tubeLight( pos, nor, v, r, f0, roughness, NoV, NdotLTube );

    vec3 color		= albedo * 0.3183 * ( NdotLSphere + NdotLTube ) + specSph + specTube;
    return pow( color, vec3( 1.0 / 2.2 ) );
}

vec3 rotYaw( vec3 v, float a )
{
    float c = cos(a);
    float s = sin(a);
    return v * mat3( c, 0,-s,	0, 1, 0,	s, 0, c );
}

vec3 rotPitch( vec3 v, float a )
{
    float c = cos(a);
    float s = sin(a);
    return v * mat3( 1, 0, 0,	0, c,-s,	0, s, c );
}

void updateLights()
{
    sphereRad		= cos( iTime * 0.3 ) * 0.025 + 0.05;
    spherePos		= vec3( sin( iTime * 0.25 ), abs( cos( iTime ) * 0.25 ) + sphereRad, 0.0 );

    tubeRad			= sin( iTime * 0.1 ) * 0.005 + 0.01;
    vec3 tubePos	= vec3( 0.0, sin( iTime * 0.3 ) * 0.1 + 0.2, cos( iTime * 0.25 ) );

    vec3 tubeVec	= rotPitch(rotYaw(vec3(0,0,0.2), iTime*-1.5 ), cos( iTime*0.5 ) * 0.3 );

    tubeStart		= tubePos + tubeVec;
    tubeEnd			= tubePos - tubeVec;
}

//--------------------------------------------------------------------------
//	everything below here is based on iq's Raymarching - Primitives shader	
//	https://www.shadertoy.com/view/Xds3zN
//	
//--------------------------------------------------------------------------



// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// A list of usefull distance function to simple primitives, and an example on how to 
// do some interesting boolean operations, repetition and displacement.
//
// More info here: https://iquilezles.org/articles/distfunctions


vec2 map( in vec3 pos )
{
    vec2 sphere		= vec2( length( pos - spherePos ) - sphereRad, 2.0 );

    vec3 pa			= pos - tubeStart;
    vec3 ba			= tubeEnd - tubeStart;
    vec2 tube		= vec2( length( pa - ba * clamp( dot(pa,ba) / dot(ba,ba), 0.0, 1.0 ) ) - tubeRad, 2.0 );
    float bump		= 0.0;

    #ifndef DISABLE_NORMALS
    bump			= texture( iChannel0, pos.xz * 6.0 ).x * 0.002;
    #endif

    vec2 res		= vec2( pos.y + bump, 1.0 );
    res				= ( res.x < sphere.x ) ? res : sphere;
    res				= ( res.x < tube.x ) ? res : tube;

    return res;
}

vec2 castRay( in vec3 ro, in vec3 rd, in float maxd )
{
    float precis = 0.001;
    float h=precis*2.0;
    float t = 0.0;
    float m = -1.0;
    for( int i=0; i<60; i++ )
    {
        if( abs(h)<precis||t>maxd ) continue;//break;
        t += h;
        vec2 res = map( ro+rd*t );
        h = res.x;
        m = res.y;
    }

    if( t>maxd ) m=-1.0;
    return vec2( t, m );
}

vec3 calcNormal( in vec3 pos )
{
    vec3 eps = vec3( 0.001, 0.0, 0.0 );
    vec3 nor = vec3(
    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
    return normalize(nor);
}

vec3 render( in vec3 ro, in vec3 rd )
{
    vec3 col = vec3(0.0);
    vec2 res = castRay(ro,rd,20.0);
    if( res.y>-0.5 )
    {
        if( res.y == 2.0 )
        return vec3(1);

        vec3 pos = ro + res.x * rd;
        vec3 nor = calcNormal( pos );

        col = areaLights( pos, nor, rd );
    }
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 q = fragCoord.xy/iResolution.xy;
    vec2 p = -1.0+2.0*q;
    p.x *= iResolution.x/iResolution.y;

    float time = 15.0 + iTime*0.1;
    vec3 ro = vec3(1.2*cos(time),0.3+0.2*cos(time),1.2*sin(time));
    vec3 ta = vec3(0,0,0);

    vec3 cw = normalize( ta-ro );
    vec3 cp = vec3( 0.0, 1.0, 0.0 );
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv = normalize( cross(cu,cw) );
    vec3 rd = normalize( p.x*cu + p.y*cv + 2.5*cw );

    updateLights();
    vec3 col = render( ro, rd );

    fragColor=vec4( col, 1.0 );
}