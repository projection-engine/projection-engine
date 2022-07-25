<script>

    import Alert from "../../components/alert/Alert.svelte";
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import {onDestroy, onMount} from "svelte";
    import SETTINGS from "./static/misc/SETTINGS";
    import loadProject from "./utils/load-project";
    import Viewport from "./components/viewport/Viewport.svelte";
    import {engine as engineStore} from "./stores/engine-store";
    import {settingsStore} from "./stores/settings-store";
    import Initializer from "./libs/Initializer";
    import {get} from "svelte/store";
    import entityReducer from "./libs/engine-extension/entityReducer";

    const {ipcRenderer} = window.require("electron")
    let engine = get(engineStore)
    let settings = SETTINGS
    const unsubscribeEngine = engineStore.subscribe(v => {
        engine = v
    })
    const unsubscribeSettings = settingsStore.subscribe(v => {
        settings = v
    })

    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeSettings()
    })
    onMount(() => {
        engineStore.set({
            ...engine,
            dispatchEntities: packageData => entityReducer(packageData, engine.entities, id => {
                engineStore.set({
                    ...engine,
                    changeID: id
                })
            }),
        })
        Initializer()
        loadProject(
            mesh => {
                engine.meshes.set(mesh.id, mesh)
                engineStore.set(engine)
            },
            (m, s) => {
                settingsStore.set({...settings, ...s})
                engine.meta = m
                engineStore.set(engine)
            },
            (material) => {
                engine.materials.push(material)
                engineStore.set(engine)
            })
    })
</script>

<div class="wrapper">
    <Alert/>
    <WindowFrame
            options={[]}
            label={engine.meta?.name}
            pageInfo={{
        closeEvent: true,
        minimizeEvent: true,
        maximizeEvent: true
    }}
    />
    <div class="content">
        <div class="middle">
            <Viewport/>
        </div>

    </div>
</div>

<style>
    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--pj-background-primary);
    }

    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--pj-background-quaternary);
        display: flex;
        flex-direction: column;
        padding: 3px;
        user-select: none;
    }

    .middle {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
    }
</style>