<script>
    import Icon from "../../../../../components/icon/Icon.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import RendererStoreController from "../../../stores/RendererStoreController";
    import VIEWPORT_TABS from "../../../data/misc/VIEWPORT_TABS";
    import loadScripts from "../../../utils/load-scripts";
    import EditorHeader from "./header/EditorHeader.svelte";
    import CameraTracker from "../../../libs/engine/editor/libs/CameraTracker";

    export let settings
    export let translate
    export let setCurrentTab
    export let engine
    let ref


    $: CameraTracker.animated = settings.cameraAnimation
</script>


<div class={"options"} bind:this={ref}>

    <Dropdown hideArrow={true}>
        <button slot="button" class="dropdown">
            <Icon style="font-size: 1rem">
                {#if settings.viewportTab === VIEWPORT_TABS.EDITOR}
                    public
                {:else}
                    grid_view
                {/if}
            </Icon>
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
        min-height: 28px;
        max-height: 28px;
        user-select: none;
    }

    .dropdown {
        display: flex;
        align-items: center;
        overflow: hidden;
        min-height: 25px;
        max-height: 25px;


        background: var(--pj-background-tertiary);
    }
</style>