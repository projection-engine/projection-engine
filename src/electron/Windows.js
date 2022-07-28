const path = require("path")

module.exports = class Window{
    static get home(){
        return path.join(__dirname, '../../public/home-window.html')
    }
    static get settings(){
        return path.join(__dirname, '../../public/settings-window.html')
    }
    static get project(){
        return path.join(__dirname, '../../public/project-window.html')
    }
}