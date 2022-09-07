<script>
    import ToolTip from "../tooltip/ToolTip.svelte";
    import {onDestroy, onMount} from "svelte";
    import KEYS from "../../windows/project/libs/engine/production/data/KEYS";

    const toDeg = 180 / Math.PI
    const DELAY = 200

    export let variant = undefined;
    export let label = undefined;
    export let precision = 2
    export let maxValue = undefined;
    export let minValue = undefined;
    export let onFinish = () => null
    export let disabled = undefined;
    export let incrementPercentage = .01
    export let value = "0"
    export let handleChange
    export let isAngle
    export let integer = undefined;

    let inputRef
    let dragged = false
    let currentValue = 0
    let mouseIsDown = false

    const handleMouseMove = (e) => {
        if (!document.pointerLockElement)
            inputRef.requestPointerLock()

        let multiplier = e.movementX
        dragged = true
        let increment = integer ? 1 : Math.abs((incrementPercentage ? incrementPercentage : 0.1) * multiplier)
        if (e.movementX < 0 && (currentValue <= maxValue || !maxValue))
            currentValue = parseFloat((currentValue + increment).toFixed(precision ? precision : 1))
        else if (currentValue >= minValue || !minValue)
            currentValue = parseFloat((currentValue - increment).toFixed(precision ? precision : 1))

        if (integer)
            currentValue = Math.round(parseInt(currentValue))

        if (currentValue > maxValue && maxValue !== undefined)
            currentValue = maxValue
        else if (currentValue < minValue && minValue !== undefined)
            currentValue = minValue

        inputRef.value = (currentValue * (isAngle ? toDeg : 1)).toFixed(precision ? precision : 1)
        if (handleChange)
            handleChange(currentValue)
    }

    const onChange = (e) => {
        if (e.type === "keydown" && e.code !== KEYS.Enter)
            return
        else if (e.type === "keydown")
            inputRef.blur()


        let finalValue = parseFloat(inputRef.value)

        if (!isNaN(finalValue)) {
            if (maxValue !== undefined && finalValue > maxValue)
                finalValue = maxValue
            if (minValue !== undefined && finalValue < minValue)
                finalValue = minValue

            if (handleChange)
                handleChange(finalValue)
        }

        if (onFinish !== undefined)
            onFinish(finalValue)

    }

    $: {
        if (!dragged && inputRef) {
            const parsedValue = isNaN(parseFloat(value)) ? 0 : parseFloat(parseFloat(value).toFixed(precision ? precision : 1))
            inputRef.value = (parsedValue * (isAngle ? toDeg : 1)).toFixed(precision ? precision : 1)
            currentValue = parsedValue
        }
    }
    const handleMouseUp = (e) => {
        mouseIsDown = false
        if (document.pointerLockElement === inputRef)
            document.exitPointerLock()
        if (e.target !== inputRef)
            return
        if (!dragged)
            inputRef.focus()
        else
            dragged = false
        if (onFinish !== undefined)
            onFinish(currentValue)

        document.body.removeEventListener("mousemove", handleMouseMove)
    }
    const handleMouseDown = e => {
        if (disabled || document.activeElement === inputRef)
            return;
        e.preventDefault()
        mouseIsDown = true
        document.body.addEventListener("mousemove", handleMouseMove)

    }
    onMount(() => {
        document.addEventListener("mouseup", handleMouseUp)
    })
    onDestroy(() => {
        document.removeEventListener("mouseup", handleMouseUp)
    })
</script>

<div
        class={"wrapper"}
        data-variant={variant}
        style={mouseIsDown ? "background: transparent;" : undefined }
>
    {#if label && !mouseIsDown}
        <div
                style={`color: ${disabled ? "#999" : "var(--pj-color-tertiary)"};`}
                class="title"
        >
            {label}
            {#if !disabled}
                <ToolTip content={label}/>
            {/if}
        </div>
    {/if}
    <input
            bind:this={inputRef}
            disabled={disabled}

            on:keydown={onChange}
            on:mousedown={handleMouseDown}
            type="number"
            class="draggable"
            on:blur={onChange}
    >
</div>

<style>
    .wrapper {
        color: var(--pj-color-tertiary);
        align-items: center;
        overflow: hidden;
        max-width: 100%;
        user-select: none !important;
        font-size: 0.7rem;
        position: relative;
        border: none;
        border-radius: 3px;
        width: 100%;
        gap: 2px;
        height: 23px;
    }

    .wrapper[data-variant="embedded"] {
        background: var(--background-input);
    }

    .title {
        position: absolute;
        left: 0;
        top: 0;
        height: 23px;
        width: fit-content;
        padding: 0 4px;
        display: flex;
        align-items: center
    }

    .draggable {
        border: none;
        border-radius: 3px;
        height: 23px;

        background-color: var(--background-input);

        width: 100%;

        overflow: hidden;
        cursor: col-resize;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        color: var(--pj-color-tertiary);
        font-size: inherit;
        font-weight: 400;
        text-align: right;
    }

    .draggable:active,
    .draggable:focus {
        background-color: var(--pj-background-primary) !important;
        cursor: text;
        text-align: center;
    }

    .draggable:hover {
        background-color: var(--background-input-lighter);
    }

    .draggable:disabled {
        background: transparent !important;
        border: var(--pj-border-primary) 1px solid;
        color: #999 !important;
        font-weight: normal;
        cursor: default !important;
        text-align: right;
    }

    .draggable::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
    }

    .draggable[type="number"] {
        appearance: textfield;
    }


</style>
