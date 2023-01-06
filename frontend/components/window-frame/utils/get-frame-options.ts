import WindowUtils from "../../../editor/lib/WindowUtils";

export default function getFrameOptions(closeProject:Function, disabledSave:boolean) {
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
            onClick: closeProject
        },
    ]
}