import FRAME_EVENTS from "../static/FRAME_EVENTS"
import WindowManager from "./WindowManager"

export default class Settings extends WindowManager{
    constructor() {
        super( "open-shortcuts")
    }
    start(){
        super.start(SETTINGS_WEBPACK_ENTRY, FRAME_EVENTS.CLOSE_SHORTCUTS, FRAME_EVENTS.MINIMIZE_SHORTCUTS, FRAME_EVENTS.MAXIMIZE_SHORTCUTS)
    }
}