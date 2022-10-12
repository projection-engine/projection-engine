<script>
    export let data
    export let setSelected
    export let selected

    $: identifier = data.target + "-" + data.source
    $: isSelected = selected.includes(identifier)
</script>
<path
        style="cursor: pointer"
        on:click={e => setSelected(identifier, e.ctrlKey)}
        data-link={identifier}
        fill={"none"}
        stroke={isSelected ? "yellow" : "white"}
        stroke-width={4}
        id={identifier}
        d=""
></path>