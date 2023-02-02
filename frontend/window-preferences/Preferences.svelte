<script>
    import FrameWrapper from "../shared/components/frame/FrameWrapper.svelte";
    import {onDestroy} from "svelte";
    import ResizableBar from "../shared/components/resizable/ResizableBar.svelte";
    import SettingsStore from "../window-editor/stores/SettingsStore";
    import VisualsStore from "../window-editor/stores/VisualsStore";
    import GlobalSettings from "./components/GlobalSettings.svelte";
    import CameraSettings from "../window-editor/views/scene-editor/components/CameraSettings.svelte";
    import ContentWrapper from "./components/content/ContentWrapper.svelte";
    import Shortcuts from "./components/Shortcuts.svelte";
    import LOCALIZATION_EN from "../shared/static/LOCALIZATION_EN";
    import PREFERENCES from "./static/PREFERENCES";
    import Icon from "../shared/components/icon/Icon.svelte";

    let tab = 0

    let settings
    let visuals

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeVisuals()
    })
    $: current = PREFERENCES[tab]
</script>

<FrameWrapper/>

<div class="wrapper">
    <div class="tabs">
        {#each PREFERENCES as tabValue , i}
            <button class="tab" data-sveltebuttondefault="-" data-sveltefocusbutton="-" data-sveltehighlight={tab === i ? "-" : ""} on:click={() => tab = i}>
                <Icon>{tabValue.icon}</Icon>
                {tabValue.label}
            </button>
        {/each}
    </div>
    <ResizableBar type="width"/>
    <div class="content">
        {#if current.type === "global"}
            <fieldset>
                <legend>{LOCALIZATION_EN.GLOBAL}</legend>
                <GlobalSettings/>
            </fieldset>
        {:else if current.type === "shortcuts"}
            <fieldset>
                <legend>{LOCALIZATION_EN.SHORTCUTS}</legend>
                <Shortcuts settings={settings}/>
            </fieldset>
        {:else}
            <ContentWrapper {tab} {settings} {visuals}/>
        {/if}
    </div>
</div>

<style>
    .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 6px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 50%;
    }

    strong {
        font-weight: 500;
        padding: 4px 8px;
        font-size: .9rem;
        text-align: left;
        width: 100%;
    }

    .wrapper {
        display: flex;
        align-items: flex-start;
        gap: 3px;

        position: relative;
        margin: auto;

        padding: 3px;
        width: 100%;
        height: 100%;

        overflow-x: hidden;
        overflow-y: auto;

    }


</style>