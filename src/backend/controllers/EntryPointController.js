const path = require("path")

module.exports = class Window{
    static get home(){
        return path.join(require.main.filename, '../../../public/home-window.html')
    }
    static get settings(){
        return path.join(require.main.filename, '../../../public/preferences-window.html')
    }
    static get project(){
        return path.join(require.main.filename, '../../../public/editor-window.html')
    }
}