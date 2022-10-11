import VIEWS from "../../shared/components/view/VIEWS";
import VIEWPORT_TABS from "./VIEWPORT_TABS";

export default [
    {
        name: "Level",
        bottom: [[VIEWS.FILES]],
        left: [],
        viewport: VIEWPORT_TABS.EDITOR,
        right: [[VIEWS.HIERARCHY], [VIEWS.COMPONENT]]
    },
    {
        name: "Debug",
        bottom: [[VIEWS.CONSOLE]],
        left: [],
        viewport: VIEWPORT_TABS.EDITOR,
        right: []
    },
    {
        name: "Shading",
        bottom: [[VIEWS.BLUEPRINT, VIEWS.FILES]],
        left: [],
        viewport: VIEWPORT_TABS.EDITOR,
        right: [[VIEWS.HIERARCHY, VIEWS.COMPONENT]]
    }
    ,
    {
        name: "UI",
        bottom: [[VIEWS.FILES]],
        left: [[VIEWS.COMPONENT]],
        viewport: VIEWPORT_TABS.UI,
        right: [[VIEWS.HIERARCHY]]
    }
]