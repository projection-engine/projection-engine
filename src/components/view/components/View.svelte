<script>
    import Console from "../../../views/console/Console.svelte";
    import Hierarchy from "../../../views/hierarchy/Hierarchy.svelte";
    import ContentBrowser from "../../../views/content-browser/ContentBrowser.svelte";
    import ComponentEditor from "../../../views/inspector/Inspector.svelte";
    import VIEWS from "../data/VIEWS";
    import ShaderEditor from "../../../views/shader-editor/ShaderEditor.svelte";
    import Preferences from "../../../views/preferences/Preferences.svelte";
    import UILayout from "../../../views/ui/UIEditor.svelte";
    import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
    import EditorLayout from "../../../views/editor/SceneEditor.svelte";
    import TerrainLayout from "../../../views/terrain/TerrainEditor.svelte";

    export let styles
    export let extendView
    export let switchView
    export let disabled
    export let instance
    export let id
    export let groupIndex
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

            case VIEWS.PREFERENCES:
                return Preferences
            case VIEWS.UI:
                return UILayout
            case VIEWPORT_TABS.TERRAIN:
                return TerrainLayout
            case VIEWPORT_TABS.EDITOR:
                return EditorLayout
            default:
                return null
        }
    })();


    $:props = {groupIndex, switchView, extendView, viewID: id, viewIndex: index}
</script>

{#if component}
    <div class="view" style={styles}>
        <svelte:component this={component} {...props}></svelte:component>
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
    }
</style>