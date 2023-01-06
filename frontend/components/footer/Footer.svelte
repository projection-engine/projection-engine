<script>
    import LOCALIZATION_EN from "../../views/editor/static/LOCALIZATION_EN";
    import ErrorLoggerAPI from "../../views/editor/lib/fs/ErrorLoggerAPI";
    import FrameMetadata from "./components/FrameMetadata.svelte";
    import SceneStats from "./components/SceneStats.svelte";
    import ScriptsAPI from "../../../engine-core/lib/utils/ScriptsAPI";
    import UIAPI from "../../../engine-core/lib/rendering/UIAPI";
    import FilesAPI from "../../views/editor/lib/fs/FilesAPI";
    import Icon from "../icon/Icon.svelte";
    import Dropdown from "../dropdown/Dropdown.svelte";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import FS from "../../lib/FS/FS";
    import AlertController from "../alert/AlertController";

    const {shell} = window.require("electron")

    export let settings
    export let engine


    const openLogs = async () => {
        if (FS.exists(ErrorLoggerAPI.path))
            shell.openPath(ErrorLoggerAPI.path).catch()
        else
            console.error("No logs found")
    }
    async function updateStructure() {
        AlertController.warn(LOCALIZATION_EN.UPDATING_STRUCTURE)

        await ScriptsAPI.updateAllScripts()
        await UIAPI.updateAllElements()

        AlertController.success(LOCALIZATION_EN.DONE)
    }
</script>

<div class="wrapper" style={settings.hideFooter ? "display: none" : undefined}>
    <FrameMetadata settings={settings}/>
    <div class="meta-data">
        <button
                class="button frame"
                style="max-width: unset; font-size: .7rem; padding: 0 4px; max-height: 25px; min-height: unset"
                on:click={updateStructure}
                disabled={engine.executingAnimation}
        >
            <Icon styles="font-size: 1rem">refresh</Icon>
            {LOCALIZATION_EN.REFRESH_STRUCTURE}
            <ToolTip content={LOCALIZATION_EN.REFRESH_SCRIPTS_AND_PROBES}/>
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
                {LOCALIZATION_EN.LOGGING_ENABLED}
            </button>
            <button on:click={openLogs}>
                <Icon>open_in_new</Icon>
                {LOCALIZATION_EN.SHOW_ERROR_LOGS}
            </button>
            <button on:click={() => FilesAPI.deleteFile(ErrorLoggerAPI.path)}>
                <Icon>delete_forever</Icon>
                {LOCALIZATION_EN.CLEAR_CACHE}
            </button>
        </Dropdown>
        <div data-vertdivider="-"></div>
        <div class="version" on:click={() => shell.openExternal("https://github.com/projection-engine")}>
            {LOCALIZATION_EN.VERSION}
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