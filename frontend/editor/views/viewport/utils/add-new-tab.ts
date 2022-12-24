import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS";

export default function addNewTab(tabs, setTabs) {
    const clone  = [...tabs]
    clone.push({type: VIEWPORT_TABS.EDITOR, color: [255,255,255]})
    setTabs(clone)
}