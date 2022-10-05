export default [
    {
        label: 'Project',
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
            }
        ]
    },

    {
        label: 'View',
        submenu: [
            {
                role: 'togglefullscreen'
            },
            {type: 'separator'},
            {
                label: "Toggle footer",
                id: "footer"
            }
        ]
    },

    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            },
            {type: 'separator'},
            {
                label: 'Reload project',
                id:"reload"
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