<script lang="ts">
    import Hierarchy from "../../../views/hierarchy/HierarchyView.svelte"
    import ContentBrowser from "../../../views/content-browser/ContentBrowserView.svelte"
    import Inspector from "../../../views/inspector/InspectorView.svelte"
    import VIEWS from "../static/VIEWS"
    import ShaderEditor from "../../../views/shader-editor/ShaderEditorView.svelte"
    import UIEditor from "../../../views/ui/UIEditorView.svelte"
    import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS.ts"
    import SceneEditor from "../../../views/scene-editor/SceneEditorView.svelte"
    import Metrics from "../../../views/metrics/MetricsView.svelte"
    import Console from "../../../views/console/ConsoleView.svelte"
    import {setContext} from "svelte";
    import ViewsUtil from "../../../util/ViewsUtil";
    import ViewMetadataContext from "../static/ViewMetadataContext";

    export let styles:string
    export let instance: {[key:string]:any, type: string, color: number[]}
    export let id:string
    export let groupIndex:number
    export let index:number
    export let currentViewIndex:number
    let viewMetadata
    let component
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
        const temp = ViewsUtil.getViewId(instance.type, index, groupIndex, id, currentViewIndex)
        if(temp !== viewMetadata) {
            viewMetadata = temp
            setContext(ViewMetadataContext, viewMetadata)
        }
    }
</script>

{#if component !== undefined}
    <div class="view" style={styles}>
        {#key viewMetadata}
            <svelte:component this={component}/>
        {/key}
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
