<script>
    export let shortcut = []
</script>

{#if shortcut}
<div class="shortcut">
    {#each shortcut as s, i}
        {s + (i < shortcut.length - 1 ? " + " : "")}
    {/each}
</div>
{/if}
<style>

    .shortcut {
        text-align: right;
        width: 100%;
        color: #999;
        font-weight: 550;
        font-size: 0.65rem;
    }

</style>