<script>
    import Alert from "shared-resources/frontend/components/alert/Alert.svelte";
    import {onDestroy} from "svelte";
    import Viewport from "./views/viewport/Viewport.svelte";
    import Footer from "./components/footer/Footer.svelte";
    import EngineStore from "./stores/EngineStore";
    import ViewsContainer from "./components/view/Views.svelte";
    import ControlOptions from "./components/window-options/WindowOptions.svelte";
    import SettingsStore from "./stores/SettingsStore";

    import ContextMenu from "shared-resources/frontend/components/context-menu/ContextMenu.svelte";

    const FALLBACK = {
        name: "Default",
        bottom: [],
        left: [],
        right: []
    }

    let view = FALLBACK
    let engine
    let settings
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeEngine()
    })


    $: view = settings.views[settings.currentView] ? settings.views[settings.currentView] : FALLBACK
    const updateView = (key, newView) => {
        const s = {...settings}
        const copy = [...s.views]
        copy[s.currentView] = {...view, [key]: newView}
        s.views = copy
        SettingsStore.updateStore(s)
    }

</script>

<div class="wrapper">

    <Alert/>
    <ControlOptions/>
    <ContextMenu/>
    <div class="middle">
        <ViewsContainer
                id="left"
                setTabs={(tabs) => updateView("left", tabs)}
                tabs={view.left}
                reducedOpacity={engine.executingAnimation}
                leftOffset={"8px"}
                orientation={"vertical"}
                resizePosition={"left"}
        />
        <div class="content">
            <ViewsContainer
                    reducedOpacity={engine.executingAnimation}
                    id="bottom"
                    setTabs={(tabs) => updateView("top", tabs)}
                    tabs={view.top}
                    resizePosition={"bottom"}
                    orientation={"horizontal"}
            />
            <Viewport
                    viewTab={view.viewport}
                    updateView={(viewTab) => updateView("viewport", viewTab)}
            />
            <ViewsContainer
                    reducedOpacity={engine.executingAnimation}
                    id="bottom"
                    setTabs={(tabs) => updateView("bottom", tabs)}
                    tabs={view.bottom}
                    resizePosition={"top"}
                    orientation={"horizontal"}
            />
        </div>
        <ViewsContainer
                reducedOpacity={engine.executingAnimation}
                id="right"
                setTabs={(tabs) => updateView("right", tabs)}
                tabs={view.right}
                orientation={"vertical"}
                leftOffset={"0%"}
                resizePosition={"top"}
        />
    </div>
    {#if !settings.hideFooter}
        <Footer/>
    {/if}
</div>


<style>
    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--pj-background-quaternary);
    }

    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--pj-background-quaternary);
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .middle {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;

    }
</style>