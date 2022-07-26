<script>
    import View from "./components/View"
    import ResizableBar from "../resizable/ResizableBar.svelte";

    export let resizePosition
    export let topOffset = undefined
    export let leftOffset = undefined
    export let orientation

    export let tabs
    export let setTabs


    let hidden = false
    let ref

    $: orientationName = orientation === "horizontal" ? "height" : "width"
    $: maxMin = orientation === "horizontal" ? "Height" : "Width"
    $: invOrientation = orientation === "horizontal" ? "width" : "height"

</script>


{resizePosition === "bottom" || tabs.length === 0 ? null :
    <ResizableBar
        resetTargets={{previous: true, next: false}}
        resetWhen={[hidden]}
        type={orientation}
        onResizeStart={() => {
            if (hidden)
                hidden = false
        }}
        onResizeEnd={() => {
            const bBox = ref.getBoundingClientRect()
            if (bBox[orientation] <= 30)
                hidden = true
        }}
    />
}
<div
        bind:this={ref}
        class={"wrapper"}
        data-orientation={orientation}
        style={{
            flexDirection: orientation === "horizontal" ? "row" : undefined,
            [orientationName]: tabs.length > 0 ? "250px" : "0",
            ["max" + maxMin]: tabs.length === 0 ? "0px" : (hidden ? "30px" : undefined),
            ["min" + maxMin]: tabs.length === 0 ? "0px" : (hidden ? "30px" : undefined),
        }}
>
    {#each tabs as view, vI}
        <View
                hidden={hidden}
                instance={view}
                styles={{[orientationName]: hidden ? "30px" : "inherit"}}
                switchView={(newView) => {
                        if (!newView) {
                            const copy = [...tabs]
                            copy[vI] = undefined

                            setTabs(copy.filter(e => e))
                        } else if (newView !== view) {
                            const copy = [...tabs]
                            copy[vI] = newView
                            setTabs(copy)
                        }
                    }}
                orientation={orientation}
        />
        {#if vI < tabs.length - 1 && tabs.length > 1}
            <ResizableBar
                    type={invOrientation}
                    resetWhen={tabs}
                    onResizeEnd={(next, prev) => {

                            const nextBB = next.getBoundingClientRect()
                            const prevBB = prev.getBoundingClientRect()
                            if (prevBB[invOrientation] < 30) {
                                prev.style[invOrientation] = "100%"

                                const copy = [...tabs]
                                copy.shift()
                                setTabs(copy)


                            }
                            if (nextBB[invOrientation] < 30) {
                                next.style[invOrientation] = "100%"

                                const copy = [...tabs]
                                copy[vI + 1] = undefined
                                setTabs(copy.filter(e => e))
                            }
                        }}
            >
            </ResizableBar>
        {/if}
    {/each}
    <button
            on:click={() =>
                setTabs([...tabs, "console"])}
            style={{
                left: orientation === "vertical" ? tabs.length === 0 ? leftOffset : "10px" : "100%",
                top: topOffset ? `calc(100% - ${topOffset})` : "100%",
                transform: orientation === "vertical" ? "translate(-100%, -100%)" : (tabs.length === 0 ? "translate(0, -100%)" : "translate(-100%, -100%)")
            }}
            class={"extendView"}></button>
</div>
{#if resizePosition !== "top" && tabs.length > 0}
    <ResizableBar
            resetTargets={{previous: true, next: false}}
            resetWhen={[hidden]}
            type={orientationName}
            onResizeStart={() => {
                if (hidden)
                    hidden = false
            }}
            onResizeEnd={() => {
                const bBox = ref.current.getBoundingClientRect()
                if (bBox[orientationName] <= 30)
                    hidden = true
            }}
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