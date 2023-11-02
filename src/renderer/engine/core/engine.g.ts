type EngineEntity = `${string}-${string}-${string}-${string}-${string}`

interface TerrainProcessorResult {
    vertices: Float32Array;
    uvs: Float32Array;
    normals: Float32Array;
    indices: Float32Array;
    tangents: Float32Array
}

interface IComponent {
}

interface IResource {
}

interface FBOTexture {
    [key: string]: any,

    w?: number,
    h?: number,
    attachment?: number,
    precision?: number,
    format?: number,
    type?: number,
    linear?: boolean,
    repeat?: boolean

}

interface EntityListenerOptions {
    once?: boolean,
    targetEntityId?: string,
    targetComponent?: string
}

interface EntityListenerEvent<T, R> {
    target?: T,
    all?: T[],
    type: EntityEventTypes,
    targetComponents?: R[]
}

interface EntityManagerListener<T, R> {
    callback: GenericVoidFunctionWithP<EntityListenerEvent<T, R>>,
    options?: EntityListenerOptions
}

type EntityEventTypes =
    "hierarchy-change"
    | "hard-change"
    | "component-add"
    | "component-remove"
    | "create"
    | "delete"
    | "update"

interface UniformMap {
    [key: string]: WebGLUniformLocation
}

interface CameraEffectsSerialization {
    zNear: number
    zFar: number
    fov: number
    aspectRatio: number
    size: number
    focusDistanceDOF: number
    apertureDOF: number
    focalLengthDOF: number
    samplesDOF: number
    filmGrainStrength: number
    vignetteStrength: number
    bloomThreshold: number
    bloomQuality: number
    bloomOffset: number
    gamma: number
    exposure: number
    chromaticAberrationStrength: number
    distortionStrength: number
    cameraMotionBlur: boolean
    DOF: boolean
    bloom: boolean
    filmGrain: boolean
    vignetteEnabled: boolean
    chromaticAberration: boolean
    distortion: boolean
}

interface Uniform {
    type: string,
    name: string,
    parent?: string,
    arraySize?: number,
    uLocations?: WebGLUniformLocation[],
    uLocation?: WebGLUniformLocation
}

interface MeshProps {
    id?: string,
    vertices: number[] | Float32Array,
    indices: number[] | Float32Array,
    normals?: number[] | Float32Array,
    uvs?: number[] | Float32Array,
    tangents?: number[] | Float32Array,
    maxBoundingBox?: number[],
    minBoundingBox?: number[]
}

interface CameraSerialization {
    translationSmoothing: number,
    metadata: CameraEffectsSerialization,
    rotation: number[],
    translation: number[],
    prevX?: number,
    prevY?: number
}

interface IGPUResource extends IResource {
    lastUsed: number
    loaded: boolean
}

interface IMesh extends IGPUResource{

}

interface MaterialSettings {
    renderingMode: number
    doubleSided: boolean
    ssrEnabled: boolean
}

interface MaterialInformation {
    functionDeclaration: string
    uniformsDeclaration: string
    uniformValues: MaterialUniform[]
    settings: MaterialSettings
    executionSignature: string
}

interface ITexture extends IGPUResource {
}

interface UBOItem {
    offset: number,
    dataSize: number,
    chunkSize: number
}

interface UBOData {
    name: string
    type: string
    offset?: number
    dataSize?: number
    chunkSize?: number
    dataLength?: number
}


interface TextureMeta {
    key: string
    texture: ITexture
}

interface TextureInUse {
    [key: string]: TextureMeta
}

interface ConsoleMessage {
    type: string,
    message: any,
    object?: any,
    blockID: string,
    src: string,
    notFirstOnBlock?: boolean
}

interface MaterialUniform {
    type: string
    data: string
    key: string

}

interface TextureParams {
    base64?: string
    img?: string | ImageBitmap | HTMLImageElement
    wrapS?: string
    wrapT?: string
    minFilter?: string
    magFilter?: string

    internalFormat?: string
    format?: string
    width?: number
    height?: number
    type?: string
    compressionRatio?: number,
    resolutionScale?: number
}

