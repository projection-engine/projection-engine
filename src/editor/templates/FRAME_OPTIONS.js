export default [
    {
        label: 'File',
        submenu: [
            {
                label: 'Save',
                id: "save"
            },
            {type: "separator"},
            {
                label: 'Undo',
                id: "undo"
            },
            {
                label: 'Redo',
                id: "redo"
            },
            {type: 'separator'},
            {
                label: 'Copy',
                id: "copy"
            },
            {
                label: 'Paste',
                id: "paste"
            },
            {type: 'separator'},
            {
                label: 'Preferences',
                id: "preferences"
            },
            {type: 'separator'},
            {
                label: 'Reload project',
                id:"reload"
            }
        ]
    },

    {
        label: 'View',
        submenu: [
            {
                label: "Toggle fullscreen",
                id: "fullscreen"
            },
            {type: 'separator'},
            {
                label: "Toggle footer",
                id: "footer"
            }
        ]
    },

    {
        label: 'Help',
        submenu: [
            {
                label: 'Learn More',
                id: "learn-more"
            },
            {
                label: 'About',
                id: "about"
            }
        ]
    }
]