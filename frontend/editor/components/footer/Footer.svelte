<script>
    import {onDestroy} from "svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ErrorLoggerAPI from "../../lib/fs/ErrorLoggerAPI";
    import SettingsStore from "../../stores/SettingsStore";
    import FrameMetadata from "./components/FrameMetadata.svelte";
    import SceneStats from "./components/SceneStats.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import ScriptsAPI from "../../../../engine-core/lib/utils/ScriptsAPI";
    import UIAPI from "../../../../engine-core/lib/rendering/UIAPI";
    import FilesAPI from "../../lib/fs/FilesAPI";

    const {shell} = window.require("electron")

    export let engine
    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => unsubscribeSettings())

    const openLogs = async () => {
        if (await NodeFS.exists(ErrorLoggerAPI.path))
            shell.openPath(ErrorLoggerAPI.path).catch()
        else
            window.consoleAPI.error("No logs found")
    }
    async function updateStructure() {
        window.consoleAPI.warn(Localization.UPDATING_STRUCTURE)

        await ScriptsAPI.updateAllScripts()
        await UIAPI.updateAllElements()

        window.consoleAPI.log(Localization.DONE)
    }
</script>

<div class="wrapper">
    <FrameMetadata settings={settings}/>
    <div class="meta-data">
        <button
                class="button frame"
                style="max-width: unset; font-size: .7rem; padding: 0 4px; max-height: 25px; min-height: unset"
                on:click={updateStructure}
                disabled={engine.executingAnimation}
        >
            <Icon styles="font-size: 1rem">refresh</Icon>
            {Localization.REFRESH_STRUCTURE}
            <ToolTip content={Localization.REFRESH_SCRIPTS_AND_PROBES}/>
        </button>
        <div data-vertdivider="-"></div>
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
            <button on:click={() => FilesAPI.deleteFile(ErrorLoggerAPI.path)}>
                <Icon>delete_forever</Icon>
                {Localization.CLEAR_CACHE}
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