interface WorkerEntity {
    id: EngineEntity,
    changedBuffer: Uint8Array,
    previousModelMatrix: Float32Array,
    matrix: Float32Array,
    rotationQuaternion: Float32Array,
    translation: Float32Array,
    scaling: Float32Array,
    pivotPoint: Float32Array,
    baseTransformationMatrix: Float32Array,
    absoluteTranslation: Float32Array,
    cullingMetadata: Float32Array,
    rotationType: Float32Array,
    rotationEuler: Float32Array,
    rotationQuaternionFinal: Float32Array,
}

// PHYSICS
interface TAmmoJS {
    btDefaultCollisionConfiguration: btDefaultCollisionConfiguration
    btCollisionDispatcher: btCollisionDispatcher
    btDbvtBroadphase: btDbvtBroadphase
    btSequentialImpulseConstraintSolver: btSequentialImpulseConstraintSolver
    btDiscreteDynamicsWorld: btDiscreteDynamicsWorld
    btTransform: btTransform
    btVector3: btVector3
    btBoxShape: btBoxShape
    btSphereShape: btSphereShape
    btQuaternion: btQuaternion
    btDefaultMotionState: btDefaultMotionState
    btRigidBodyConstructionInfo: btRigidBodyConstructionInfo
    btRigidBody: btRigidBody
    _malloc: any
    HEAPF32: any
    btHeightfieldTerrainShape: any

}

interface btSequentialImpulseConstraintSolver {
    new(): btSequentialImpulseConstraintSolver
}

interface btDbvtBroadphase {
    new(): btDbvtBroadphase
}

interface btCollisionDispatcher {
    new(conf: btDefaultCollisionConfiguration): btCollisionDispatcher
}

interface btDefaultCollisionConfiguration {
    new(): btDefaultCollisionConfiguration
}

interface btVector3 {
    new(x: number, y: number, z: number): btVector3
}

interface btQuaternion {
    new(x: number, y: number, z: number, w: number): btQuaternion
}

interface btTransform {
    new(): btTransform

    setIdentity()

    getRotation(): { x: Function, y: Function, z: Function, w: Function }

    setOrigin(btVec3?: btVector3)

    getOrigin(): { x: Function, y: Function, z: Function }

    setRotation(quat?: btQuaternion)
}


interface btDefaultMotionState {
    new(transform: btTransform): btDefaultMotionState

    getWorldTransform(transform: btTransform)

}

interface btRigidBodyConstructionInfo {
    new(
        mass: number,
        motionState: btDefaultMotionState,
        shape: btSphereShape | btBoxShape,
        inertia: btVector3
    ): btRigidBodyConstructionInfo
}

interface btRigidBody {
    new(info: btRigidBodyConstructionInfo): btRigidBody
}

interface btBoxShape {
    new(size: btVector3): btBoxShape

    calculateLocalInertia(mass: number, inertia: btVector3)

    setMargin(margin: number)
}

interface btSphereShape {
    new(radius: number): btSphereShape

    calculateLocalInertia(mass: number, inertia: btVector3)

    setMargin(margin: number)
}

interface btDiscreteDynamicsWorld {
    new(d: btCollisionDispatcher, b: btDbvtBroadphase, s: btSequentialImpulseConstraintSolver, c: btCollisionDispatcher): btDiscreteDynamicsWorld

    addRigidBody(body: btRigidBody),

    setGravity(gravity: btVector3)

    removeRigidBody(body: btRigidBody)

    stepSimulation(stepSize: number, subSteps: number)
}

type TypedObject<V> = { [key: string | number | symbol]: V }

interface EngineState<Cs, C> {
    entities: { id: EngineEntity, components: [Cs, C][] }[],
    activeEntities: [EngineEntity, boolean][],
    parentChildren: [EngineEntity, EngineEntity[]][],
    childParent: [EngineEntity, EngineEntity][]
}

interface EngineLevel<Cs, C> extends MutableObject {
    state: EngineState<Cs, C>
}
