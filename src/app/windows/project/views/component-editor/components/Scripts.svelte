<script>
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import ScriptRow from "./ScriptRow.svelte";

    export let entity

    const quickAccess = useContext(QuickAccessProvider)

    let state = []
    let previousID

    $: {
        if (previousID !== entity.id) {
            previousID = entity.id
            state = [...entity.scriptsMap]
        }
    }
</script>
<div class="wrapper">
    <Selector
            type={"script"}
            selected={undefined}
            autoClose={true}
            handleChange={d => {
                    if (d && !state.find(s => s === d.registryID)) {
                        entity.scriptsMap.push(d.registryID)
                        state =  [...state, d.registryID]

                    }else if(state.find(s => s === d.registryID))
                        alert.pushAlert("Script already linked", "info")
                }}
    >
        <div class="inline add">
            <Icon>add</Icon>
            Add new component
        </div>
    </Selector>

    <label class=label>
        Linked scripts
    </label>
    {#if state.length > 0}
        {#each state as s, index}
            <ScriptRow
                selected={s}
                scripts={quickAccess.scripts}
                submit={key => {
                    const newScripts = state.filter(s => s !== key)
                    entity.scripts = newScripts
                    state = newScripts
                }}
            />
        {/each}
    {:else}
        <div class="empty">
            <Icon styles="font-size: 30px">folder</Icon>
            No linked blueprints
        </div>
    {/if}
</div>
<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
    }
</style>