import CHANNELS from "../../../../static/CHANNELS";
import MeshInstance from "../libs/engine/instances/MeshInstance";
import parseMaterialObject from "./parse-material-object";
import ROUTES from "../../../../static/ROUTES";

const {ipcRenderer} = window.require("electron")
export default function loadProject(callbackMesh, callbackEntities, callbackMaterials){
    const projectID = sessionStorage.getItem("electronWindowID")
    const IPC = ROUTES.LOAD_PROJECT + projectID
    ipcRenderer.on(CHANNELS.ENTITIES + "-" + projectID, (ev, entities) => {
        callbackEntities(entities)
    })

    ipcRenderer.on(CHANNELS.MESH + "-" + projectID, (ev, data) => {
        console.trace(data)
        callbackMesh(new MeshInstance(data))
    })

    ipcRenderer.on(CHANNELS.MATERIAL + "-" + projectID, async (ev, data) => {
        callbackMaterials(await parseMaterialObject(data.result, data.id))
    })

    ipcRenderer.send(IPC)
}