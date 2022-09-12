<script>
    import ToolTip from "../tooltip/ToolTip.svelte";
    import {onDestroy, onMount} from "svelte";
    import KEYS from "../../../../../public/engine/production/data/KEYS";

    import Localization from "../../libs/Localization";
    import Icon from "../icon/Icon.svelte";
    import getPercentage from "./utils/get-percentage";

    const toDeg = 180 / Math.PI
    const DELAY = 200

    export let label = undefined;
    export let precision = 2
    export let maxValue = undefined;
    export let minValue = undefined;
    export let onFinish = undefined
    export let disabled = undefined;
    export let incrementPercentage = .01
    export let value = 0
    export let noOriginal

    export let handleChange
    export let isAngle
    export let integer = undefined;

    let changed = false
    let originalValue
    let inputRef
    let dragged = false
    let currentValue = 0

    $: {
        if (!changed)
            originalValue = value
    }
    $: percentageFilled = minValue != null && maxValue != null ? getPercentage(currentValue, maxValue) : undefined

    const handleMouseMove = (e) => {
        if (!document.pointerLockElement)
            inputRef.requestPointerLock()

        const multiplier = -e.movementX * .1
        dragged = true
        let increment = integer ? 1 : Math.abs((incrementPercentage ? incrementPercentage : 0.1) * multiplier)
        if (multiplier < 0 && (currentValue <= maxValue || !maxValue))
            currentValue = parseFloat((currentValue + increment).toFixed(precision ? precision : 1))
        else if (currentValue >= minValue || !minValue)
            currentValue = parseFloat((currentValue - increment).toFixed(precision ? precision : 1))

        if (integer)
            currentValue = Math.round(parseInt(currentValue))

        if (currentValue > maxValue && maxValue !== undefined)
            currentValue = maxValue
        else if (currentValue < minValue && minValue !== undefined)
            currentValue = minValue
        if (!changed)
            changed = true
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

        if (!changed)
            changed = true
    }

    $: {
        if (!dragged && inputRef) {
            const parsedValue = isNaN(parseFloat(value)) ? 0 : parseFloat(parseFloat(value).toFixed(precision ? precision : 1))
            inputRef.value = (parsedValue * (isAngle ? toDeg : 1)).toFixed(precision ? precision : 1)
            currentValue = parsedValue
        }
    }
    const handleMouseUp = (e) => {
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
        document.body.addEventListener("mousemove", handleMouseMove)

    }
    onMount(() => {
        document.addEventListener("mouseup", handleMouseUp)
    })
    onDestroy(() => {
        document.removeEventListener("mouseup", handleMouseUp)
    })
</script>


<div class="wrapper" style={disabled ? "background: transparent" : ""}>
    {#if percentageFilled != null}
        <div class="percentage" style="width: {percentageFilled}%"></div>
    {/if}
    {#if label }
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
    {#if originalValue != null && !disabled && !noOriginal}
        <button on:click={() => {
            if (onFinish !== undefined)
                onFinish(originalValue)
            else if (handleChange)
                handleChange(originalValue)
        }} class="reset-button">
            <Icon styles="font-size: .9rem">undo</Icon>
            <ToolTip content={Localization.COMPONENTS.RANGE.UNDO}/>
        </button>
    {/if}
</div>

<style>
    .percentage {
        background: var(--pj-accent-color-light);
        position: absolute;
        z-index: 0;
        height: 100%;
    }

    .reset-button {
        border: none;
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;
    }

    .wrapper {
        background: var(--background-input);
        display: flex;
        align-items: center;
        gap: 2px;

        color: var(--pj-color-tertiary);

        overflow: hidden;
        max-width: 100%;
        user-select: none !important;
        font-size: 0.7rem;
        position: relative;
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px;
        width: 100%;
        height: 23px;
    }
    .wrapper:active,
    .wrapper:focus-within {
        background: var(--pj-background-primary) !important;
    }
    .wrapper:hover {
        background-color: var(--background-input-lighter);
    }

    .title {
        position: absolute;
        z-index: 2;

        left: 0;
        top: 0;
        height: 23px;
        width: fit-content;
        padding: 0 4px;
        display: flex;
        align-items: center
    }

    .draggable {
        background: none;
        position: relative;
        z-index: 1;
        border: none;
        height: 23px;

        width: 100%;

        overflow: hidden;
        cursor: col-resize;
        outline: none;
        color: var(--pj-color-quaternary);
        font-weight: normal;
        text-align: right;
        font-size: 0.7rem;
    }

    .draggable:active,
    .draggable:focus {
        cursor: text;
    }

    .draggable:disabled {
        background: transparent !important;

        color: #999 !important;
        cursor: default !important;
    }

    .draggable::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
    }

    .draggable[type="number"] {
        appearance: textfield;
    }


</style>
