import ElectronResources from "../lib/ElectronResources";
import ROUTES from "../../../backend/static/ROUTES";
import STORES from "../../../backend/static/STORES";
import VisualsStore from "./VisualsStore";
import SettingsStore from "./SettingsStore";

export default class StoreManager{
    static initialize(){
        ElectronResources.ipcRenderer.on(ROUTES.STORE_UPDATE, (_, {data, key}) => {
            switch (key){
                case STORES.SETTINGS:
                    SettingsStore.noPush = true
                    SettingsStore.updateStore({...data, views: SettingsStore.data.views})
                    SettingsStore.noPush = false
                    break
                case STORES.VISUALS:
                    VisualsStore.noPush = true
                    VisualsStore.updateStore(data)
                    VisualsStore.noPush = false
                    break
            }
        })
    }
    static onUpdate(data:MutableObject, key:string){
        ElectronResources.ipcRenderer.send(ROUTES.STORE_UPDATE, {key, data})
    }
}