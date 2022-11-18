<script>
    import {onMount} from "svelte";

    export let data
    export let setSelected
    export let selectionMap

    $: isSelected = selectionMap.get(data.identifier) != null
    onMount(() => data.updatePath())
</script>
<path
        style="cursor: pointer"
        on:click={e => setSelected(data, e.ctrlKey)}
        data-link={data.identifier}
        fill={"none"}
        stroke={isSelected ? "yellow" : "white"}
        stroke-width={4}
        id={data.identifier}
        d=""
></path>