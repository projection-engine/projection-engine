enum Components {
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
    LIGHT_PROBE,
    TRANSFORMATION
}


enum AtmosphereTypes {
    MIE,
    RAYLEIGH,
    COMBINED
}

enum ColliderTypes {
    CAPSULE = "CAPSULE",
    SPHERE = "SPHERE",
    BOX = "BOX"
}


enum MaterialDataTypes {
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

enum EmbeddedMeshes {
    CUBE = "CUBE",
    SPHERE = "SPHERE",
    PLANE = "PLANE",
    CYLINDER = "CYLINDER"
}

enum Environment {
    EXECUTION,
    PRODUCTION,
    DEV
}

enum GLSLTypes {
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

enum ImageWorkerActions {
    IMAGE_BITMAP = "0",
    COLOR_TO_IMAGE = "1",
    RESIZE_IMAGE = "2",
    NOISE_DATA = "3",
    TARGET_ICON = "DEV"
}

enum LightTypes {
    DIRECTIONAL,
    SPOT,
    POINT,
    SPHERE,
    DISK,
    PLANE,
}

enum MaterialRenderingTypes {
    UNLIT,
    ISOTROPIC,
    ANISOTROPIC,
    SHEEN,
    CLEAR_COAT,
    TRANSPARENCY,
    SKY
}

enum ShadingModels {
    ALBEDO = 0,
    NORMAL = 1,
    TANGENT = 2,
    DEPTH = 3,
    AO = 4,
    DETAIL = 5,
    LIGHT_ONLY = 6,
    METALLIC = 7,
    ROUGHNESS = 8,
    G_AO = 9,
    AMBIENT = 10,
    POSITION = 11,
    UV = 12,
    RANDOM = 13,
    OVERDRAW = 14,
    LIGHT_COMPLEXITY = 15,
    LIGHT_QUANTITY = 16
}

enum WorkerMessages {
    REMOVE_ENTITY_BLOCK,
    INITIALIZE,
    REGISTER_ENTITY,
    REMOVE_ENTITY,
    ADD_BLOCK,
    HIERARCHY_CHANGE
}

enum TransformationRotationTypes {
    ROTATION_QUATERNION,
    ROTATION_EULER_XYZ,
    ROTATION_EULER_XZY,
    ROTATION_EULER_YXZ,
    ROTATION_EULER_YZX,
    ROTATION_EULER_ZXY,
    ROTATION_EULER_ZYX,
}

export {
    Components,
    AtmosphereTypes,
    ColliderTypes,
    MaterialDataTypes,
    EmbeddedMeshes,
    Environment,
    GLSLTypes,
    ImageWorkerActions,
    LightTypes,
    MaterialRenderingTypes,
    ShadingModels,
    WorkerMessages,
    TransformationRotationTypes,
}
