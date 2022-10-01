<script>
    import Localization from "../../../../../shared/libs/Localization";
    import RegistryAPI from "../../../../../shared/libs/RegistryAPI";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import FilesAPI from "../../../../../shared/libs/FilesAPI";

    export let data

    let primitives = []
    $: {
        if (data) {
            const mapped = data.nodes.map(n => n.primitives).flat()
            Promise.all(mapped.map(r => RegistryAPI.readRegistryFile(r))).then(r => primitives = r.map(rr => ({
             name: rr.path.split(FilesAPI.sep).pop(),
             path: rr.path
            })))
        }
    }

</script>

{#if data}
    <fieldset>
        <legend>{data.name} - {Localization.PROJECT.INSPECTOR.PRIMITIVES}</legend>
        {#each primitives as node}
            <div class="section">
                <small data-overflow="-"><ToolTip content={node.name}/>{node.name}</small>
                <div data-vertdivider="-"></div>
                <small data-overflow="-"><ToolTip content={node.path}/>{node.path}</small>
            </div>
        {/each}
    </fieldset>
{/if}
<style>
    .section {
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 2px
    }

</style>
