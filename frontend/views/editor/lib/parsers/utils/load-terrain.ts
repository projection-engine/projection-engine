import FilesAPI from "../../fs/FilesAPI";

import COMPONENTS from "../../../../../../engine-core/templates/COMPONENTS";
import Entity from "../../../../../../engine-core/instances/Entity";
import FS from "../../../../../lib/FS/FS";
import TerrainComponent from "../../../../../../engine-core/instances/components/TerrainComponent";
import EntityManager from "../../EntityManager";

export default async function loadTerrain(reg) {
    const file = await FilesAPI.readFile(FS.ASSETS_PATH + FS.sep + reg.path, "json")
    if (!file.image) {
        console.error("No height-map present")
        return
    }
    // const data = await TerrainGenerator.generate(file.image, file.scale, file.dimensions)
    // GPUAPI.allocateMesh(reg.id, data)
    const entity = new Entity()
    const comp = entity.addComponent<TerrainComponent>(COMPONENTS.TERRAIN)
    comp.terrainID = reg.id

    EntityManager.add(entity)
}