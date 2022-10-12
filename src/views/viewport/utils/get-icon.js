import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";

export default function getIcon(value){
    switch (value){
        case VIEWPORT_TABS.EDITOR:
            return "public"
        case VIEWPORT_TABS.UI:
            return "widgets"
        case VIEWPORT_TABS.TERRAIN:
            return "forest"
        case VIEWPORT_TABS.PREFERENCES:
            return "settings"
    }
}