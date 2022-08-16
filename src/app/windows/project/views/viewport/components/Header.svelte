<script>
    import {onDestroy} from "svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Shading from "./header/ShadingOption.svelte";
    import Entity from "../../../libs/engine/templates/basic/Entity";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import ProbeComponent from "../../../libs/engine/templates/components/ProbeComponent";
    import TransformComponent from "../../../libs/engine/templates/components/TransformComponent";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
    import CameraComponent from "../../../libs/engine/templates/components/CameraComponent";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import PointLightComponent from "../../../libs/engine/templates/components/PointLightComponent";
    import DirectionalLightComponent from "../../../libs/engine/templates/components/DirectionalLightComponent";
    import Layout from "./header/Layout.svelte";
    import RendererStoreController from "../../../stores/RendererStoreController";
    import VIEWPORT_TABS from "../../../data/misc/VIEWPORT_TABS";
    import loadScripts from "../../../utils/load-scripts";
    import EditorHeader from "./header/EditorHeader.svelte";
    import CBStoreController from "../../../stores/CBStoreController";

    export let settings
    export let translate
    export let setCurrentTab
    export let engine
    let ref

    let store = {}
    const unsubscribe = CBStoreController.getStore(v => store = v)
    onDestroy(() => unsubscribe())

    $: if (window.renderer?.camera) window.renderer.camera.animated = settings.cameraAnimation
</script>


<div class={"options"} bind:this={ref}>
    <Dropdown buttonStyles="border-radius: 3px; height: 18px; background: var(--pj-border-primary);">
        <button slot="button" class="dropdown">
            <Icon>forest</Icon>
            <div data-overflow="-">
                {#if engine.currentLevel}
                    {engine.currentLevel.name}
                {:else}
                    {translate("DEFAULT_LEVEL")}
                {/if}
            </div>
        </button>
        <button on:click={() => RendererStoreController.loadLevel()}>
            {#if !engine.currentLevel}
                <Icon>check</Icon>
            {/if}
            {translate("DEFAULT_LEVEL")}
        </button>
        <div data-divider="-"></div>
        {#each store.levels as level}
            <button on:click={() => RendererStoreController.loadLevel(level)}>
                {#if engine.currentLevel?.registryID === level.registryID}
                    <Icon>check</Icon>
                {/if}
                {level.name}
            </button>
        {/each}
    </Dropdown>
    <div data-vertdivider="-" style="height: 15px"></div>
    <Dropdown>
        <button slot="button" class="dropdown">
            {#if settings.viewportTab === VIEWPORT_TABS.EDITOR}
                <Icon>account_tree</Icon>
                <div data-overflow="-">{translate("EDITOR")}</div>
            {:else}
                <Icon>grid_view</Icon>
                <div data-overflow="-">{translate("UI")}</div>
            {/if}
        </button>
        <button on:click={() => loadScripts(engine)}>
            <Icon>play_arrow</Icon>
            {translate("PLAY")}
        </button>
        <div data-divider="-"></div>
        <button on:click={() =>RendererStoreController.updateSettings({...settings, viewportTab: VIEWPORT_TABS.EDITOR})}>
            {#if settings.viewportTab === VIEWPORT_TABS.EDITOR}
                <Icon>check</Icon>
            {/if}
            {translate("EDITOR")}
        </button>
        <button on:click={() =>RendererStoreController.updateSettings({...settings, viewportTab: VIEWPORT_TABS.UI})}>
            {#if settings.viewportTab === VIEWPORT_TABS.UI}
                <Icon>check</Icon>
            {/if}
            {translate("UI")}
        </button>
    </Dropdown>
    <div data-vertdivider="-" style="height: 15px"></div>
    <EditorHeader
            settings={settings}
            engine={engine}
            translate={translate}
    />
</div>

<style>
    .options {
        display: flex;
        align-items: center;
        gap: 4px;
        width: 100%;
        padding: 0 2px;
        height: 23px;
        user-select: none;
    }

    .dropdown {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        height: 18px;
        border-radius: 3px;
        overflow: hidden;
        padding: 0 0 0 4px;
        border: none;
    }
</style>