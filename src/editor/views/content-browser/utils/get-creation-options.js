import FilesStore from "../../../stores/FilesStore";
import resolveFileName from "../../../templates/utils/resolve-file-name";
import FilesAPI from "../../../../shared/libs/FilesAPI";
import FILE_TYPES from "../../../../static/FILE_TYPES";
import AssetAPI from "../../../../shared/libs/AssetAPI";
import SIMPLE_MATERIAL_TEMPLATE
    from "../../../../../public/engine/production/materials/simple/SIMPLE_MATERIAL_UNIFORMS";
import TERRAIN_LAYERED from "../../../../../public/engine/production/materials/terrain-layered/TERRAIN_MATERIAL";
import TERRAIN_MATERIAL_UNIFORMS from "../../../../../public/engine/static/templates/TERRAIN_MATERIAL_UNIFORMS";
import COMPONENT_TEMPLATE from "../../../../../public/engine/static/templates/COMPONENT_TEMPLATE";
import UI_TEMPLATE from "../../../../../public/engine/static/templates/UI_TEMPLATE";
import TERRAIN_TEMPLATE from "../../../../../public/engine/static/templates/TERRAIN_TEMPLATE";
import Localization from "../../../../shared/libs/Localization";

const translate = key => Localization.PROJECT.FILES[key]
export default function getCreationOptions(currentDirectory, ){
    return [
        {
            label: translate("NEW_FOLDER"),
            icon: "create_new_folder",
            onClick: () => FilesStore.createFolder(currentDirectory).catch()
        },
        {
            label: translate("NEW_MATERIAL"),
            icon: "texture",
            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_MATERIAL"), FILE_TYPES.MATERIAL)
                AssetAPI.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        FilesStore.refreshFiles()
                    })
            }
        },
        {
            label: translate("NEW_SIMPLE_MATERIAL"),
            icon: "texture",
            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_SIMPLE_MATERIAL"), FILE_TYPES.SIMPLE_MATERIAL)
                AssetAPI.writeAsset(path, JSON.stringify(SIMPLE_MATERIAL_TEMPLATE))
                    .then(() => {
                        FilesStore.refreshFiles()
                    })
            }
        },
        {
            label: translate("NEW_TERRAIN_MATERIAL"),
            icon: "texture",
            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_TERRAIN_MATERIAL"), FILE_TYPES.TERRAIN_MATERIAL)
                AssetAPI.writeAsset(path, JSON.stringify({original: TERRAIN_LAYERED, uniformData: TERRAIN_MATERIAL_UNIFORMS }))
                    .then(() => {
                        FilesStore.refreshFiles()
                    })
            }
        },
        {
            label: translate("NEW_COMPONENT"),
            icon: "code",
            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_COMPONENT"), FILE_TYPES.COMPONENT)

                await AssetAPI.writeAsset(path, COMPONENT_TEMPLATE)
                FilesStore.refreshFiles().catch()
            }
        },
        {
            label: translate("NEW_LEVEL"),
            icon: "forest",
            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_LEVEL"), FILE_TYPES.LEVEL)

                await AssetAPI.writeAsset(path, JSON.stringify({
                    entities: []
                }))
                FilesStore.refreshFiles().catch()
            }
        },
        {
            label: translate("NEW_UI_LAYOUT"),
            icon: "view_quilt",
            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_UI_LAYOUT"), FILE_TYPES.UI_LAYOUT)
                await AssetAPI.writeAsset(path, UI_TEMPLATE)
                FilesStore.refreshFiles().catch()

            }
        },
        {
            label: translate("NEW_TERRAIN"),
            icon: "landscape",
            onClick: async () => {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_TERRAIN"), FILE_TYPES.TERRAIN)
                await AssetAPI.writeAsset(path, JSON.stringify(TERRAIN_TEMPLATE))
                FilesStore.refreshFiles().catch()
            }
        },
    ]
}