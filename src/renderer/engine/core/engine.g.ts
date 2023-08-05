type EngineEntity = `${string}-${string}-${string}-${string}-${string}`

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

type EntityEventTypes = "hard-change" | "component-add" | "component-remove" | "create" | "delete" | "update"

interface UniformMap {
    [key: string]: WebGLUniformLocation
}

interface ComponentValueGeneric {
    [key: string]: any

    type: string
    label?: string
    key?: string
    disabledIf?: string | Function
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

interface CameraSerialization {
    translationSmoothing: number,
    metadata: CameraEffectsSerialization,
    rotation: number[],
    translation: number[],
    prevX?: number,
    prevY?: number
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

interface ITexture {
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
    id: string,
    changedBuffer: Uint8Array,
    previousModelMatrix: Float32Array,
    matrix: Float32Array,
    parentChangedBuffer?: Uint8Array,
    rotationQuaternion: Float32Array,
    translation: Float32Array,
    scaling: Float32Array,
    pivotPoint: Float32Array,
    baseTransformationMatrix: Float32Array,
    absoluteTranslation: Float32Array,
    parentMatrix?: Float32Array,
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
