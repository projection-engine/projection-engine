<script>
    import SHORTCUTS_ID from "../../data/SHORTCUTS_ID"
    import {onDestroy, onMount} from "svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import HotKeysController from "../../../shared/libs/HotKeysController";
    import Localization from "../../../shared/libs/Localization";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ErrorLoggerAPI from "../../../shared/libs/ErrorLoggerAPI";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import ConsoleAPI from "../../../../public/engine/production/apis/ConsoleAPI";
    import FrameMetadata from "./components/FrameMetadata.svelte";
    import SceneStats from "./components/SceneStats.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";

    const {shell} = window.require("electron")
    let settings = {}
    let activeView
    let hasMessage = false

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onMount(() => {
        let timeout
        HotKeysController.initializeListener(v => activeView = v)
        ConsoleAPI.initialize(() => {
            hasMessage = true
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                hasMessage = false
            }, 3500)
        })


    })
    onDestroy(() => unsubscribeSettings())
    const translate = key => Localization.PROJECT.INFO[key]
    const openLogs = async () => {
        if (await NodeFS.exists(ErrorLoggerAPI.path))
            shell.openPath(ErrorLoggerAPI.path)
        else
            alert.pushAlert("No logs found")
    }
</script>

<div
        class="wrapper"
        id={SHORTCUTS_ID}
>

    {#if activeView != null}
        <div class="active-view">
            <Icon styles="font-size: 1rem">{activeView.icon}</Icon>
            <div>{activeView.label}</div>
            <ToolTip content={translate("ACTIVE_SHORTCUTS")}/>
        </div>
    {/if}
    <div data-vertdivider="-" style="margin: 0 2px"></div>
    <FrameMetadata settings={settings}/>


    <div class="meta-data">
        <SceneStats/>
        <div data-vertdivider="-"></div>
        {#if hasMessage}
            <div class="console">
                <Icon styles="font-size: .9rem; color: darkorange">info</Icon>
                <div>{translate("NEW_MESSAGE")}</div>
            </div>
            <div data-vertdivider="-"></div>
        {/if}
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
            <button on:click={openLogs}>
                <Icon>open_in_new</Icon>
                {translate("SHOW_ERROR_LOGS")}
            </button>
        </Dropdown>
        <div data-vertdivider="-"></div>
        <div class="version" on:click={() => shell.openExternal("https://github.com/projection-engine")}>
            {translate("VERSION")}
        </div>
    </div>
</div>

<style>
    .console {
        display: flex;
        align-items: center;
        gap: 2px;
        color: var(--pj-color-quinary);
    }

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

    .info-container > * {
        display: flex;
        gap: 4px;
        justify-content: flex-start;
        align-items: center;
    }
</style>