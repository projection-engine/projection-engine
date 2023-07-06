import VIEWS from "../components/view/static/VIEWS"
import VIEWPORT_TABS from "../static/VIEWPORT_TABS"

export default class ViewsUtil {
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

	static removeTab(i, tabs, groupIndex, setTabs, currentTab, cb) {
		const clone = [...tabs]
		clone[groupIndex].splice(i, 1)
		if (clone[groupIndex].length === 0)
			clone.splice(groupIndex, 1)

		if (i === currentTab || i < currentTab)
			cb(currentTab === 0 ? 0 : currentTab - 1)

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