import SettingsStore from "../stores/SettingsStore";

export default function updateView(key, newView) {
    const s = {...SettingsStore.data}
    const view = s.views[s.currentView]
    const copy = [...s.views]
    copy[s.currentView] = {...view, [key]: newView}
    s.views = copy
    SettingsStore.updateStore(s)
}