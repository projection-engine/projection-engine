import Ammo from "../Ammo.js"
import EditorEntity from "../../../tools/EditorEntity"
import {ColliderTypes, Components,} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";
import RigidBodyComponent from "@engine-core/components/RigidBodyComponent";
import PhysicsColliderComponent from "@engine-core/components/PhysicsColliderComponent";
import TransformationComponent from "@engine-core/components/TransformationComponent";
import {quat, vec3, vec4} from "gl-matrix";
import DynamicMap from "@engine-core/resource-libs/DynamicMap";

const COLLISION = "COLLISION",
    DISPATCHER = "DISPATCHER",
    BROAD_PHASE = "BROAD_PHASE",
    SOLVER = "SOLVER",
    GRAVITY = "GRAVITY"


export default class PhysicsAPI {
    static #gravity: [number, number, number] = [0, 0, 0]
    static ammo?: TAmmoJS
    static worldSettings = new Map()
    static world?: btDiscreteDynamicsWorld
    static registered = new DynamicMap<EngineEntity, { body: btRigidBody, setChanged: VoidFunction, motionState: btDefaultMotionState, translationVec: vec3, rotationQuat: quat }>()
    static tempTransformation?: btTransform

    static async initialize() {
        const ammo = <TAmmoJS>await Ammo()
        const wS = PhysicsAPI.worldSettings
        PhysicsAPI.ammo = ammo
        wS.set(COLLISION, new ammo.btDefaultCollisionConfiguration())
        wS.set(DISPATCHER, new ammo.btCollisionDispatcher(wS.get(COLLISION)))
        wS.set(BROAD_PHASE, new ammo.btDbvtBroadphase())
        wS.set(SOLVER, new ammo.btSequentialImpulseConstraintSolver())
        PhysicsAPI.world = <btDiscreteDynamicsWorld>new ammo.btDiscreteDynamicsWorld(
            wS.get(DISPATCHER),
            wS.get(BROAD_PHASE),
            wS.get(SOLVER),
            wS.get(COLLISION)
        )
        PhysicsAPI.gravity = [0, -9.8, 0]
        PhysicsAPI.tempTransformation = <btTransform>new ammo.btTransform()
    }

    static initializeCollider(entity) {
        const ammo = PhysicsAPI.ammo
        const pColliderComponent = entity.physicsColliderComponent

        switch (pColliderComponent.collisionType) {
            case ColliderTypes.BOX: {
                const boxSize = <btVector3>new ammo.btVector3(pColliderComponent.size[0], pColliderComponent.size[1], pColliderComponent.size[2])
                pColliderComponent.shape = <btBoxShape>new ammo.btBoxShape(boxSize)
                pColliderComponent.shape.setMargin(0.05)
                break
            }
            case ColliderTypes.SPHERE:
                pColliderComponent.shape = <btSphereShape>new ammo.btSphereShape(pColliderComponent.radius)
                pColliderComponent.shape.setMargin(0.05)
                break
            case ColliderTypes.CAPSULE:
                // TODO
                break
            default:
                break
        }
        pColliderComponent.initialized = true
    }

    static get gravity(): [number, number, number] {
        return PhysicsAPI.#gravity
    }

    static set gravity(data) {
        PhysicsAPI.#gravity = data
        const ammo = PhysicsAPI.ammo
        PhysicsAPI.world.setGravity(<btVector3>new ammo.btVector3(data[0], data[1], data[2]))
        PhysicsAPI.worldSettings.set(GRAVITY, data)
    }

    static registerRigidBody(entity: EngineEntity) {
        // TODO - ADD LISTENER FOR COLLECTING RIGID BODIES
        if (this.registered.has(entity))
            return
        const components = EntityManager.getAllComponentsMap(entity)
        const rigidBodyComponent = components.get(Components.RIGID_BODY) as RigidBodyComponent
        const pColliderComponent = components.get(Components.PHYSICS_COLLIDER) as PhysicsColliderComponent
        const transform = components.get(Components.TRANSFORMATION) as TransformationComponent
        if (!rigidBodyComponent || !transform || !pColliderComponent)
            return;
        const ammo = PhysicsAPI.ammo
        const translation = transform.absoluteTranslation
        const rotation = transform.rotationQuaternionFinal
        let body: btRigidBody, motionState: btDefaultMotionState
        rigidBodyComponent.transform = <btTransform>new ammo.btTransform()
        rigidBodyComponent.transform.setIdentity()
        rigidBodyComponent.transform.setOrigin(<btVector3>new ammo.btVector3(translation[0], translation[1], translation[2]))
        rigidBodyComponent.transform.setRotation(<btQuaternion>new ammo.btQuaternion(rotation[0], rotation[1], rotation[2], rotation[3]))
        motionState = <btDefaultMotionState>new ammo.btDefaultMotionState(rigidBodyComponent.transform)

        if (!pColliderComponent.initialized) {
            pColliderComponent.initialized = true
            PhysicsAPI.initializeCollider(entity)
        }

        const shape = pColliderComponent.shape
        rigidBodyComponent.inertiaBody = <btVector3>new ammo.btVector3(...rigidBodyComponent.inertia)
        if (rigidBodyComponent.mass > 0)
            shape.calculateLocalInertia(rigidBodyComponent.mass, rigidBodyComponent.inertiaBody)

        const info = <btRigidBodyConstructionInfo>new ammo.btRigidBodyConstructionInfo(
            rigidBodyComponent.mass,
            motionState,
            shape,
            rigidBodyComponent.inertiaBody
        )
        body = <btRigidBody>new ammo.btRigidBody(info)
        PhysicsAPI.world.addRigidBody(body)
        this.registered.set(entity, {setChanged: () => transform.changed = true, motionState, body, translationVec: translation as vec3, rotationQuat: rotation as quat})
    }

    static removeRigidBody(entity: EngineEntity) {
        const instance = this.registered.get(entity)
        if (!instance)
            return;
        PhysicsAPI.world.removeRigidBody(instance.body)
    }
}

