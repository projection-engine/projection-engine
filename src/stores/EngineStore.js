import ENGINE from "../data/ENGINE";

import FilesAPI from "../libs/FilesAPI"
import RegistryAPI from "../libs/RegistryAPI";
import GPUResources from "../../public/engine/GPUResources";
import {writable} from "svelte/store";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import GPUController from "../../public/engine/GPUController";

const engine = writable(ENGINE);

export default class EngineStore {
    static engine = ENGINE

    static getStore(onChange) {
        return engine.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static updateStore(value = EngineStore.engine) {
        let updated = {...value}
        EngineStore.engine = updated
        engine.set(updated)
    }

    static async loadTextureFromImageID(registryID) {
        if (GPUResources.textures.get(registryID) != null)
            return true
        try {
            const rs = RegistryAPI.getRegistryEntry(registryID)
            const textureData = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path, "json")

            await GPUController.allocateTexture({
                ...textureData,
                img: textureData.base64,
                yFlip: textureData.flipY
            }, registryID)
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }
}



