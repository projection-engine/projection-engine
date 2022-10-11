export default function removeTab(i, tabs, groupIndex, setTabs, currentTab, cb) {
    const clone  = [...tabs]
    clone[groupIndex].splice(i, 1)
    if(clone[groupIndex].length=== 0)
        clone.splice(groupIndex, 1)

    if (i === currentTab || i < currentTab)
        cb(currentTab === 0 ? 0 : currentTab - 1)

    setTabs(clone)
}