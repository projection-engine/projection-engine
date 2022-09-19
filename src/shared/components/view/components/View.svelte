<script>
    import Console from "../../../../editor/views/console/Console.svelte";
    import Hierarchy from "../../../../editor/views/hierarchy/Hierarchy.svelte";
    import ContentBrowser from "../../../../editor/views/content-browser/ContentBrowser.svelte";
    import ComponentEditor from "../../../../editor/views/inspector/Inspector.svelte";
    import VIEWS from "../VIEWS";
    import ShaderEditor from "../../../../editor/views/shader-editor/ShaderEditor.svelte";

    export let styles
    export let extendView
    export let switchView
    export let hidden
    export let instance
    export let id
    export let index


    $: component = (() => {
        switch (instance) {
            case VIEWS.BLUEPRINT:
                return ShaderEditor
            case VIEWS.HIERARCHY:
                return Hierarchy
            case VIEWS.COMPONENT:
                return ComponentEditor
            case VIEWS.FILES:
                return ContentBrowser
            case VIEWS.CONSOLE:
                return Console

            default:
                return null
        }
    })();

</script>

{#if component}
    <div class="view" style={styles}>
        <svelte:component this={component} {...{hidden, switchView, extendView, viewID: id, viewIndex: index}}></svelte:component>
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
        background-color: var(--pj-background-tertiary);
        border-radius: 5px;
    }
</style>