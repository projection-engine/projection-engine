import SettingsStore from "../../../../shared/stores/SettingsStore";
import FALLBACK_VIEW from "../../../static/FALLBACK_VIEW";

export default function addTab(){
    const views = [
        ...SettingsStore.data.views,
        {...FALLBACK_VIEW}
    ]
    SettingsStore.updateStore({...SettingsStore.data, views})
}