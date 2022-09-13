const path = require("path")

module.exports = class Window{
    static get home(){
        return path.join(__dirname, '../home-window.html')
    }
    static get settings(){
        return path.join(__dirname, '../preferences-window.html')
    }
    static get project(){
        return path.join(__dirname, '../editor-window.html')
    }
}