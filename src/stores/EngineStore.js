import ENGINE from "../static/ENGINE";

import FilesAPI from "../lib/FilesAPI"
import RegistryAPI from "../lib/RegistryAPI";
import GPU from "../../public/engine/GPU";
import {writable} from "svelte/store";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import GPUAPI from "../../public/engine/api/GPUAPI";

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
        if (GPU.textures.get(registryID) != null)
            return true
        try {
            const rs = RegistryAPI.getRegistryEntry(registryID)
            const textureData = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path, "json")

            await GPUAPI.allocateTexture({
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



