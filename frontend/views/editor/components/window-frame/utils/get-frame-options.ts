import WindowUtils from "../../../lib/WindowUtils";
import ROUTES from "../../../../../../backend/static/ROUTES";

const {ipcRenderer} = window.require("electron")
export default function getFrameOptions( disabledSave:boolean) {
    return [
        {divider: true, label: "File"},
        {
            label: 'Save',
            icon: "save",
            disabled: disabledSave,
            onClick: () => WindowUtils.callMethod("save")
        },


        {divider: true, label: "Utils"},

        {
            label: "Toggle fullscreen",
            icon: "fullscreen",
            onClick: () => WindowUtils.callMethod("fullscreen")
        },

        {
            label: "Toggle footer",
            onClick: () => WindowUtils.callMethod("footer")
        },
        {divider: true, label: "Other"},
        {
            label: 'Reload project',
            icon: "refresh",
            onClick: () => WindowUtils.callMethod("reload")
        },
        {
            label: "Close project",
            onClick: () => ipcRenderer.send(ROUTES.CLOSE_EDITOR)
        },
    ]
}