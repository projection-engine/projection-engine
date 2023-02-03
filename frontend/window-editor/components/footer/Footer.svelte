<script>
    import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
    import ErrorLoggerAPI from "../../lib/fs/ErrorLoggerAPI";
    import FrameMetadata from "./components/FrameMetadata.svelte";
    import SceneStats from "./components/SceneStats.svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import FS from "../../../shared/lib/FS/FS";
    import ElectronResources from "../../../shared/lib/ElectronResources";
    import Console from "./components/Console.svelte";


    export let settings
    export let engine

    const openLogs = async () => {
        if (FS.exists(ErrorLoggerAPI.path))
            ElectronResources.shell.openPath(ErrorLoggerAPI.path).catch()
        else
            console.error("No logs found")
    }
</script>

<div class="wrapper" style={settings.hideFooter ? "display: none" : undefined}>

    <div class="meta-data" style="justify-content: flex-start">
        <FrameMetadata settings={settings}/>
        <div data-sveltevertdivider="-" style="margin: 0 2px"></div>
        <Console engine={engine}/>
        <div data-sveltevertdivider="-" style="margin: 0 2px"></div>
        <button data-sveltebuttondefault="-" on:click={openLogs} class="error-logging">
            <Icon>bug_report</Icon>
            <ToolTip content={LOCALIZATION_EN.SHOW_RECENT_ERRORS}/>
        </button>
    </div>

    <div class="meta-data" style="justify-content: flex-end">
        <SceneStats/>
        <div data-sveltevertdivider="-"></div>
        <div class="version" on:click={() => ElectronResources.shell.openExternal("https://github.com/projection-engine")}>
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
        max-height: 18px;
        min-height: 18px;
        max-width: 18px;
        min-width: 18px;
    }

    .meta-data {
        width: 100%;
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