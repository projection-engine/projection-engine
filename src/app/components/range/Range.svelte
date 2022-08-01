<script>
    import ToolTip from "../tooltip/ToolTip.svelte";

    const toDeg = 180 / Math.PI
    const DELAY = 200

    export let minLabelWidth = undefined;
    export let variant = undefined;
    export let label = undefined;
    export let precision = 2
    export let maxValue = undefined;
    export let minValue = undefined;
    export let onFinish = () => null
    export let accentColor = undefined;
    export let disabled = undefined;
    export let incrementPercentage = .01
    export let value = "0"
    export let handleChange
    export let isAngle
    export let integer = undefined;

    let ref
    let inputRef


    let focused = false
    let dragged = false
    let currentValue = 0

    const handleMouseMove = (e) => {
        let multiplier = e.movementX
        dragged = true
        const increment = integer ? 1 : Math.abs((incrementPercentage ? incrementPercentage : 0.1) * multiplier)

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

        const prev = (currentValue * (isAngle ? toDeg : 1) ).toFixed(precision ? precision : 1)
        ref.innerText = prev
        inputRef.value = prev

        if (handleChange)
            handleChange(currentValue)
    }

    let timeout
    const onChange = (input) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            let finalValue = parseFloat(input.value)

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
        }, DELAY)
    }

    $: {
        if (!dragged && inputRef && ref) {
            const parsedValue = isNaN(parseFloat(value)) ? 0 : parseFloat(parseFloat(value).toFixed(precision ? precision : 1))
            const prev = (parsedValue * (isAngle ? toDeg : 1)).toFixed(precision ? precision : 1)
            inputRef.value = prev
            ref.innerText = prev
            currentValue = parsedValue
        }
    }
</script>

<div
        class={"wrapper labeledWrapper"}
        data-variant={variant}
        style={accentColor ? "--accent-color: " + accentColor : undefined}
>
    {#if label}
        <div style="min-width: {minLabelWidth}" data-overflow="-">
            {label}
            <ToolTip>
                {label}
            </ToolTip>
        </div>
    {/if}
    <input
            bind:this={inputRef}
            disabled={`${disabled}`}
            autofocus
            onChange={(e) => onChange(e.target)}
            type="number"
            style={`
            display: ${focused ? undefined : "none"};
            cursor: text;
            background: var(--pj-background-quaternary);
            border-radius: ${!accentColor ? "3px" : undefined}
        `}
            class={"draggable"}
            on:blur={() => focused = false}
    >

    <div
            bind:this={ref}
            data-disabled={`${disabled}`}
            on:mousedown={() => {
            if (!focused && !disabled)
                ref.requestPointerLock()
        }}
            on:mousemove={(e) => {
            if (document.pointerLockElement)
                handleMouseMove(e)
        }}
            on:mouseup={() => {
            document.exitPointerLock()
            if (onFinish !== undefined)
                onFinish(currentValue)
            if (!disabled) {
                if (!dragged)
                    focused = true
                else
                    dragged = false
            }
        }}
            style={`
            display: ${!focused ? undefined : "none"};
            color: ${disabled ? "#999" : undefined};
            cursor: ${disabled ? "default" : undefined};
            background: ${disabled ? "var(--background-0)" : undefined};
            borderRadius: ${!accentColor || disabled ? "3px" : undefined};
        `}
            class={"draggable"}
    ></div>
</div>

<style>
    .wrapper {
        display: grid;
        color: var(--pj-color-secondary);
        border: none;
        width: 100%;
        align-items: center;

        --accent-color: transparent;

        overflow: hidden;
        max-width: 100%;
        user-select: none !important;
        font-size: 0.7rem;
        position: relative;
    }

    .draggable {
        border: none;
        border-left: var(--accent-color) 2px solid;
        background-color: var(--background-input);
        border-radius: 0 3px 3px 0;
        width: inherit;
        max-width: 100%;
        overflow: hidden;
        cursor: col-resize;
        height: 25px;
        transition: 150ms linear;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        color: var(--pj-color-secondary);
        font-size: inherit;
        text-align: center;
    }

    .draggable:active,
    .draggable:focus {
        background-color: var(--pj-background-quaternary) !important;
        font-weight: 550;
    }

    .draggable:hover {
        background-color: var(--pj-border-primary);
    }

    .draggable[data-disabled="true"],
    .draggable:disabled {
        background: transparent !important;
        border: var(--pj-border-primary) 1px solid;
        color: #999 !important;
        font-weight: normal;
        border-left: var(--accent-color) 2px solid;
    }

    .draggable::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
    }

    .draggable[type="number"] {
        appearance: textfield;
    }

    .labeledWrapper {
        display: grid;
        width: 100%;
        align-items: center;
        gap: 2px;
    }

    .labeledWrapper[data-variant="embedded"] {
        display: flex;
        align-items: center;
        background: var(--background-input);
        border-radius: 3px;
        padding-left: 4px;
    }


    .labeledWrapper[data-variant="embedded"] > div {
        min-width: 15px;
        text-align: left;
    }

</style>
