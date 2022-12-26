<script>
    import {onDestroy, onMount} from "svelte";
    import RENDER_TARGET from "../../../static/RENDER_TARGET";
    import SelectBox from "../../../components/select-box/SelectBox.svelte";
    import GIZMOS from "../../../static/GIZMOS.ts";
    import Loader from "../../lib/parsers/Loader";
    import GizmoSystem from "../../../../engine-tools/runtime/GizmoSystem";
    import dragDrop from "../../../components/drag-drop/drag-drop";
    import SelectionStore from "../../stores/SelectionStore";
    import viewportContext from "../../templates/viewport-context";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import CameraSettings from "./components/CameraSettings.svelte";
    import Header from "./Header.svelte";
    import EngineStore from "../../stores/EngineStore";
    import SettingsStore from "../../stores/SettingsStore";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import EntityInformation from "./components/EntityInformation.svelte";
    import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
    import Engine from "../../../../engine-core/Engine";
    import EntityStateController from "../../lib/controllers/EntityStateController";
    import ViewportInteractionHandler from "./lib/ViewportInteractionHandler";
    import getUnderSelectionBox from "./utils/get-under-selection-box";
    import GizmoSettings from "./components/GizmoSettings.svelte";
    import SHADING_MODELS from "../../../../engine-core/static/SHADING_MODELS";
    import ToolTip from "../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../components/icon/Icon.svelte";
    import ContextMenuController from "../../../lib/context-menu/ContextMenuController";
    import GPU from "../../../../engine-core/GPU";

    let selectedSize = -1
    let mainEntity
    let isOnGizmo = false
    let engine = {}
    let settings = {}

    const draggable = dragDrop(false)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeSelection = SelectionStore.getStore(_ => {
        selectedSize = SelectionStore.engineSelected.length
        mainEntity = Engine.entitiesMap.get(SelectionStore.engineSelected[0])
    })

    $: isSelectBoxDisabled = settings.gizmo !== GIZMOS.NONE
    $: {
        if (settings?.viewportHotkeys != null)
            ContextMenuController.mount(
                viewportContext(settings),
                RENDER_TARGET,
                ["data-viewport"]
            )
    }

    onMount(() => {
        GizmoSystem.onStart = () => isOnGizmo = true
        GizmoSystem.onStop = () => isOnGizmo = false

        Engine.start()
        CameraTracker.startTracking()
        ViewportInteractionHandler.initialize()
        draggable.onMount({
            targetElement: GPU.canvas,
            onDrop: (data, event) => {
                Loader.load(data, false, event.clientX, event.clientY).catch()
            },
            onDragOver: () => `
                <span data-icon="-" style="font-size: 70px">add</span>
                ${LOCALIZATION_EN.DRAG_DROP}
            `
        })
    })

    onDestroy(() => {
        GizmoSystem.onStop = GizmoSystem.onStart = undefined

        unsubscribeEngine()
        unsubscribeSettings()
        ContextMenuController.destroy(RENDER_TARGET)
        draggable.onDestroy()
        unsubscribeSelection()
        ViewportInteractionHandler.destroy()
    })
    $: focusedCamera = engine.focusedCamera ? Engine.entitiesMap.get(engine.focusedCamera) : null
</script>

{#if !engine.executingAnimation}
    <ViewHeader>
        {#if isOnGizmo}
            <EntityInformation mainEntity={mainEntity} selectedSize={selectedSize} settings={settings} engine={engine}/>
        {:else}
            <Header settings={settings} engine={engine}/>
        {/if}
    </ViewHeader>
    <SelectBox
            targetElement={GPU.canvas}
            allowAll={true}
            targetElementID={RENDER_TARGET}
            disabled={isSelectBoxDisabled}
            setSelected={getUnderSelectionBox}
            selected={[]}
            nodes={[]}
    />
    <div class="top-bar">
        <GizmoSettings settings={settings} engine={engine}/>
        <CameraSettings engine={engine} settings={settings}/>
    </div>
    {#if focusedCamera}
        <div class="focused-camera" data-inline="-">
            <Icon styles="font-size: .85rem">videocam</Icon>
            {focusedCamera.name}
        </div>
    {/if}
    {#if settings.shadingModel === SHADING_MODELS.LIGHT_QUANTITY}
        <div class="complexity-gradient">
            <small>{LOCALIZATION_EN.NO_CONTRIBUTION}</small>
            <small>{LOCALIZATION_EN.ALL_SCENE_LIGHTS}</small>
        </div>
    {:else if settings.shadingModel === SHADING_MODELS.LIGHT_COMPLEXITY}
        <div class="complexity-gradient">
            <small>{LOCALIZATION_EN.NO_CONTRIBUTION}</small>
            <small>{LOCALIZATION_EN.MAXIMUM_NUMBER_OF_LIGHTS}</small>
        </div>
    {/if}
{:else}
    <button class="stop-button" on:click={() => EntityStateController.stopPlayState()}>
        <Icon styles="font-size: .85rem">pause</Icon>
        <ToolTip content={LOCALIZATION_EN.STOP}/>
    </button>
{/if}

<style>
    .complexity-gradient{
        position: absolute;
        z-index: 10;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 75%;
        padding: 6px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        background: linear-gradient(0.25turn, blue, red);
        height: 40px;
        border-radius: 5px;
        box-shadow: rgb(0 0 0 / 20%) 2px 4px 10px 2px;
    }

    .focused-camera {
        position: absolute;
        bottom: 4px;
        left: 4px;
        border-radius: 25px;
        height: 25px;
        background: var(--pj-accent-color);
        color: white;
        gap: 6px;
        padding: 8px;
        font-size: .7rem;
        z-index: 999;
        box-shadow: var(--pj-boxshadow);
    }

    .stop-button {
        position: absolute;
        top: 4px;
        left: 4px;
        height: 35px;
        width: 35px;
        background: var(--pj-background-primary);

        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }

    .top-bar {
        position: absolute;
        padding: 2px;

        z-index: 10;
        top: 28px;
        width: 100%;
        left: 0;

        display: flex;
        justify-content: space-between;
        align-items: flex-start;

    }
</style>