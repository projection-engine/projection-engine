export default function removeTab(i, tabs,  setTabs, currentTab, cb) {
	const clone  = [...tabs]
	clone.splice(i, 1)
	if (i === currentTab || i < currentTab)
		cb(currentTab === 0 ? 0 : currentTab - 1)

	setTabs(clone)
}