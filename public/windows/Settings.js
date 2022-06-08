import FRAME_EVENTS from "../FRAME_EVENTS"
import Window from "./Window"
export default class Settings extends Window{
    constructor() {
        super( "open-shortcuts")
    }
    start(){
        super.start(SETTINGS_WEBPACK_ENTRY, FRAME_EVENTS.CLOSE_SHORTCUTS, FRAME_EVENTS.MINIMIZE_SHORTCUTS, FRAME_EVENTS.MAXIMIZE_SHORTCUTS)
    }
}