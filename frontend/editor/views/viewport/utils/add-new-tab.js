import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS";

export default function addNewTab(tabs, setTabs) {
    const clone  = [...tabs]
    clone.push(VIEWPORT_TABS.EDITOR)
    setTabs(clone)
}