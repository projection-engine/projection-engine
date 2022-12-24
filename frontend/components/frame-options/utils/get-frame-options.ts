import WindowUtils from "../../../editor/lib/WindowUtils";

export default function getFrameOptions() {
    return [
        {divider: true, label: "File"},
        {
            label: 'Save',
            icon: "save",
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
            onClick: () => WindowUtils.callMethod("learn-more")
        }
    ]
}