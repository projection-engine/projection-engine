<script>
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import FileStoreController from "../../../stores/FileStoreController";
    import {onDestroy} from "svelte";
    import componentConstructor from "../../content-browser/libs/component-constructor";

    export let translate
    export let tabs
    export let engine
    export let currentTab
    export let setCurrentTab

    let entity
    let currentKey

    $: {
        entity = engine.selectedEntity
        if (entity)
            currentKey = Object.keys(entity.components)[currentTab]

    }
    let store = {}
    const unsubscribeStore = FileStoreController.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())

    $: console.log(store)
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
    {#if entity != null && !entity.isFolder}
        <div class="divider"></div>
    {/if}
    {#each tabs as t, i}
        <button
                data-highlight={currentKey === t.key ? "-" : undefined}
                class="button"
                on:click={() => setCurrentTab(Object.keys(entity.components).findIndex(e => e === t.key))}>
            <Icon>{t.icon}</Icon>
            <ToolTip>
                {t.label}
            </ToolTip>
        </button>
    {/each}
    {#if entity != null && !entity.isFolder}
        <div class="divider"></div>
        <Dropdown hideArrow={true} disabled={store.components.length === 0}>
            <button slot="button" class="button" disabled={store.components.length === 0}>
                <Icon>add</Icon>
                <ToolTip content={translate("LINK_COMPONENT")}/>
            </button>
            {#each store.components as script}
                <button on:click={async () => componentConstructor(entity, script)}>
                    {script.name}
                </button>
            {/each}
        </Dropdown>
    {/if}
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