import {useCallback, useMemo} from "react"

export default function useViews(settings) {
    const view = useMemo(() => {
        return settings.views[settings.currentView]
    }, [settings.views, settings.currentView])
    const updateView = useCallback((key, newView) => {
        const copy = [...settings.views]
        copy[settings.currentView] = {...view, [key]: newView}
        settings.views = copy
    }, [settings])
    return {view, updateView}
}