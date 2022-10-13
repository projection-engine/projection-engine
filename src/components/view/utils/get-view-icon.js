import VIEWS from "../data/VIEWS";
import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";

export default function getViewIcon(view) {
    switch (view) {
        case VIEWS.CONSOLE:
            return "terminal"
        case VIEWS.COMPONENT:
            return "category"
        case VIEWS.FILES:
            return "folder"
        case VIEWS.BLUEPRINT:
            return "texture"
        case VIEWS.HIERARCHY:
            return "account_tree"
        case VIEWPORT_TABS.EDITOR:
            return "public"
        case VIEWPORT_TABS.TERRAIN:
            return "terrain"
        case VIEWS.PREFERENCES:
            return "settings"
        case VIEWS.UI:
            return "widgets"
    }
}