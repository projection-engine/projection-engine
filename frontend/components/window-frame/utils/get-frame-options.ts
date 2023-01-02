import WindowUtils from "../../../editor/lib/WindowUtils";

export default function getFrameOptions(openAbout:Function, disabledSave:boolean) {
    return [
        {divider: true, label: "File"},
        {
            label: 'Save',
            icon: "save",
            disabled: disabledSave,
            onClick: () => WindowUtils.callMethod("save")
        },

        {divider: true, label: "Window"},
        {
            label: 'Reload project',
            icon: "refresh",
            onClick: () => WindowUtils.callMethod("reload")
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


        {divider: true, label: "Help"},

        {
            label: 'About',
            icon: "info",
            onClick: openAbout
        }
    ]
}