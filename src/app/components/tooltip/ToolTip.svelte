<script>
    let open = true
    export let content = ""
    export let styles = ""
</script>

{#if open}
<div style="{styles}">
    {#if content}
        {content}
    {:else}
        <slot/>
    {/if}
</div>
{/if}