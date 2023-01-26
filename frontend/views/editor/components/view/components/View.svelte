<script lang="ts">
    import Hierarchy from "../../../views/hierarchy/Hierarchy.svelte";
    import ContentBrowser from "../../../views/content-browser/ContentBrowser.svelte";
    import ComponentEditor from "../../../views/inspector/Inspector.svelte";
    import VIEWS from "../static/VIEWS";
    import ShaderEditor from "../../../views/shader-editor/ShaderEditor.svelte";
    import Preferences from "../../../views/preferences/Preferences.svelte";
    import UILayout from "../../../views/ui/UIEditor.svelte";
    import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS.ts";
    import EditorLayout from "../../../views/scene-editor/SceneEditor.svelte";
    import Metrics from "../../../views/metrics/Metrics.svelte";

    export let styles: string
    export let disabled: boolean
    export let instance: {[key:string]:any, type: string, color: number[]}
    export let id: string
    export let groupIndex: number
    export let index: number

    let component
    $:  {
        switch (instance.type) {
            case VIEWS.BLUEPRINT:
                component = ShaderEditor
                break
            case VIEWS.HIERARCHY:
                component = Hierarchy
                break
            case VIEWS.COMPONENT:
                component = ComponentEditor
                break
            case VIEWS.FILES:
                component = ContentBrowser
                break
            case VIEWS.PREFERENCES:
                component = Preferences
                break
            case VIEWPORT_TABS.UI:
                component = UILayout
                break
            case VIEWPORT_TABS.EDITOR:
                component = EditorLayout
                break
            case VIEWS.METRICS:
                component = Metrics
                break
            default:
                component = undefined
        }
    }

    $:props = {}
</script>

{#if component}
    <div class="view" style={styles}>
        <svelte:component
                this={component}
                viewMetadata={instance}
                groupIndex={groupIndex}
                viewID={id}
                viewIndex={index}
        />
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
        background: var(--pj-background-quaternary);
    }
</style>