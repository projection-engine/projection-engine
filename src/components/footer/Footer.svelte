<script>
    import SHORTCUTS_ID from "../../data/SHORTCUTS_ID"
    import {onDestroy, onMount} from "svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import HotKeysController from "../../libs/HotKeysController";
    import Localization from "../../templates/Localization";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ErrorLoggerAPI from "../../libs/ErrorLoggerAPI";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import FrameMetadata from "./components/FrameMetadata.svelte";
    import SceneStats from "./components/SceneStats.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";

    const {shell} = window.require("electron")
    let settings = {}
    let activeView
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    onMount(() => HotKeysController.initializeListener(v => activeView = v))
    onDestroy(() => unsubscribeSettings())

    const openLogs = async () => {
        if (await NodeFS.exists(ErrorLoggerAPI.path))
            shell.openPath(ErrorLoggerAPI.path).catch()
        else
            alert.pushAlert("No logs found")
    }
</script>

<div class="wrapper" id={SHORTCUTS_ID}>
    {#if activeView != null}
        <div class="active-view">
            <Icon styles="font-size: 1rem">{activeView.icon}</Icon>
            <div>{activeView.label}</div>
            <ToolTip content={Localization.ACTIVE_SHORTCUTS}/>
        </div>
    {/if}
    <div data-vertdivider="-" style="margin: 0 2px"></div>
    <FrameMetadata settings={settings}/>


    <div class="meta-data">
        <SceneStats/>
        <div data-vertdivider="-"></div>
        <Dropdown hideArrow={true}>
            <button slot="button" class="error-logging">
                <Icon>bug_report</Icon>
            </button>
            <button on:click={() => settings.loggingEnabled = !settings.loggingEnabled}>
                {#if settings.loggingEnabled}
                    <Icon>check</Icon>
                {/if}
                {Localization.LOGGING_ENABLED}
            </button>
            <button on:click={openLogs}>
                <Icon>open_in_new</Icon>
                {Localization.SHOW_ERROR_LOGS}
            </button>
        </Dropdown>
        <div data-vertdivider="-"></div>
        <div class="version" on:click={() => shell.openExternal("https://github.com/projection-engine")}>
            {Localization.VERSION}
        </div>
    </div>
</div>

<style>

    .error-logging {
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

        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 4px;
    }

    .wrapper {
        border-top: var(--pj-border-primary) 1px solid;
        width: 100%;
        height: 25px;
        background: var(--pj-background-quaternary);

        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--pj-color-secondary);
        padding: 0 2px;
        font-size: .7rem;
    }

    .info-container > * {
        display: flex;
        gap: 4px;
        justify-content: flex-start;
        align-items: center;
    }
</style>