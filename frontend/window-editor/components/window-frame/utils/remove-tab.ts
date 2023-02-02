import SettingsStore from "../../../stores/SettingsStore";

export default function removeTab(i: number) {
    const obj = {...SettingsStore.data}
    if (i === obj.currentView || i < obj.currentView)
        obj.currentView = obj.currentView === 0 ? 0 : obj.currentView - 1

    obj.views = obj.views.filter((_, index) => i !== index)
    SettingsStore.updateStore(obj)
}