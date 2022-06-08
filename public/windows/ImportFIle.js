const Window = require("./Window")
export default class Settings extends Window{
    constructor() {
        super( "open-import")
    }
    start(){
        super.start(IMPORT_WEBPACK_ENTRY)
    }
}