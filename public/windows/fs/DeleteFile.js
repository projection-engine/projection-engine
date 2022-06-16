const Window = require("../Window")
export default class Settings extends Window{
    constructor() {
        super( "open-delete")
    }
    start(){
        super.start(DELETE_WEBPACK_ENTRY)

    }
}