import SkylightComponent from "../../engine/ecs/components/SkyLightComponent";
import TransformComponent from "../../engine/ecs/components/TransformComponent";
import CubeMapComponent from "../../engine/ecs/components/CubeMapComponent";
import ColliderComponent from "../../engine/ecs/components/ColliderComponent";
import DirectionalLightComponent from "../../engine/ecs/components/DirectionalLightComponent";
import PointLightComponent from "../../engine/ecs/components/PointLightComponent";
import SpotLightComponent from "../../engine/ecs/components/SpotLightComponent";
import FolderComponent from "../../engine/ecs/components/FolderComponent";
import MaterialComponent from "../../engine/ecs/components/MaterialComponent";
import MeshComponent from "../../engine/ecs/components/MeshComponent";
import PhysicsBodyComponent from "../../engine/ecs/components/PhysicsBodyComponent";
import SkyboxComponent from "../../engine/ecs/components/SkyboxComponent";
import TerrainComponent from "../../engine/ecs/components/TerrainComponent";

export default {
    TRANSFORM: TransformComponent.name,
    CUBE_MAP: CubeMapComponent.name,
    COLLIDER: ColliderComponent.name,
    DIRECTIONAL_LIGHT:DirectionalLightComponent.name,
    POINT_LIGHT: PointLightComponent.name,
    SPOT_LIGHT: SpotLightComponent.name,
    FOLDER: FolderComponent.name,
    MATERIAL: MaterialComponent.name,
    MESH: MeshComponent.name,
    PHYSICS: PhysicsBodyComponent.name,
    SKYBOX: SkyboxComponent.name,
    TERRAIN: TerrainComponent.name,
    SKYLIGHT: SkylightComponent.name
}