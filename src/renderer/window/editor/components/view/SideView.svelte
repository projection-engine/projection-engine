<script>
    import ViewGroup from "./components/ViewGroup.svelte"
    import ResizableBar from "../../../shared/components/resizable/ResizableBar.svelte"
    import ViewsUtil from "../../util/ViewsUtil"
    import {onDestroy, onMount} from "svelte"
    import EngineStore from "../../../shared/stores/EngineStore"

    const COMPONENT_ID = crypto.randomUUID()

    export let resizePosition
    export let orientation
    export let tabs
    export let setTabs
    export let id
    export let currentViewIndex

    let ref
    let reducedOpacity = false
    $: orientationNameMin = orientation === "horizontal" ? "minHeight" : "minWidth"
    $: orientationName = orientation === "horizontal" ? "height" : "width"
    $: invOrientation = orientation === "horizontal" ? "width" : "height"

    function onResizeStart(isWindowResize) {
    	let obj = {}
    	if (!isWindowResize || tabs.length === 0) {
    		obj[orientationNameMin] = "unset"
    		obj[orientationNameMin.replace("min", "max")] = tabs.length === 0 ? "0px" : "unset"
    	} else if (tabs.length > 0) {
    		obj[orientationNameMin] = "250px"
    		obj[orientationNameMin.replace("min", "max")] = "250px"
    	}

    	Object.assign(ref.style, obj)
    }

    $: {
    	if (tabs.length === 0 && ref) {
    		const obj = {}
    		obj[orientationNameMin] = "unset"
    		obj[orientationNameMin.replace("min", "max")] = "0"
    		Object.assign(ref.style, obj)
    	}
    }

    onMount(() => EngineStore.getInstance().addListener(COMPONENT_ID, data => reducedOpacity = data.executingAnimation, ["executingAnimation"]))
    onDestroy(() => EngineStore.getInstance().removeListener(COMPONENT_ID))
</script>


{#if resizePosition !== "bottom" && tabs.length > 0 && resizePosition !== "left"}
    <ResizableBar
            type={orientationName}
            onResizeStart={onResizeStart}
    />
{/if}
<div
        bind:this={ref}
        class="wrapper"
        data-svelteorientation={orientation}
        style={`
            flex-direction: ${orientation === "horizontal" ? "row" : "column"};
            opacity: ${reducedOpacity ? ".75" : "1"};
            ${orientation}: 250px;
            ${"min-" + orientation}: 35px;
        `}
>
    {#each tabs as views, groupIndex}
        <ViewGroup
                {currentViewIndex}
                {views}
                {groupIndex}
                id={id}
                let:view
                let:index
                switchView={(newView, index) =>  ViewsUtil.switchView(newView, groupIndex, tabs, index, setTabs)}
                addNewTab={item => ViewsUtil.addTab(tabs, setTabs, groupIndex, item)}
                removeTab={(indexToRemove, onBeforeDelete, currentTab) =>  ViewsUtil.removeTab(indexToRemove, tabs, groupIndex, setTabs, currentTab, onBeforeDelete)}
                removeMultipleTabs={() => {
                    const clone = [...tabs]
                    clone.splice(groupIndex, 1)
                    setTabs(clone)
                }}
        />
        {#if groupIndex < tabs.length - 1 && tabs.length > 1}
            <ResizableBar
                    type={invOrientation}
                    resetWhen={tabs}
                    onResizeEnd={(next, prev) => ViewsUtil.onResizeEndSplitter(next, prev, invOrientation, setTabs, tabs, groupIndex)}
            />
        {/if}
    {/each}
</div>
{#if resizePosition !== "top" && (orientation === "vertical" && tabs.length > 1 || orientation === "horizontal" && tabs.length > 0) || resizePosition === "left" && tabs.length > 0}
    <ResizableBar type={orientationName} onResizeStart={onResizeStart}/>
{/if}


<style>
    .wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0;
    }
</style>
