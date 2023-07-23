<script>
    import NATIVE_COMPONENTS from "../static/NATIVE_COMPONENTS"
    import EditorActionHistory from "../../../services/EditorActionHistory"
    import Icon from "../../../../shared/components/icon/Icon.svelte"

    export let offset
    export let entity
</script>
<div data-sveltebuttongrouprow="-">
    {#each [NATIVE_COMPONENTS[offset], NATIVE_COMPONENTS[offset + 1], NATIVE_COMPONENTS[offset + 2]] as data}
        {#if data}
            <button
                    data-svelteinline="-"
                    on:click={(e) =>{
                    EditorActionHistory.save(entity)
                    entity.addComponent(data[0])
                    EditorActionHistory.save(entity)
                    e.target.closeDropdown()

                }}
            >
                <Icon styles="font-size: 1rem">{data[2]}</Icon>
                <small data-svelteoverflow="-">{data[1]}</small>
            </button>
        {/if}
    {/each}
</div>
