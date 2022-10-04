import ROUTES from "../../static/ROUTES";
import importFile from "../libs/import-file";
import FilesStore from "../stores/FilesStore";
import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import LevelController from "../libs/LevelController";

const {ipcRenderer} = window.require("electron")

export default function getFrameOptions(settings) {

    return [
        {label: "File",
        options: [
            {
                label: "Save",
                onClick: () => LevelController.save().catch(),
                shortcut: "Ctrl - S"
            },
            {divider: true},
            {
                label: "Import asset",
                onClick: () => importFile(FilesStore.ASSETS_PATH)
            }
        ]},
        {
            label: "Edit",
            options: [
                {
                    label: "Undo",
                    onClick: () => ActionHistoryAPI.undo(),

                    shortcut: "Ctrl - Z"
                },
                {
                    label: "Redo",
                    onClick: () => ActionHistoryAPI.redo(),

                    shortcut: "Ctrl - Y"
                },
                {divider: true},
                {
                    label: "Preferences",
                    icon: "settings",
                    onClick: () => {
                        const settingsClone = structuredClone(settings)
                        ipcRenderer.send(
                            ROUTES.OPEN_SETTINGS + sessionStorage.getItem("electronWindowID"),
                            settingsClone
                        )
                    },
                },
            ]
        }
    ]
}