<script>

    import {onDestroy, onMount} from "svelte"

    import getPercentage from "./utils/get-percentage"
    import ToolTip from "../tooltip/ToolTip.svelte"

    const toDeg = 180 / Math.PI


    export let label = undefined
    export let maxValue = undefined
    export let minValue = undefined
    export let onFinish = undefined
    export let disabled = undefined
    export let incrementPercentage = .001
    export let value = 0
    export let handleChange
    export let isAngle
    export let integer = undefined

    $: precision = incrementPercentage === 1 || integer ? 0 : incrementPercentage != null && incrementPercentage.toString().split(".")[1] != null ? incrementPercentage.toString().split(".")[1].length : 3


    let changed = false
    let inputRef
    let dragged = false
    let currentValue = 0

    function parseToString(v) {
    	if (!precision)
    		return parseInt(v)
    	return parseFloat(v).toFixed(precision)
    }

    $: percentageFilled = minValue != null && maxValue != null ? getPercentage(currentValue, maxValue) : undefined
    $: incrementData = (incrementPercentage ? incrementPercentage : 0.1)
    const handleMouseMove = (e) => {
    	try {

    		const multiplier = -e.movementX
    		dragged = true
    		let increment = integer ? 1 : Math.abs(incrementData * multiplier)
    		if (multiplier < 0 && (currentValue <= maxValue || !maxValue))
    			currentValue = currentValue + increment
    		else if (currentValue >= minValue || !minValue)
    			currentValue = currentValue - increment

    		if (integer)
    			currentValue = Math.round(parseInt(currentValue))

    		if (currentValue > maxValue && maxValue !== undefined)
    			currentValue = maxValue
    		else if (currentValue < minValue && minValue !== undefined)
    			currentValue = minValue
    		if (!changed)
    			changed = true
    		if (inputRef)
    			inputRef.value = parseToString(currentValue * (isAngle ? toDeg : 1))
    		if (handleChange)
    			handleChange(currentValue)
    	} catch (err) {
    		console.error(err)
    		document.body.removeEventListener("mousemove", handleMouseMove)
    	}
    }

    const onChange = (e) => {
    	let finalValue = parseFloat(inputRef.value)
    	if (e.type === "keydown" && e.code !== "Enter" || isNaN(finalValue))
    		return
    	else if (e.type === "keydown")
    		inputRef.blur()

    	if (maxValue !== undefined && finalValue > maxValue)
    		finalValue = maxValue
    	if (minValue !== undefined && finalValue < minValue)
    		finalValue = minValue

    	if (handleChange)
    		handleChange(finalValue)

    	if (onFinish !== undefined)
    		onFinish(finalValue)

    	if (!changed)
    		changed = true
    }

    $: {
    	if (!dragged && inputRef) {
    		const parsedValue = isNaN(parseFloat(value)) ? 0 : parseFloat(parseFloat(value).toFixed(precision ? precision : 1))
    		inputRef.value = parseToString(parsedValue * (isAngle ? toDeg : 1))
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
    		return
    	e.preventDefault()


    	if (!document.pointerLockElement)
    		inputRef.requestPointerLock()
    	document.body.addEventListener("mousemove", handleMouseMove)

    }
    onMount(() => {
    	document.addEventListener("mouseup", handleMouseUp)
    })
    onDestroy(() => {
    	document.removeEventListener("mouseup", handleMouseUp)
    })
</script>


<div class="wrapper" style={disabled ? "background: transparent; color: #999" : ""} data-svelteisrangeinput="-">
    {#if percentageFilled != null}
        <div class="percentage" style="width: {percentageFilled}%"></div>
    {/if}
    {#if label}
        <div
                class="title"
                data-svelteoverflow="-"
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
            step="any"
            on:blur={onChange}
    >
</div>

<style>
    .percentage {
        background: var(--pj-accent-color-light);
        position: absolute;
        z-index: 0;
        height: 100%;
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

        position: relative;
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px;
        width: 100%;
        height: 20px;
        opacity: .85;
    }

    .wrapper:active {
        opacity: 1;
        color: var(--pj-color-primary);
        background: var(--pj-background-primary);
    }

    .wrapper:focus-within {
        opacity: 1;
        color: var(--pj-color-primary);
        background: var(--pj-background-primary) !important;
    }

    .wrapper:hover {
        opacity: 1;
        color: var(--pj-color-primary);
    }

    .title {
        position: relative;
        z-index: 0;
        color: inherit;
        max-width: 75%;
        width: 75%;
        padding: 0 4px;
        font-size: 0.7rem;
    }

    .draggable {

        background: none;
        position: absolute;

        z-index: 1;
        border: none;
        height: 20px;

        width: 100%;

        overflow: hidden;
        cursor: col-resize;
        outline: none;
        color: inherit;
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
