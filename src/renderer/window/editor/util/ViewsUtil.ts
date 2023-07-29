import VIEWS from "../components/view/static/VIEWS"
import VIEWPORT_TABS from "../static/VIEWPORT_TABS"
import ViewTabItem from "../static/ViewTabItem";

export default class ViewsUtil {

    static getViewId(type: string, index: number, groupIndex: number, id: string, currentViewIndex: number) {
        return JSON.stringify({
            type,
            index,
            groupIndex,
            id,
            currentViewIndex
        })
    }

    static switchView(newView, groupIndex, tabs, index, setTabs,) {
        if (!newView) {
            const copy = [...tabs]
            copy[groupIndex][index] = undefined
            if (copy[groupIndex].filter(e => e).length === 0)
                copy.splice(groupIndex, 1)

            setTabs(copy.filter(e => e))
            return
        }
        const copy = [...tabs]
        copy[groupIndex][index].type = newView
        setTabs(copy)

    }

    static removeTab(indexToRemove: number, tabs: ViewTabItem[][], groupIndex: number, setTabs: Function, currentTab: number, onBeforeDelete: Function) {
        const clone = [...tabs]
        clone[groupIndex].splice(indexToRemove, 1)
        if (clone[groupIndex].length === 0)
            clone.splice(groupIndex, 1)

        if (indexToRemove === currentTab || indexToRemove < currentTab)
            onBeforeDelete(currentTab === 0 ? 0 : currentTab - 1)

        setTabs(clone)
    }

    static onResizeEndSplitter(next, prev, invOrientation, setTabs, tabs, groupIndex) {
        const nextBB = next.getBoundingClientRect()
        const prevBB = prev.getBoundingClientRect()
        if (prevBB[invOrientation] < 30) {
            prev.style[invOrientation] = "100%"
            const copy = [...tabs]
            copy.shift()
            setTabs(copy)
        }
        if (nextBB[invOrientation] < 30) {
            next.style[invOrientation] = "100%"

            const copy = [...tabs]
            copy[groupIndex + 1] = undefined
            setTabs(copy.filter(e => e))
        }
    }

    static getViewIcon(view) {
        switch (view) {
            case VIEWS.INSPECTOR:
                return "category"
            case VIEWS.CONSOLE:
                return "terminal"
            case VIEWS.FILES:
                return "folder"
            case VIEWS.SHADER_EDITOR:
                return "texture"
            case VIEWS.HIERARCHY:
                return "account_tree"
            case VIEWPORT_TABS.EDITOR:
                return "public"
            case VIEWPORT_TABS.UI:
                return "widgets"
            case VIEWS.METRICS:
                return "bar_chart"
        }
    }

    static addTab(tabs, setTabs, groupIndex, item) {
        const clone = [...tabs]
        clone[groupIndex].push({color: [255, 255, 255], type: item?.id || VIEWS.INSPECTOR})
        setTabs(clone)
    }
}
