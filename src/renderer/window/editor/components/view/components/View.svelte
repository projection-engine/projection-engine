<script lang="ts">
    import Hierarchy from "../../../views/hierarchy/Hierarchy.svelte"
    import ContentBrowser from "../../../views/content-browser/ContentBrowser.svelte"
    import Inspector from "../../../views/inspector/Inspector.svelte"
    import VIEWS from "../static/VIEWS"
    import ShaderEditor from "../../../views/shader-editor/ShaderEditor.svelte"
    import UIEditor from "../../../views/ui/UIEditor.svelte"
    import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS.ts"
    import SceneEditor from "../../../views/scene-editor/SceneEditor.svelte"
    import Metrics from "../../../views/metrics/Metrics.svelte"
    import Console from "../../../views/console/Console.svelte"
    import ViewStateStore from "../../../../shared/stores/ViewStateStore";
    import {onDestroy} from "svelte";

    /** @type {string} */
    export let styles
    /** @type {{[key:string]:any, type: string, color: number[]}} */
    export let instance
    /** @type {string} */
    export let id
    /** @type {number} */
    export let groupIndex
    /** @type {number} */
    export let index
    let viewMetadata
    let component
    const existingStates = []
    $:  {
        switch (instance.type) {
            case VIEWS.SHADER_EDITOR:
                component = ShaderEditor
                break
            case VIEWS.HIERARCHY:
                component = Hierarchy
                break
            case VIEWS.INSPECTOR:
                component = Inspector
                break
            case VIEWS.FILES:
                component = ContentBrowser
                break
            case VIEWPORT_TABS.UI:
                component = UIEditor
                break
            case VIEWPORT_TABS.EDITOR:
                component = SceneEditor
                break
            case VIEWS.METRICS:
                component = Metrics
                break
            case VIEWS.CONSOLE:
                component = Console
                break
            default:
                component = undefined
        }
        viewMetadata = JSON.stringify({
            type: instance.type,
            index,
            groupIndex,
            id
        })
        existingStates.push(viewMetadata)
    }

    onDestroy(() => {
        existingStates.forEach(ViewStateStore.getInstance().removeState)
    })
</script>

{#if component !== undefined}
    <div class="view" style={styles}>
        <svelte:component
                this={component}
                viewMetadata={viewMetadata}
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
