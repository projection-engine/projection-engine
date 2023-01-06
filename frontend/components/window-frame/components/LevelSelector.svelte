<script>
    import LevelController from "../../../views/editor/lib/utils/LevelController";
    import LOCALIZATION_EN from "../../../views/editor/static/LOCALIZATION_EN";
    import Icon from "../../icon/Icon.svelte";
    import ToolTip from "../../tooltip/ToolTip.svelte";
    import Dropdown from "../../dropdown/Dropdown.svelte";

    export let store
    export let engine

</script>
<Dropdown>
    <button slot="button" class="button frame" style="max-width: unset; background: transparent; padding: 0 4px;"
            disabled={engine.executingAnimation}>
        <Icon>forest</Icon>
        <div data-overflow="-">
            {#if engine.currentLevel}
                {engine.currentLevel.name}
            {:else}
                {LOCALIZATION_EN.DEFAULT_LEVEL}
            {/if}
        </div>
        <ToolTip content={LOCALIZATION_EN.LEVEL}/>
    </button>
    <button on:click={() => LevelController.loadLevel()} style="max-width: unset; min-height: unset">
        {#if !engine.currentLevel}
            <Icon styles="font-size: 1rem">check</Icon>
        {:else}
            <div style="width: .9rem"></div>
        {/if}
        {LOCALIZATION_EN.DEFAULT_LEVEL}
    </button>
    <div data-divider="-"></div>
    {#each store.levels as level}
        <button on:click={() => LevelController.loadLevel(level)} style="max-width: unset; min-height: unset">
            {#if engine.currentLevel?.registryID === level.registryID}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: .9rem"></div>
            {/if}
            {level.name}
        </button>
    {/each}
</Dropdown>

