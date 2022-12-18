import VIEWS from "../components/view/static/VIEWS";
import VIEWPORT_TABS from "./VIEWPORT_TABS.ts";

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
        bottom: [[VIEWS.FILES]],
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