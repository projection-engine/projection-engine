import VIEWS from "../components/view/data/VIEWS";
import VIEWPORT_TABS from "./VIEWPORT_TABS";

export default [
    {
        name: "Level",
        bottom: [[VIEWS.FILES]],
        left: [],
        top: [],
        viewport: [VIEWPORT_TABS.EDITOR],
        right: [[VIEWS.HIERARCHY], [VIEWS.COMPONENT]]
    },
    {
        top: [],
        name: "Debug",
        bottom: [[VIEWS.CONSOLE]],
        left: [],
        viewport: [VIEWPORT_TABS.EDITOR],
        right: []
    },
    {
        name: "Shading",
        top: [],
        bottom: [[VIEWS.BLUEPRINT, VIEWS.FILES]],
        left: [],
        viewport: [VIEWPORT_TABS.EDITOR],
        right: [[VIEWS.HIERARCHY, VIEWS.COMPONENT]]
    },
    {
        name: "UI",
        top: [],
        bottom: [[VIEWS.FILES]],
        left: [[VIEWS.COMPONENT]],
        viewport: [VIEWPORT_TABS.UI],
        right: [[VIEWS.HIERARCHY]]
    }
]