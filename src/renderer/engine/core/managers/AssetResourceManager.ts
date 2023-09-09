import GPUState from "@engine-core/states/GPUState";
import EngineFileSystemManager from "@engine-core/managers/EngineFileSystemManager";
import Material from "@engine-core/lib/resources/Material";
import Mesh from "@engine-core/lib/resources/Mesh";
import Texture from "@engine-core/lib/resources/Texture";
import Terrain from "@engine-core/lib/resources/Terrain";

export default class AssetResourceManager {
    static getMesh(meshID: string): Mesh | null {
        if (!meshID)
            return null
        if (GPUState.meshes.has(meshID))
            return GPUState.meshes.get(meshID)
        EngineFileSystemManager.requestMeshLoad(meshID)
        return null
    }

    static getTerrain(meshID: string): Terrain | null {
        if (!meshID)
            return null
        if (GPUState.terrains.has(meshID))
            return GPUState.terrains.get(meshID)
        EngineFileSystemManager.requestTerrainLoad(meshID)
        return null
    }

    static getMaterial(materialID: string): Material | null {
        if (!materialID)
            return null
        if (GPUState.materials.has(materialID))
            return GPUState.materials.get(materialID)
        EngineFileSystemManager.requestMaterialLoad(materialID)
        return null
    }

    static getTexture(textureID: string): Texture | null {
        if (!textureID)
            return null
        if (GPUState.textures.has(textureID))
            return GPUState.textures.get(textureID)
        EngineFileSystemManager.requestTextureLoad(textureID)
        return null
    }
}
