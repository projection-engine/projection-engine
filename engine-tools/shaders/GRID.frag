precision mediump float;
 
in vec3 worldPosition; 
in vec3 cameraPosition;
uniform sampler2D depthSampler;
uniform vec2 resolution;
out vec4 finalColor;
uniform vec4 settings;

vec2 quadUV;
// Thick lines 
float grid(float space, float gridWidth)
{
    vec2 p  = worldPosition.xz * settings.y - vec2(.5);
    vec2 size = vec2(gridWidth);
    
    vec2 a1 = mod(p - size, space);
    vec2 a2 = mod(p + size, space);
    vec2 a = a2 - a1;
       
    float g = min(a.x, a.y);
    return clamp(g, 0., 1.0);
}


void main() {
    quadUV = gl_FragCoord.xy/resolution;
    float color     = settings.x;
    float scale     = settings.y;
    float threshold = min(100., settings.z);
    float opacityScale   = clamp(settings.w/2., 0., 1.);
 
    float distanceFromCamera = length(cameraPosition - worldPosition);
    if(distanceFromCamera > threshold)
        discard;
    
    float depth = texture(depthSampler, quadUV).r;
    if(depth - gl_FragCoord.z <= .001 && depth > 0.) discard;
    
    float opacity = abs(distanceFromCamera - threshold) /((distanceFromCamera + threshold)/2.);
     
    float smallerGrid = grid(10., 0.2);
    float biggerGrid = grid(50., .4);
    float gridValue = clamp(biggerGrid * smallerGrid, color, 1.0); 
    if(gridValue != color)
            discard;
            
    float lineScale = .4/scale;
    float offset = .5/scale;
    float Z = worldPosition.z - offset;
    float X = worldPosition.x - offset;
      
    if(Z < lineScale && Z > -lineScale)
        finalColor = vec4(1., 0., 0., opacity * opacityScale);
    else if(X < lineScale && X > -lineScale)
        finalColor = vec4(0., 0., 1., opacity* opacityScale);
    else
        finalColor = vec4(vec3(gridValue), opacity * opacityScale);
}