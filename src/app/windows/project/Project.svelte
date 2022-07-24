<script>

    import Alert from "../../components/alert/Alert.svelte";
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import {onMount} from "svelte";
    import ROUTES from "../../../electron/static/ROUTES";
    import CHANNELS from "../../../electron/static/CHANNELS";
    import MeshInstance from "./libs/engine/instances/MeshInstance";
    import parseMaterialObject from "./utils/parseMaterialObject";
    import SETTINGS from "./static/misc/SETTINGS";

    const {ipcRenderer} = window.require("electron")
    let meta = {}
    let settings = SETTINGS
    let meshes = new Map()
    let materials = []

    onMount(() => {
        const projectID = sessionStorage.getItem("electronWindowID")
        console.log(projectID)
        const IPC = ROUTES.LOAD_PROJECT + projectID

        ipcRenderer.on(CHANNELS.META_DATA + "-" + projectID, (ev, data) => {
            console.log(data)
            if(data?.meta)
                meta = data.meta.data
            if(data?.settings)
                settings = {...settings, ...data.settings.data}
        })

        ipcRenderer.on(CHANNELS.MESH + "-" + projectID, (ev, data) => {
            meshes.set(data.id, new MeshInstance(data))
        })

        ipcRenderer.on(CHANNELS.MATERIAL + "-" + projectID, async (ev, data) => {
            materials.push(
                await parseMaterialObject(data.result, data.id)
            )
        })
        ipcRenderer.send(IPC)

    })
</script>

<Alert/>
<WindowFrame
    options={[]}
    label={meta.name}
    pageInfo={{
        closeEvent: true,
        minimizeEvent: true,
        maximizeEvent: true
    }}
/>
<div class="wrapper">

</div>


<style>
    .wrapper {
        background: var(--pj-background-quaternary);
        height: 100%;
        width: 100%;
    }
</style>