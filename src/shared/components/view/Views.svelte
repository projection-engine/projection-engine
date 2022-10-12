<script>
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte";
    import View from "./components/View.svelte";
    import VIEWS from "./data/VIEWS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import ViewGroup from "./components/ViewGroup.svelte";
    import onResizeEndSplitter from "./utils/on-resize-end-splitter";
    import switchView from "./utils/switch-view";
    import removeTab from "./utils/remove-tab";
    import addTab from "./utils/add-tab";
    import {onMount} from "svelte";

    export let resizePosition
    export let orientation
    export let reducedOpacity
    export let tabs
    export let setTabs
    export let id

    let hidden = false
    let ref


    $: orientationNameMin = orientation === "horizontal" ? "minHeight" : "minWidth"
    $: orientationName = orientation === "horizontal" ? "height" : "width"
    $: invOrientation = orientation === "horizontal" ? "width" : "height"

    function onResizeStart(isWindowResize){
        let obj = {}
        if(!isWindowResize)
            obj[orientationNameMin] = "unset"
        else
            obj[orientationNameMin] = "250px"

        Object.assign(ref.style, obj)
        if (hidden)
            hidden = false
    }
    function onResizeEnd(){
        // Object.assign(ref.style, {[orientationNameMin]: "unset"})
        const bBox = ref.getBoundingClientRect()
        if (bBox[orientationName] <= 30)
            hidden = true
    }

</script>


{#if resizePosition !== "bottom" && tabs.length > 0 && resizePosition !== "left"}
    <ResizableBar
        resetTargets={{previous: true, next: false}}
        resetWhen={[hidden]}
        type={orientationName}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
    />
{/if}
<div
        bind:this={ref}
        class={"wrapper"}
        data-orientation={orientation}
        style={`
            flex-direction: ${orientation === "horizontal" ? "row" : "column"};
            ${"max-" + orientationName}: ${tabs.length === 0 ? "0px" : (hidden ? "20px" : "unset")};

            opacity: ${reducedOpacity ? ".75" : "1"};
        `}
>
    {#each tabs as views, groupIndex}
        <ViewGroup
                hidden={hidden}
                views={views}
                let:view
                let:index
                addNewTab={_ => addTab(tabs, setTabs, groupIndex)}
                removeTab={(i, cb, currentTab) => removeTab(i, tabs, groupIndex, setTabs, currentTab, cb)}
        >
            {#if !hidden}
                <View
                        instance={view}
                        id={id}
                        index={index}
                        groupIndex={groupIndex}

                        switchView={newView => switchView(newView, groupIndex, tabs, index, setTabs, view )}
                        orientation={orientation}
                />
            {/if}
        </ViewGroup>
        {#if groupIndex < tabs.length - 1 && tabs.length > 1}
            <ResizableBar
                    type={invOrientation}
                    resetWhen={tabs}
                    onResizeEnd={(next, prev) => onResizeEndSplitter(next, prev, invOrientation, setTabs, tabs, groupIndex)}
            >
            </ResizableBar>
        {/if}
    {/each}
</div>
{#if resizePosition !== "top" && (orientation === "vertical" && tabs.length > 1 || orientation === "horizontal" && tabs.length > 0) || resizePosition === "left" && tabs.length > 0}
    <ResizableBar
            resetTargets={{previous: true, next: false}}
            resetWhen={[hidden]}
            type={orientationName}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
    />
{/if}


<style>
    .wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0;
    }
</style>