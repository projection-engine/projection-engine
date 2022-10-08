import ENGINE from "../data/ENGINE";

import FilesAPI from "../../shared/libs/FilesAPI"
import RegistryAPI from "../../shared/libs/RegistryAPI";
import GPU from "../../../public/engine/production/GPU";
import {writable} from "svelte/store";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

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
            const rs = await RegistryAPI.readRegistryFile(registryID)
            const textureData = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path, "json")

            await GPU.allocateTexture({
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



