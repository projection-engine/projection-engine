<script>
    import {onDestroy} from "svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
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

    let settings
    let visuals

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)
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
  <div class="content">
      {#if tab === 0}
          <strong>{Localization.VIEWPORT}</strong>
          <ViewportSettings settings={settings}/>
      {:else if tab === 1}

          <strong>{Localization.RENDERING}</strong>
          <Rendering visualSettings={visuals}/>

      {:else if tab === 2}

          <strong>{Localization.SHORTCUTS}</strong>
          <Shortcuts settings={settings}/>

      {:else if tab === 3}

          <strong>{Localization.CAMERA}</strong>
          <CameraSettings/>

      {:else if tab === 4}

          <strong>{Localization.GRID}</strong>
          <GridSettings settings={settings}/>
      {/if}
  </div>
</div>

<style>
    .content{
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
        max-width: clamp(500px, 50vw, 1000px);
        height: 100%;

        overflow-x: hidden;
        overflow-y: auto;

    }


</style>