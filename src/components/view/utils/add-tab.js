import VIEWS from "../static/VIEWS"

export default function addTab(tabs, setTabs, groupIndex) {
    const clone  = [...tabs]
    clone[groupIndex].push(VIEWS.CONSOLE)
    setTabs(clone)
}