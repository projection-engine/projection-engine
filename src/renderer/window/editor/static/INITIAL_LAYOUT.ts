import VIEWS from "../components/view/static/VIEWS"
import VIEWPORT_TABS from "./VIEWPORT_TABS"

export default [
	{
		name: "Level",
		bottom: [[{color: [255, 255, 255], type: VIEWS.FILES}]],
		left: [],
		top: [],
		viewport: [{color: [255,255,255], type: VIEWPORT_TABS.EDITOR}],
		right: [[{color: [255, 255, 255], type: VIEWS.HIERARCHY}], [{color: [255, 255, 255], type: VIEWS.INSPECTOR}]]
	},
	{
		top: [],
		name: "Debug",
		bottom: [[{color: [255, 255, 255], type: VIEWS.CONSOLE}]],
		left: [],
		viewport: [{color: [255, 255, 255], type: VIEWPORT_TABS.EDITOR}],
		right: []
	},
	{
		name: "Shading",
		top: [],
		bottom: [[{color: [255, 255, 255], type: VIEWS.SHADER_EDITOR}, {color: [255, 255, 255], type: VIEWS.FILES}]],
		left: [],
		viewport: [{color: [255, 255, 255], type: VIEWPORT_TABS.EDITOR}],
		right: [[{color: [255, 255, 255], type: VIEWS.HIERARCHY}, {color: [255, 255, 255], typee: VIEWS.INSPECTOR}]]
	},
	{
		name: "UI",
		top: [],
		bottom: [[{color: [255, 255, 255], type: VIEWS.FILES}]],
		left: [[{color: [255, 255, 255], type: VIEWS.INSPECTOR}]],
		viewport: [{color: [255, 255, 255], type: VIEWPORT_TABS.UI}],
		right: [[{color: [255, 255, 255], type: VIEWS.HIERARCHY}]]
	}
]