<script>
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";
    import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
    import EditorHeader from "./EditorHeader.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import EntityStateController from "../../../libs/EntityStateController";
    import EngineStore from "../../../stores/EngineStore";

    export let settings
    export let translate
    export let setCurrentTab
    export let engine
    let ref


    const play = () => {
        if(!EngineStore.engine.executingAnimation)
            EntityStateController.startPlayState()
        else
            EntityStateController.stopPlayState()
    }
</script>


<div class={"options"} bind:this={ref}>

    <Dropdown hideArrow={true} asButton={true} buttonStyles="max-width: 22px">
        <button slot="button"  class="title">
            <Icon styles="font-size: .9rem">
                {#if settings.viewportTab === VIEWPORT_TABS.EDITOR}
                    public
                {:else}
                    grid_view
                {/if}
            </Icon>
        </button>
        <button on:click={play}>
            <Icon>play_arrow</Icon>
            {translate("PLAY")}
        </button>
        <div data-divider="-"></div>
        <button on:click={() =>SettingsStore.updateStore({...settings, viewportTab: VIEWPORT_TABS.EDITOR})}>
            {#if settings.viewportTab === VIEWPORT_TABS.EDITOR}
                <Icon>check</Icon>
            {/if}
            {translate("EDITOR")}
        </button>
        <button on:click={() =>SettingsStore.updateStore({...settings, viewportTab: VIEWPORT_TABS.UI})}>
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

    .title {
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 22px;
        min-width: 22px;
        max-height: 22px;
        max-width: 22px;
        border: none;
    }
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


</style>