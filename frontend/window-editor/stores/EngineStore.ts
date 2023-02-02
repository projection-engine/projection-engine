import ENGINE from "../static/ENGINE";

import FilesAPI from "../lib/fs/FilesAPI"
import RegistryAPI from "../lib/fs/RegistryAPI";
import GPU from "../../../engine-core/GPU";
import {writable} from "svelte/store";
import GPUAPI from "../../../engine-core/lib/rendering/GPUAPI";
import MutableObject from "../../../engine-core/MutableObject";
import FS from "../../shared/lib/FS/FS";

const engine = writable(<MutableObject>ENGINE);

export default class EngineStore {
    static engine: MutableObject = ENGINE

    static getStore(onChange: Function): Function {
        return engine.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value?: MutableObject) {
        let updated = {...(value || EngineStore.engine)}
        EngineStore.engine = updated
        engine.set(updated)
    }

    static async loadTextureFromImageID(registryID: string) {
        if (GPU.textures.get(registryID) != null)
            return true
        try {
            const rs = RegistryAPI.getRegistryEntry(registryID)
            if (!rs)
                return false
            const textureData = await FilesAPI.readFile(FS.ASSETS_PATH + FS.sep + rs.path, "json")

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



