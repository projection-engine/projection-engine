<script>
    import SHORTCUTS_ID from "../../data/misc/SHORTCUTS_ID"
    import {onDestroy, onMount} from "svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import RendererStoreController from "../../stores/RendererStoreController";
    import HotKeys from "./libs/HotKeys";
    import Localization from "../../../../libs/Localization";
    import INFORMATION_CONTAINER from "../../data/misc/INFORMATION_CONTAINER";

    const {shell} = window.require("electron")
    let settings = {}
    let activeView
    let initialized = false
    let isChanging = false
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)

    onMount(() => {
        HotKeys.initializeListener(v => activeView = v)
        const e= document.getElementById(INFORMATION_CONTAINER.TRANSFORMATION)
        e.isChanging = () => {
            if(isChanging)
                return
            isChanging = true
        }
        e.finished = () => isChanging = false
    })
    onDestroy(() => unsubscribeSettings())
</script>

<div
        class="wrapper"
        id={SHORTCUTS_ID}
        style={settings.visible.metrics ? undefined :"display: none"}
>

        {#if activeView != null && !isChanging}
            <div class="active-view">
                <Icon styles="font-size: 1rem">{activeView.icon}</Icon>
                <div>{activeView.label}</div>
            </div>
        {/if}



        <div id={INFORMATION_CONTAINER.CONTAINER} class={"info-container"}>
            <div id={INFORMATION_CONTAINER.FPS} style={isChanging ? "display: none" : undefined}></div>
            <div id={INFORMATION_CONTAINER.TRANSFORMATION}></div>
        </div>

    <div class="version" on:click={() => shell.openExternal("https://github.com/projection-engine")}>
        {Localization.PROJECT.INFO.VERSION}
    </div>
</div>

<style>
    .version{
        margin-left: auto;
        cursor: pointer;
    }
    .version:hover{
        text-decoration: underline;
    }
    .active-view{
        height: 20px;
        background: var(--pj-background-primary);
        border-radius: 3px;

        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 4px;
    }
    .wrapper{
            width: 100%;
        height: 25px;
        background: var(--pj-background-tertiary);
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--pj-color-secondary);
        padding: 0 2px;
        font-size: .7rem;
    }

    .info-container {
        height: 23px;
        font-size: .7rem;
        display: flex;
        gap: 4px;
        justify-content: space-between;
        align-items: center;
        padding: 0 4px;
        background: var(--pj-background-tertiary);
        color: var(--pj-color-secondary);
    }

    .info-container > * {
        display: flex;
        gap: 4px;
        justify-content: flex-start;
        align-items: center;
    }
</style>