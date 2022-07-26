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

    import getFrameOptions from "./utils/get-frame-options";

    const {ipcRenderer} = window.require("electron")
    let engine = get(engineStore)
    let settings = SETTINGS
    const unsubscribeEngine = engineStore.subscribe(v => {
        const value = {...v}
        if(v.selected.length > 0 || v.lockedEntity)
            value.selectedEntity = engine.entities.get(v.lockedEntity ? v.lockedEntity : v.selected[0])
        else
            value.selectedEntity = undefined
        engine = value
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
    $: view = settings.views[settings.currentView];
    const updateView = (key, newView) => {
        const s = {...settings}
        const copy = [...s.views]
        copy[s.currentView] = {...view, [key]: newView}
        s.views = copy
        settingsStore.set(s)
    }
    $: frameOptions = getFrameOptions(engine, settings)
</script>

<div class="wrapper">
    <Alert/>
    <WindowFrame
            options={frameOptions}
            label={engine.meta?.name}
            pageInfo={{
        closeEvent: true,
        minimizeEvent: true,
        maximizeEvent: true
    }}
    />
    <div class="content">
        <div class="middle">
<!--            <ViewsContainer-->
<!--                setTabs={(tabs) => updateView("bottom", tabs)}-->
<!--                tabs={view.bottom}-->
<!--                resizePosition={"top"}-->
<!--                orientation={"horizontal"}-->
<!--            />-->
            <Viewport/>
<!--            <ViewsContainer-->
<!--                setTabs={(tabs) => updateView("bottom", tabs)}-->
<!--                tabs={view.bottom}-->
<!--                resizePosition={"top"}-->
<!--                orientation={"horizontal"}-->
<!--            />-->
        </div>
<!--        <ViewsContainer-->
<!--            setTabs={(tabs) => updateView("bottom", tabs)}-->
<!--            tabs={view.bottom}-->
<!--            resizePosition={"top"}-->
<!--            orientation={"horizontal"}-->
<!--        />-->
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