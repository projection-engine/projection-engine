import FilesStore from "../../../stores/FilesStore";
import resolveFileName from "../../../utils/resolve-file-name";
import AssetAPI from "../../../lib/fs/AssetAPI";
import COMPONENT_TEMPLATE from "../../../../../../engine-core/static/templates/COMPONENT_TEMPLATE";
import UI_TEMPLATE from "../../../../../../engine-core/static/templates/UI_TEMPLATE";
import TERRAIN_TEMPLATE from "../../../../../../engine-core/static/templates/TERRAIN_TEMPLATE";
import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
import FILE_TYPES from "../../../../../../static/objects/FILE_TYPES";
import FS from "../../../../../lib/FS/FS";

export default function getCreationOptions(currentDirectory) {
    async function createFile(name, type, data) {
        let path = await resolveFileName(currentDirectory.id + FS.sep + name, type)
        await AssetAPI.writeAsset(path, typeof data === "object" ? JSON.stringify(data) : data)
        await FilesStore.refreshFiles()
    }

    return [
        {
            label: LOCALIZATION_EN.FOLDER,
            onClick: () => FilesStore.createFolder(currentDirectory).catch()
        },
        {divider: true},
        {
            label: LOCALIZATION_EN.JSON_OBJECT,
            onClick: async () => createFile(LOCALIZATION_EN.JSON, ".json", "")
        },
        {
            label: LOCALIZATION_EN.JAVASCRIPT_PACKAGE,
            onClick: async () => createFile(LOCALIZATION_EN.JAVASCRIPT, ".js", "")
        },
        {divider: true},
        {
            label: LOCALIZATION_EN.LEVEL,
            onClick: async () => createFile(LOCALIZATION_EN.LEVEL, FILE_TYPES.LEVEL, {entities: []})
        },
        {divider: true},
        {
            label: LOCALIZATION_EN.MATERIAL,
            onClick: async () => createFile(LOCALIZATION_EN.MATERIAL, FILE_TYPES.MATERIAL, {})
        },

        {divider: true},
        {
            label: LOCALIZATION_EN.COMPONENT,

            onClick: async () => createFile(LOCALIZATION_EN.COMPONENT, FILE_TYPES.COMPONENT, COMPONENT_TEMPLATE)
        },
        {
            label: LOCALIZATION_EN.UI_LAYOUT,
            onClick: async () => createFile(LOCALIZATION_EN.UI_LAYOUT, FILE_TYPES.UI_LAYOUT, UI_TEMPLATE)
        },

    ]
}