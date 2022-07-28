<script>
    import Icon from "../../../../../components/Icon/Icon.svelte";

    export let scripts
    export let selected
    export let submit

    $: found = scripts.find(s => s.registryID === selected)
</script>


{#if found}
    <div class="scriptsList">
        <div data-overflow="-">
            {found.name}
        </div>
        <button style="--pj-accent-color: #ff5555" class="buttonScriptsList"
                onClick={() => submit(selected)}>
            <Icon>close</Icon>
        </button>
    </div>
{/if}
