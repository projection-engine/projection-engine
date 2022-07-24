import CHANNELS from "../../../../electron/static/CHANNELS";
import MeshInstance from "../libs/engine/instances/MeshInstance";
import parseMaterialObject from "./parse-material-object";
import ROUTES from "../../../../electron/static/ROUTES";

const {ipcRenderer} = window.require("electron")
export default function loadProject(callbackMesh, callbackMetaData, callbackMaterials){
    const projectID = sessionStorage.getItem("electronWindowID")
    const IPC = ROUTES.LOAD_PROJECT + projectID
    ipcRenderer.on(CHANNELS.META_DATA + "-" + projectID, (ev, data) => {
        let meta = {}, settings = {}
        if(data?.meta)
            meta = data.meta.data
        if(data?.settings)
            settings = {...settings, ...data.settings.data}
        callbackMetaData(meta, settings)
    })

    ipcRenderer.on(CHANNELS.MESH + "-" + projectID, (ev, data) => {
        callbackMesh(new MeshInstance(data))
    })

    ipcRenderer.on(CHANNELS.MATERIAL + "-" + projectID, async (ev, data) => {
        callbackMaterials(await parseMaterialObject(data.result, data.id))
    })
    ipcRenderer.send(IPC)
}