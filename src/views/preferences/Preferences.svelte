<script>
    import {onDestroy} from "svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import PostProcessing from "./components/PostProcessing.svelte";
    import Rendering from "./components/Rendering.svelte";
    import ViewportSettings from "./components/ViewportSettings.svelte";
    import Shortcuts from "./components/Shortcuts.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import VisualsStore from "../../stores/VisualsStore";
    import CameraSettings from "./components/CameraSettings.svelte";
    import GridSettings from "./components/GridSettings.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import TABS from "./TABS";
    import "../../css/shared.css"

    let settings
    let visuals

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    let timeout
    let tab = 0


    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeVisuals()
    })
</script>

<div class="wrapper">
    <div class="tabs shared">
        {#each TABS as button, index}
            <button
                    data-highlight={tab === index ? "-" : undefined}
                    class="tab-button shared"
                    on:click={_ => tab = index}
            >
                <Icon styles="font-size: .9rem">{button.icon}</Icon>
                <ToolTip content={button.label}/>
            </button>
        {/each}
    </div>
    {#if tab === 0}
        <fieldset>
            <legend>{Localization.VIEWPORT}</legend>
            <ViewportSettings settings={settings}/>
        </fieldset>
    {:else if tab === 1}
        <fieldset>
            <legend>{Localization.RENDERING}</legend>
            <Rendering visualSettings={visuals}/>
        </fieldset>
    {:else if tab === 2}
        <fieldset>
            <legend>{Localization.SHORTCUTS}</legend>
            <Shortcuts settings={settings}/>
        </fieldset>
    {:else if tab === 3}
        <fieldset>
            <legend>{Localization.CAMERA}</legend>
            <CameraSettings/>
        </fieldset>
    {:else if tab === 4}
        <fieldset>
            <legend>{Localization.GRID}</legend>
            <GridSettings settings={settings}/>
        </fieldset>
    {:else if tab === 5}
        <fieldset>
            <legend>{Localization.EDITOR_POST_PROCESSING}</legend>
            <PostProcessing visualSettings={visuals}/>
        </fieldset>
    {/if}
</div>

<style>

    .wrapper {
        display: flex;
        align-items: flex-start;
        gap: 6px;


        position: relative;
        margin: auto;

        padding: 3px 3px 100px;
        width: 100%;
        max-width: clamp(500px, 50vw, 1000px);
        height: 100%;

        overflow-x: hidden;
        overflow-y: auto;

    }


</style>