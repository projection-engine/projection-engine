export default function switchView(newView, groupIndex, tabs, index, setTabs,) {
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