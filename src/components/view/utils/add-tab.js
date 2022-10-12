import VIEWS from "../data/VIEWS"

export default function addTab(tabs, setTabs, groupIndex) {
    const clone  = [...tabs]
    clone[groupIndex].push(VIEWS.CONSOLE)
    setTabs(clone)
}