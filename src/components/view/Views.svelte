<script>
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte";
    import View from "./components/View.svelte";
    import ViewGroup from "./components/ViewGroup.svelte";
    import onResizeEndSplitter from "./utils/on-resize-end-splitter";
    import switchView from "./utils/switch-view";
    import removeTab from "./utils/remove-tab";
    import addTab from "./utils/add-tab";

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
        if(!isWindowResize || tabs.length === 0) {
            obj[orientationNameMin] = "unset"
            obj[orientationNameMin.replace("min", "max")] = tabs.length === 0 ? "0px" : "unset"
        }
        else if(tabs.length > 0){
            obj[orientationNameMin] = "250px"
            obj[orientationNameMin.replace("min", "max")] = "250px"
        }

        Object.assign(ref.style, obj)
        if (hidden)
            hidden = false
    }
    function onResizeEnd(){
        const bBox = ref.getBoundingClientRect()
        if (bBox[orientationName] <= 30)
            hidden = true
    }

    $: {
        if(tabs.length === 0 && ref){
            const obj = {}
            obj[orientationNameMin] = "unset"
            obj[orientationNameMin.replace("min", "max")] = "0"
            Object.assign(ref.style, obj)
        }
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
        class="wrapper"
        data-orientation={orientation}
        style={`
            flex-direction: ${orientation === "horizontal" ? "row" : "column"};
            opacity: ${reducedOpacity ? ".75" : "1"};
        `}
>
    {#each tabs as views, groupIndex}
        <ViewGroup
                hidden={hidden}
                views={views}
                groupIndex={groupIndex}
                id={id}
                let:view
                let:index
                switchView={(newView, index) => switchView(newView, groupIndex, tabs, index, setTabs)}
                addNewTab={_ => addTab(tabs, setTabs, groupIndex)}
                removeTab={(i, cb, currentTab) => removeTab(i, tabs, groupIndex, setTabs, currentTab, cb)}
        >
            {#if !hidden}
                <View
                        instance={view}
                        id={id}
                        index={index}
                        groupIndex={groupIndex}
                        switchView={newView => switchView(newView, groupIndex, tabs, index, setTabs )}

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