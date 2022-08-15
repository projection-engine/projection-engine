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

    export let settings
    export let translate
    export let setCurrentTab
    export let currentTab
    export let engine
    let ref



    $: if (window.renderer?.camera) window.renderer.camera.animated = settings.cameraAnimation
</script>


<div class={"options"} bind:this={ref}>
    <Dropdown buttonStyles="border-radius: 3px; height: 17px; background: var(--pj-border-primary);">
        <button slot="button" class="dropdown">
            {#if currentTab === VIEWPORT_TABS.EDITOR}
                <Icon>account_tree</Icon>
                <div data-overflow="-">{translate("EDITOR")}</div>
            {:else}
                <Icon>forest</Icon>
                <div data-overflow="-">{translate("UI")}</div>
            {/if}

        </button>
        <button on:click={() => loadScripts(engine)}>
            <Icon>play_arrow</Icon>
            {translate("PLAY")}
        </button>
        <div data-divider="-"></div>
        <button on:click={() => setCurrentTab(VIEWPORT_TABS.EDITOR)}>
            {#if currentTab === VIEWPORT_TABS.EDITOR}
                <Icon>check</Icon>
            {/if}
            {translate("EDITOR")}
        </button>
        <button on:click={() => setCurrentTab(VIEWPORT_TABS.UI)}>
            {#if currentTab === VIEWPORT_TABS.UI}
                <Icon>check</Icon>
            {/if}
            {translate("UI")}
        </button>
    </Dropdown>
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

        width: fit-content;
        --color-to-apply: white;
        font-size: 0.7rem;
        height: 17px;
        border-radius: 3px;
        overflow: hidden;
        padding: 0 !important;
        padding-left: 4px !important;
        border: none !important;
    }
</style>