<script>
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import ENTITY_TAB from "../static/ENTITY_TAB";

    export let translate
    export let tabs
    export let entity
    export let currentTab
    export let setCurrentTab


    $: currentKey =entity?Object.keys(entity.components)[currentTab] : undefined

    let initialized = false
    $: {
        if (!entity) {
            setCurrentTab("-2")
            initialized = false
        } else if (!initialized && !entity.isFolder) {
            setCurrentTab("0")
            initialized = true
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
    {/if}
    {#if entity === undefined || entity.isFolder ? null}
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

