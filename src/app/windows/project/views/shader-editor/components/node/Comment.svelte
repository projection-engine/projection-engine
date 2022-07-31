<script>
    import KEYS from "../../../../libs/engine/data/KEYS";
    import dragNode from "../../utils/drag-node";
    import {onDestroy, onMount} from "svelte";

    export let submitName
    export let node
    export let selected
    export let setSelected
    let ref

    $: isSelected =  selected.indexOf(node.id) > -1

    const handleDragStart = (event) => {
        let isFirst, alreadyFound = false
        document.elementsFromPoint(event.clientX, event.clientY)
            .forEach(e => {
                if (e.id?.includes("-node") && !alreadyFound && e.id === (node.id + "-node"))
                    isFirst = true
                else if (e.id?.includes("-node") && !alreadyFound)
                    alreadyFound = true
            })

        if (event.button === 0 && isFirst && !isSelected)
            setSelected(node.id, event.ctrlKey)
        if (event.button === 0 && ((isSelected && event.ctrlKey) || isFirst))
            dragNode(event, ref.current, ref.current.parentNode)

    }
    onMount(() => {
        document.addEventListener("mousedown", handleDragStart)
    })
    onDestroy(() => {
        document.removeEventListener("mousedown", handleDragStart)
    })

    let onEdit = false
    let nameCache = node.name
    $: rgb = node.color.slice(0, 3).join(", ")

</script>
<g
        bind:this={ref}
        transform={`translate(${node.x} ${node.y})`}
>
    <foreignObject
            on:contextmenu={() => setSelected(node.id)}
            data-group={node.id}
            id={node.id}

            class="wrapper"
            style={("background:" + node.color ? `rgba(${rgb}, .5);` : "rgba(150, 150, 150, .5);") + `outline-color: ${isSelected ? "yellow" : "unset"}`}
            width="{node.width}"
            height="{node.height}">
        {#if onEdit}
            <input
                    style="background: rgb({rgb})"
                    value={nameCache}
                    on:change={v => nameCache = v.target.value}
                    class="input"
                    on:blur={() => {
                submitName(nameCache)
                onEdit = false
            }}
                    on:keydown={(e) => {
                if (e.key === KEYS.Enter) {
                    submitName(nameCache)
                    onEdit = false
                }
            }}
            />
        {:else}
            <div
                    class="header"
                    style="background: rgb({rgb})"
                    id={node.id + "-node"}
                    on:doubleclick={() => onEdit = true}
            >
                {node.name}
            </div>
        {/if}
    </foreignObject>
</g>


<style>
    .wrapper {
        border-radius: 3px;
        outline: transparent 2px solid;
        resize: both;
    }

    .header {
        width: 100%;

        height: 35px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: .8rem;
        font-weight: 550;
        padding: 4px;

        color: var(--pj-color-secondary);
        cursor: grab;
    }

    .wrapper:active {
        cursor: grabbing;
    }

    .input {
        height: 35px;
        width: 100%;
        background: none;
        border: none;
        outline: none;

        color: var(--pj-color-secondary);
    }
</style>