declare enum Components {
    MESH,
    CAMERA,
    ATMOSPHERE,
    SPRITE,
    PHYSICS_COLLIDER,
    DECAL,
    RIGID_BODY,
    CULLING,
    UI,
    TERRAIN,
    LIGHT,
    LIGHT_PROBE
}

declare enum GLSLTypes {
    vec2 = "uniform2fv",
    vec3 = "uniform3fv",
    vec4 = "uniform4fv",
    mat3 = "uniformMatrix3fv",
    mat4 = "uniformMatrix4fv",
    float = "uniform1f",
    int = "uniform1i",
    sampler2D = "sampler2D",
    samplerCube = "cubemap",
    ivec2 = "uniform2iv",
    ivec3 = "uniform3iv",
    bool = "uniform1i"
}

declare enum AtmosphereTypes {
    MIE,
    RAYLEIGH,
    COMBINED
}

declare enum ColliderTypes {
    CAPSULE = "CAPSULE",
    SPHERE = "SPHERE",
    BOX = "BOX"
}


declare enum MaterialDataTypes {
    OPTIONS = "OPTIONS",
    CHECKBOX = "CHECKBOX",
    TEXTURE = "sampler2D",
    COLOR = "2",
    STRING = "4",
    ANY = "13",
    KEY = "16",


    FLOAT = "float",
    INT = "int",

    VEC2 = "vec2",
    VEC3 = "vec3",
    VEC4 = "vec4",
    MAT3 = "mat3",
    MAT4 = "mat4",
    BOOL = "bool",
    UNDEFINED = "-1"
}

declare enum EmbeddedMeshes {
    CUBE = "CUBE",
    SPHERE = "SPHERE",
    PLANE = "PLANE",
    CYLINDER = "CYLINDER"
}

declare enum Enviroment {
    EXECUTION,
    PRODUCTION,
    DEV
}

declare enum GLSLTypes {
    vec2 = "uniform2fv",
    vec3 = "uniform3fv",
    vec4 = "uniform4fv",
    mat3 = "uniformMatrix3fv",
    mat4 = "uniformMatrix4fv",
    float = "uniform1f",
    int = "uniform1i",
    sampler2D = "sampler2D",
    samplerCube = "cubemap",
    ivec2 = "uniform2iv",
    ivec3 = "uniform3iv",
    bool = "uniform1i"
}

declare enum ImageWorkerActions {
    IMAGE_BITMAP = "0",
    COLOR_TO_IMAGE = "1",
    RESIZE_IMAGE = "2",
    NOISE_DATA = "3",
    TARGET_ICON = "DEV"
}

declare enum LightTypes {
    DIRECTIONAL,
    SPOT,
    POINT,
    SPHERE,
    DISK,
    PLANE,
}

declare enum MaterialRenderingTypes {
    UNLIT,
    ISOTROPIC,
    ANISOTROPIC,
    SHEEN,
    CLEAR_COAT,
    TRANSPARENCY,
    SKY
}

declare enum ShadingModels {
    ALBEDO,
    NORMAL,
    DEPTH,
    AO,
    DETAIL,
    LIGHT_ONLY,
    METALLIC,
    ROUGHNESS,
    G_AO,
    AMBIENT,
    POSITION,
    UV,
    RANDOM,
    OVERDRAW,
    LIGHT_COMPLEXITY,
    LIGHT_QUANTITY,
}

declare enum WorkerMessages {
    REMOVE_ENTITY_BLOCK,
    INITIALIZE,
    REGISTER_ENTITY,
    REMOVE_ENTITY,
    ADD_BLOCK
}
