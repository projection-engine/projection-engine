<script>
    import SHORTCUTS_ID from "../../data/SHORTCUTS_ID"
    import {onDestroy, onMount} from "svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import HotKeys from "./libs/HotKeys";
    import Localization from "../../../shared/libs/Localization";
    import INFORMATION_CONTAINER from "../../data/INFORMATION_CONTAINER";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import ErrorLoggerAPI from "../../../shared/libs/files/ErrorLoggerAPI";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import SettingsStore from "../../stores/SettingsStore";

    const {shell} = window.require("electron")
    let settings = {}
    let activeView
    let initialized = false
    let isChanging = false
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    onMount(() => {
        HotKeys.initializeListener(v => activeView = v)
        const e = document.getElementById(INFORMATION_CONTAINER.TRANSFORMATION)
        e.isChanging = () => {
            if (isChanging)
                return
            isChanging = true
        }
        e.finished = () => isChanging = false
    })
    onDestroy(() => unsubscribeSettings())
    const translate = key => Localization.PROJECT.INFO[key]
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
            <ToolTip content={translate("ACTIVE_SHORTCUTS")}/>
        </div>
    {/if}


    <div id={INFORMATION_CONTAINER.CONTAINER} class={"info-container"}>
        <div id={INFORMATION_CONTAINER.FPS} style={isChanging ? "display: none" : undefined}></div>
        <div id={INFORMATION_CONTAINER.TRANSFORMATION} style={!isChanging ? "display: none" : undefined}></div>
    </div>

    <div class="meta-data">
        <Dropdown hideArrow={true}>
            <button slot="button" class="error-logging">
                <Icon>bug_report</Icon>
            </button>
            <button on:click={() => settings.loggingEnabled = !settings.loggingEnabled}>
                {#if settings.loggingEnabled}
                    <Icon>check</Icon>
                {/if}
                {translate("LOGGING_ENABLED")}
            </button>
            <button on:click={() => shell.openPath(ErrorLoggerAPI.path)}>
                <Icon>open_in_new</Icon>
                {translate("SHOW_ERROR_LOGS")}
            </button>
        </Dropdown>
        <div class="version" on:click={() => shell.openExternal("https://github.com/projection-engine")}>
            {translate("VERSION")}
        </div>
    </div>
</div>

<style>
    .error-logging{
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
    .meta-data {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .version {
        cursor: pointer;
    }

    .version:hover {
        text-decoration: underline;
    }

    .active-view {
        height: 20px;
        background: var(--pj-background-primary);
        border-radius: 3px;

        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 4px;
    }

    .wrapper {
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