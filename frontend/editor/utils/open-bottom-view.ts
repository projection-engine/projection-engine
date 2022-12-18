import SettingsStore from "../stores/SettingsStore";
import TabsStore from "../stores/TabsStore";

export default function openBottomView(view) {
    const views = [...SettingsStore.data.views]
    const tab = views[SettingsStore.data.currentView]
    const existingTab = tab.bottom[0].findIndex(v => v === view)
    if(existingTab > -1) {
        TabsStore.update("bottom", 0, existingTab)
        return
    }

    if (tab.bottom.length > 0)
        tab.bottom[0].push(view)
    else
        tab.bottom[0] = [view]

    SettingsStore.updateStore({...SettingsStore.data, views})
    TabsStore.update("bottom", 0, tab.bottom[0].length - 1)
}