<script>
    // import ShaderEditor from "../../../project/components/blueprints/ShaderEditor"
    // import Hierarchy from "../../../project/components/hierarchy/Hierarchy"
    // import ComponentEditor from "../../../project/components/component/ComponentEditor"
    // import ContentBrowser from "../../../project/components/files/ContentBrowser"
    // import Console from "../../../project/components/console/Console"

    import Console from "../../../windows/project/components/console/Console.svelte";
    import Hierarchy from "../../../windows/project/components/hierarchy/Hierarchy.svelte";

    export let styles
    export let extendView
    export let orientation
    export let switchView
    export let hidden
    export let instance


    $: component = (() => {
        switch (instance) {
            // case "blueprint":
            //     return ShaderEditor
            case "hierarchy":
                return Hierarchy
            // case "component":
            //     return ComponentEditor
            // case "files":
            //     return ContentBrowser
            case "console":
                return Console
            default:
                return null
        }
    })();

</script>

{#if component}
    <div class={"view"} style={styles}>
        <svelte:component this={component} {...{hidden, switchView, extendView}}></svelte:component>
    </div>
{/if}

<style>

    .view {
        height: 100%;
        max-width: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-content: flex-start;
        background-color: var(--pj-background-secondary);
        border-radius: 5px;
    }
</style>