import FilesStore from "../../../stores/FilesStore";
import resolveFileName from "../../../templates/utils/resolve-file-name";
import AssetAPI from "../../../lib/fs/AssetAPI";
import COMPONENT_TEMPLATE from "../../../../../engine-core/static/templates/COMPONENT_TEMPLATE";
import UI_TEMPLATE from "../../../../../engine-core/static/templates/UI_TEMPLATE";
import TERRAIN_TEMPLATE from "../../../../../engine-core/static/templates/TERRAIN_TEMPLATE";
import Localization from "../../../templates/LOCALIZATION_EN";
import FILE_TYPES from "../../../../../static/objects/FILE_TYPES";
import NodeFS from "../../../../shared/libs/FS/NodeFS";

export default function getCreationOptions(currentDirectory) {
    async function createFile(name, type, data) {
        let path = await resolveFileName(currentDirectory.id + NodeFS.sep + name, type)
        await AssetAPI.writeAsset(path, typeof data === "object" ? JSON.stringify(data) : data)
        await FilesStore.refreshFiles()
    }

    return [
        {
            label: Localization.FOLDER,
            onClick: () => FilesStore.createFolder(currentDirectory).catch()
        },
        {divider: true},
        {
            label: Localization.JSON_OBJECT,
            onClick: async () => createFile(Localization.JSON, ".json", "")
        },
        {
            label: Localization.JAVASCRIPT_PACKAGE,
            onClick: async () => createFile(Localization.JAVASCRIPT, ".js", "")
        },
        {divider: true},
        {
            label: Localization.LEVEL,
            onClick: async () => createFile(Localization.LEVEL, FILE_TYPES.LEVEL, {entities: []})
        },
        {divider: true},
        {
            label: Localization.MATERIAL,
            onClick: async () => createFile(Localization.MATERIAL, FILE_TYPES.MATERIAL, {})
        },

        {divider: true},
        {
            label: Localization.COMPONENT,

            onClick: async () => createFile(Localization.COMPONENT, FILE_TYPES.COMPONENT, COMPONENT_TEMPLATE)
        },
        {
            label: Localization.UI_LAYOUT,

            onClick: async () => createFile(Localization.UI_LAYOUT, FILE_TYPES.UI_LAYOUT, UI_TEMPLATE)
        },
        {divider: true},

        {
            label: Localization.TERRAIN,
            onClick: async () => createFile(Localization.TERRAIN, FILE_TYPES.TERRAIN, TERRAIN_TEMPLATE)
        },
    ]
}