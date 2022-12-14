import FilesStore from "../../../stores/FilesStore";
import componentConstructor from "../../../utils/component-constructor";
import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";
import Loader from "../../../lib/parsers/Loader";
import EngineStore from "../../../stores/EngineStore";

export default async function handleComponentDrop(entity, data) {
    try {
        const id = JSON.parse(data)[0]

        let type = "SCRIPT"
        let itemFound = FilesStore.data.components.find(s => s.registryID === id)
        if (!itemFound) {
            itemFound = FilesStore.data.meshes.find(s => s.registryID === id)
            type = "MESH"
        }
        if (!itemFound) {
            itemFound = FilesStore.data.textures.find(s => s.registryID === id)
            type = "IMAGE"
        }
        if (!itemFound) {
            itemFound = FilesStore.data.materials.find(s => s.registryID === id)
            type = "MATERIAL"
        }

        if (!itemFound) {
            throw new Error("File not found")
        }
        switch (type) {
            case "SCRIPT":
                await componentConstructor(entity, id, true)
                break
            case "MESH":
                if (!entity.components.get(COMPONENTS.MESH)) {
                    entity.addComponent(COMPONENTS.MESH)
                    entity.addComponent(COMPONENTS.CULLING)
                }

                await Loader.load(id, true)
                entity.components.get(COMPONENTS.MESH).meshID = id
                break
            case "MATERIAL": {
                entity.components.get(COMPONENTS.MESH).materialID = id
                break
            }
            case "IMAGE": {
                const res = await EngineStore.loadTextureFromImageID(id)
                if (res)
                    (entity.addComponent(COMPONENTS.SPRITE)).imageID = res

                break
            }
            default:
                break
        }
    } catch (err) {
        console.error(err)
    }

}