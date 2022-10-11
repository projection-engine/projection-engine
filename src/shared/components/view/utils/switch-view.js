export default function switchView(newView, groupIndex, tabs, index, setTabs, view ){
    if (!newView) {
        const copy = [...tabs]
        copy[groupIndex][index] = undefined
        if(copy[groupIndex].filter(e => e).length === 0)
            copy.splice(groupIndex, 1)

        setTabs(copy.filter(e => e))
    } else if (newView !== view) {
        const copy = [...tabs]
        copy[groupIndex][index] = newView
        setTabs(copy)
    }
}