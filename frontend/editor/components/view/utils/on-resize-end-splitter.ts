export default function onResizeEndSplitter (next, prev, invOrientation, setTabs, tabs, groupIndex)  {
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