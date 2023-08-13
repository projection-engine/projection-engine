<script>

    import FrameMetadata from "./components/PerformanceStatistics.svelte"
    import SceneStats from "./components/SceneStats.svelte"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte"
    import ElectronResources from "../../../shared/lib/ElectronResources"
    import Engine from "../../../../engine/core/Engine"
    import {onDestroy, onMount} from "svelte"
    import EntityManager from "../../../../engine/core/EntityManager"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import SettingsStore from "../../../shared/stores/SettingsStore"
    import LoggerConfig from "./components/LoggerConfig.svelte"
    import LevelManager from "@engine-core/LevelManager";
    import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";

    const COMPONENT_ID = crypto.randomUUID()
    let settings = {}

    let loadedLevel
    let entityID
    let unsubscribe

    function load() {
        const entity = EditorEntityManager.getEntity(LevelManager.loadedLevel)
        loadedLevel = entity?.name
        entityID = entity?.id

        if (entityID)
            EntityManager.removeListener(entityID, COMPONENT_ID)
        if (entity) {
            EntityManager.addEventListener("update", () => {
                loadedLevel = entity.name
            }, {targetEntityId: LevelManager.loadedLevel})
        }
    }

    onMount(() => {
        SettingsStore.getInstance().addListener(COMPONENT_ID, data => settings = data, ["hideFooter"])
        unsubscribe = EntityManager.addEventListener("hard-change", load)
        load()
    })

    onDestroy(() => {
        SettingsStore.getInstance().removeListener(COMPONENT_ID)
        unsubscribe()
    })
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
        <FrameMetadata/>
        <div data-sveltevertdivider="-" style="margin: 0 2px"></div>
        <LoggerConfig/>
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
