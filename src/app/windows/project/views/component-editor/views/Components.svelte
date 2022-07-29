<script>
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import ENTITY_TAB from "../static/ENTITY_TAB";

    export let translate
    export let tabs
    export let engine
    export let currentTab
    export let setCurrentTab

    let entity
    let currentKey

    $: {
        if (engine.selectedEntity) {
            entity = engine.selectedEntity
            currentKey = Object.keys(entity.components)[currentTab]
        }
    }

</script>

<div class="wrapper">
    <button
            class="button"
            data-highlight={currentTab === "-2" ? "-" : undefined}
            on:click={() => setCurrentTab("-2")}
    >
        <Icon>image</Icon>
        <ToolTip content={translate("RENDERING")}/>
    </button>
    <button
            class="button"
            data-highlight={currentTab === "-3" ? "-" : undefined}
            on:click={() => setCurrentTab("-3")}
    >
        <Icon>videocam</Icon>
        <ToolTip content={translate("POST_PROCESSING")}/>
    </button>
    {#if entity !== undefined && !entity.isFolder}
        <div class="divider"></div>
        <button
                data-highlight={currentTab === ENTITY_TAB ? "-" : undefined}
                class="button"
                on:click={() => setCurrentTab(ENTITY_TAB)}>
            <Icon>terminal</Icon>
            <ToolTip content={translate("SCRIPTS")} animationDelay={"0ms"}/>
        </button>
    {/if}
    {#each tabs as t, i}
        <button
                data-highlight={currentKey === t.key ? "-" : undefined}
                class="button"
                on:click={() => setCurrentTab(Object.keys(entity.components).findIndex(e => e === t.key))}>
            <Icon>{t.icon}</Icon>
            <ToolTip content={t.label} animationDelay={"0ms"}/>
        </button>
    {/each}
</div>


<style>
    .wrapper {
        display: grid;
        width: 30px;
        align-content: flex-start;
        gap: 4px;
        padding: 2px;
        border-right: var(--pj-border-primary) 1px solid;
        background: var(--pj-background-tertiary);
        position: sticky;
        top: 0;
    }

    .button {
        padding: 0 !important;
        width: 23px;
        height: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 3px;
    }

    .divider {
        width: 100%;
        height: 2px;
        background-color: var(--pj-border-primary);
    }

</style>