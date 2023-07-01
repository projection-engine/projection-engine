<script>
    import FrameWrapper from "../shared/components/frame/FrameWrapper.svelte"
    import {onDestroy, onMount} from "svelte"
    import ResizableBar from "../shared/components/resizable/ResizableBar.svelte"
    import SettingsStore from "../stores/SettingsStore"
    import VisualsStore from "../stores/VisualsStore"
    import GlobalSettings from "./components/GlobalSettings.svelte"
    import ContentWrapper from "./components/content/ContentWrapper.svelte"
    import Shortcuts from "./components/Shortcuts.svelte"
    import PREFERENCES from "./static/PREFERENCES"
    import Icon from "../shared/components/icon/Icon.svelte"
    import StoreIPCListener from "../shared/lib/StoreIPCListener"

    const COMPONENT_ID = crypto.randomUUID()
    let tab = 0
    let settings
    let visuals

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    onMount(() => {
    	StoreIPCListener.get()
    })
    onDestroy(() => {
    	unsubscribeSettings()
    	unsubscribeVisuals()
    })
    $: current = PREFERENCES[tab]
</script>

<FrameWrapper noChangeTracking={true}/>

<div class="wrapper">
    <div class="tabs">
        {#each PREFERENCES as tabValue , i}
            <button class="tab" data-sveltebuttondefault="-" data-sveltehighlight={tab === i ? "-" : ""}
                    on:click={() => tab = i}>
                <Icon>{tabValue.icon}</Icon>
                {tabValue.label}
            </button>
        {/each}
    </div>
    <ResizableBar type="width"/>
    <div class="content">
        {#if current.type === "global"}
            <GlobalSettings/>
        {:else if current.type === "shortcuts"}
            <Shortcuts settings={settings}/>
        {:else}
            <ContentWrapper {tab}/>
        {/if}
    </div>
</div>

<style>
    .tabs {

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 4px;
        width: 250px;
        height: 100%;
    }

    .tab {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;

        width: 100%;
        height: 25px;
        background: var(--pj-background-secondary);
        border: none;
    }

    .tab[data-sveltehighlight="-"] {
        background: var(--pj-accent-color);
        color: white;
    }

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
        background: var(--pj-background-quaternary);
    }


</style>