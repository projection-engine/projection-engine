<script>
    export let shortcut = []
    $: sc = shortcut.map((s, i) => s + (i < shortcut.length - 1 ? " + " : ""))
</script>

<div class="shortcut">
    {sc}
</div>