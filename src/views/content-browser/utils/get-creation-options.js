import FilesStore from "../../../stores/FilesStore";
import resolveFileName from "../../../templates/utils/resolve-file-name";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import AssetAPI from "../../../libs/AssetAPI";
import SIMPLE_MATERIAL_TEMPLATE from "../../../../public/engine/templates/materials/simple/SIMPLE_MATERIAL_UNIFORMS";
import TERRAIN_LAYERED from "../../../../public/engine/templates/materials/terrain-layered/TERRAIN_MATERIAL";
import TERRAIN_MATERIAL_UNIFORMS from "../../../../public/engine/static/templates/TERRAIN_MATERIAL_UNIFORMS";
import COMPONENT_TEMPLATE from "../../../../public/engine/static/templates/COMPONENT_TEMPLATE";
import UI_TEMPLATE from "../../../../public/engine/static/templates/UI_TEMPLATE";
import TERRAIN_TEMPLATE from "../../../../public/engine/static/templates/TERRAIN_TEMPLATE";
import Localization from "../../../libs/Localization";
import getMaterialAsOption from "../../../templates/utils/get-material-as-option";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

const translate = key => Localization.PROJECT.FILES[key]
export default function getCreationOptions(currentDirectory, materials) {
    const matInstances = []
    if (materials)
        matInstances.push({
            label: "Material instance",
            children: materials.map(m => getMaterialAsOption(m, currentDirectory))
        })
    return [
        {
            label: translate("NEW_FOLDER"),
            onClick: () => FilesStore.createFolder(currentDirectory).catch()
        },
        {divider: true},
        {
            label: translate("NEW_LEVEL"),

            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + translate("NEW_LEVEL"), FILE_TYPES.LEVEL)
                await AssetAPI.writeAsset(path, JSON.stringify({
                    entities: []
                }))
                await FilesStore.refreshFiles()
            }
        },
        {divider: true},
        {
            label: translate("NEW_MATERIAL"),

            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + translate("NEW_MATERIAL"), FILE_TYPES.MATERIAL)
                AssetAPI.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        FilesStore.refreshFiles()
                    })
            }
        },
        {
            label: translate("NEW_SIMPLE_MATERIAL"),

            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + translate("NEW_SIMPLE_MATERIAL"), FILE_TYPES.SIMPLE_MATERIAL)
                await AssetAPI.writeAsset(path, JSON.stringify(SIMPLE_MATERIAL_TEMPLATE))
                await FilesStore.refreshFiles()

            }
        },
        {
            label: translate("NEW_TERRAIN_MATERIAL"),

            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + translate("NEW_TERRAIN_MATERIAL"), FILE_TYPES.TERRAIN_MATERIAL)
                await AssetAPI.writeAsset(path, JSON.stringify({
                    original: TERRAIN_LAYERED,
                    uniformData: TERRAIN_MATERIAL_UNIFORMS
                }))

                await FilesStore.refreshFiles()

            }
        },
        ...matInstances,
        {divider: true},
        {
            label: translate("NEW_COMPONENT"),

            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + translate("NEW_COMPONENT"), FILE_TYPES.COMPONENT)

                await AssetAPI.writeAsset(path, COMPONENT_TEMPLATE)
                await FilesStore.refreshFiles()
            }
        },
        {
            label: translate("NEW_UI_LAYOUT"),

            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + translate("NEW_UI_LAYOUT"), FILE_TYPES.UI_LAYOUT)
                await AssetAPI.writeAsset(path, UI_TEMPLATE)
                await FilesStore.refreshFiles()

            }
        },
        {divider: true},

        {
            label: translate("NEW_TERRAIN"),

            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + translate("NEW_TERRAIN"), FILE_TYPES.TERRAIN)
                await AssetAPI.writeAsset(path, JSON.stringify(TERRAIN_TEMPLATE))
                await FilesStore.refreshFiles()
            }
        },
    ]
}