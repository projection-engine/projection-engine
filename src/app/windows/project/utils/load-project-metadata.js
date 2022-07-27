import ROUTES from "../../../../electron/static/ROUTES";

const {ipcRenderer} = window.require("electron")
export default function loadProjectMetadata(callbackMetaData){
    const projectID = sessionStorage.getItem("electronWindowID")
    const IPC = ROUTES.LOAD_PROJECT_METADATA + projectID
    ipcRenderer.on(IPC, (ev, data) => {
        let meta = {}, settings = {}
        if(data?.meta)
            meta = data.meta.data
        if(data?.settings)
            settings = {...settings, ...data.settings.data}
        callbackMetaData(meta, settings)
    })
    ipcRenderer.send(IPC)
}