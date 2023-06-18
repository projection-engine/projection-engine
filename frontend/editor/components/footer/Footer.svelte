<script>

    import ErrorLoggerService from "../../services/file-system/ErrorLoggerService"
    import FrameMetadata from "./components/FrameMetadata.svelte"
    import SceneStats from "./components/SceneStats.svelte"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte"
    import FileSystemService from "../../../shared/lib/FileSystemService"
    import ElectronResources from "../../../shared/lib/ElectronResources"
    import Console from "./components/Console.svelte"
    import Engine from "../../../../engine-core/Engine"
    import {onDestroy, onMount} from "svelte"
    import EntityUpdateService from "../../services/engine/EntityUpdateService"
    import LocalizationEN from "../../../../shared/LocalizationEN"


    export let settings
    export let engine

    const openLogs = async () => {
    	if (FileSystemService.getInstance().exists(ErrorLoggerService.path))
    		ElectronResources.shell.openPath(ErrorLoggerService.path).catch()
    }
    let loadedLevel
    const ID = crypto.randomUUID()
    let entityID

    function load() {
    	loadedLevel = Engine.loadedLevel?.name
    	entityID = Engine.loadedLevel?.id

    	if (entityID)
    		EntityUpdateService.removeListener(entityID, ID)

    	if (!loadedLevel)
    		return
    	EntityUpdateService.addListener(entityID, ID, () => {
    		loadedLevel = Engine.loadedLevel.name
    	})
    }

    onMount(() => {
    	Engine.addLevelLoaderListener(ID, load)
    	load()
    })
    onDestroy(() => Engine.removeLevelLoaderListener(ID))
</script>

<div class="container" style={settings.hideFooter ? "display: none" : undefined}>

    <div class="meta-data" style="justify-content: flex-start">
        {#if loadedLevel}
            <div class="wrapper footer-header"
                 style="max-width: clamp(100px, 5vw, 100px); background: var(--pj-background-primary)">
                <Icon styles="font-size: .9rem">forest</Icon>
                <small data-svelteoverflow="-">{loadedLevel}</small>
                <ToolTip content={LocalizationEN.LOADED_LEVEL}/>
            </div>
            <div data-sveltevertdivider="-" style="margin: 0 2px"></div>
        {/if}
        <FrameMetadata settings={settings}/>
        <div data-sveltevertdivider="-" style="margin: 0 2px"></div>
        <Console engine={engine}/>
        <div data-sveltevertdivider="-" style="margin: 0 2px"></div>
        <button data-sveltebuttondefault="-" on:click={openLogs} class="error-logging">
            <Icon>bug_report</Icon>
            <ToolTip content={LocalizationEN.SHOW_RECENT_ERRORS}/>
        </button>
    </div>

    <div class="meta-data" style="justify-content: flex-end">
        <SceneStats/>
        <div data-sveltevertdivider="-"></div>
        <div class="version"
             on:click={() => ElectronResources.shell.openExternal("https://github.com/projection-engine")}>
            {LocalizationEN.VERSION}
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


    .container {
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