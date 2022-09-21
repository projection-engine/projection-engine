<script>
    import Range from "../range/Range.svelte";
    import {v4} from "uuid";
    import hsv2Rgb from "./utils/hsv-2-rgb";
    import hsv2Hsl from "./utils/hsv-2-hsl";
    import rgb2hsv from "./utils/rgb-2-hsv";
    import {onDestroy, onMount} from "svelte";

    let changed = false
    const WIDTH = 200

    export let submit = () => null
    export let value
    export let label
    export let hsl
    export let setHsl

    const internalID = v4()

    let hue = 0, saturation = 0, colorValue = 100
    let focused = false, boundingBox = {x: 0, y: 0}, clicked = false
    let picker, canvas

    let timeout
    let initializationChanged = false
    let wasDown = false

    function s() {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            if (changed) {
                submit(hsv2Rgb(hue, saturation, colorValue))
                changed = false
            }
        }, 50)
    }

    function updateBasedOnValues() {
        if (!canvas || changed)
            return
        boundingBox = canvas.getBoundingClientRect()

        const x = (saturation / 100) * boundingBox.width
        const y = (1 - colorValue / 100) * boundingBox.height
        picker.style.left = x + "px"
        picker.style.top = y + "px"
        setHsl(hsv2Hsl(hue, saturation, colorValue))
    }

    $: {
        if (value && !initializationChanged) {
            if (typeof value === "string") {
                const split = value.match(/[\d.]+/g)
                const [r, g, b] = split.map(v => parseFloat(v))
                const hsv = rgb2hsv(r, g, b)
                hue = hsv.h
                saturation = hsv.s
                colorValue = hsv.v
            } else if (Array.isArray(value)) {
                const hsv = rgb2hsv(value[0], value[1], value[2])
                hue = hsv.h
                saturation = hsv.s
                colorValue = hsv.v
            } else if (typeof value === "object") {
                const hsv = rgb2hsv(value.r, value.g, value.b)
                hue = hsv.h
                saturation = hsv.s
                colorValue = hsv.v
            }
            updateBasedOnValues()
            initializationChanged = false
        }

    }


    function handler(event) {
        switch (event.type) {
            case "mousemove": {
                if (!initializationChanged)
                    initializationChanged = true
                if (focused || clicked) {
                    const x = event.clientX - boundingBox.x
                    const y = event.clientY - boundingBox.y
                    const percentageX = x / boundingBox.width
                    const percentageY = 1 - y / boundingBox.height

                    saturation = percentageX * 100
                    if (saturation > 100)
                        saturation = 100
                    if (saturation < 100 && saturation > 0)
                        picker.style.left = x + "px"

                    colorValue = percentageY * 100
                    if (colorValue > 100)
                        colorValue = 100
                    if (colorValue < 100 && colorValue > 0)
                        picker.style.top = y + "px"
                    if (colorValue <= 100 || saturation <= 100)
                        setHsl(hsv2Hsl(hue, saturation, colorValue))
                }
                s()
                break
            }
            case "mousedown":
                wasDown = true
                changed = true
                boundingBox = canvas.getBoundingClientRect()
                clicked = true
                break
            case "mouseup":
                if (wasDown) {
                    s()
                    wasDown = false
                    clicked = false
                }

                break
        }

    }

    onMount(() => {
        picker = document.getElementById(internalID + "-picker")
        canvas = document.getElementById(internalID + "-canvas")
        updateBasedOnValues()
        canvas.addEventListener("mousemove", handler)
        canvas.addEventListener("mousedown", handler)

        document.addEventListener("mouseup", handler)
    })

    onDestroy(() => {
        canvas.removeEventListener("mousemove", handler)
        canvas.removeEventListener("mousedown", handler)
        document.removeEventListener("mouseup", handler)
    })

    function handleInputChange(event) {
        changed = true
        hue = parseFloat(event.target.value)
        setHsl ({...hsl, h: parseFloat(event.target.value)})
        s()
    }
</script>

<div class="container" style="--hue: {hue}; width: {WIDTH + 32}px; height: {WIDTH + 48}px; ">
    {#if label}
        <b>{label}</b>
    {/if}
    <div style="width: 100%; height: {WIDTH}px" class="canvas" id="{internalID}-canvas">
        <div class="picker" id="{internalID}-picker"></div>
    </div>
    <input
            on:input={handleInputChange}
            type="range"

            value={hue}
            max="360"
    >

    <div data-divider="-"></div>
    <div class="section-wrapper">
        <Range
                variant="embedded"
                value={hue}
                label="H"
                onFinish={v => hue = v}
                handleChange={v => {
                        clearTimeout(timeout)
                        timeout = setTimeout(() => {
                            hue = v
                            updateBasedOnValues()
                            submit(hsv2Rgb(v, saturation, colorValue))
                        }, 50)
                    }}
                minValue={0}
                maxValue={360}
                noOriginal={true}
        />
        <Range
                noOriginal={true}
                variant="embedded"
                value={saturation}
                label="S"
                handleChange={v => {
                        clearTimeout(timeout)
                        timeout = setTimeout(() => {
                            saturation = v
                            updateBasedOnValues()
                            submit(hsv2Rgb(hue, v, colorValue))
                        }, 50)
                    }}
                onFinish={v => saturation = v}
                minValue={0}
                maxValue={100}
        />
        <Range
                noOriginal={true}
                variant="embedded"
                value={colorValue}
                label="V"
                handleChange={v => {
                        clearTimeout(timeout)
                        timeout = setTimeout(() => {
                            colorValue = v
                            updateBasedOnValues()
                            submit(hsv2Rgb(hue, saturation, v))
                        }, 50)
                    }}
                onFinish={v => colorValue = v}
                minValue={0}
                maxValue={100}
        />

    </div>
</div>

<style>

    small {
        font-size: .7rem;
        color: var(--pj-color-quaternary);
    }

    b {
        font-weight: 550;
        font-size: .7rem;
    }
    .section-wrapper {
        display: flex;
        align-items: center;
        gap: 2px;

    }
    .container {
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;


        gap: 8px;
        padding: 4px;

        --hue: 0;
        --box-shadow: 0 0 0 1px rgba(0, 0, 0, .025), 0 1px 5px rgba(0, 0, 0, 0.25);

    }

    input {
        width: 100%;
    }

    input[type='range']::-webkit-slider-runnable-track {
        height: 6px;
        color: #13bba4;
        background: linear-gradient(
                to right,
                #ff0000 0%,
                #ffff00 17%,
                #00ff00 33%,
                #00ffff 50%,
                #0000ff 67%,
                #ff00ff 83%,
                #ff0000 100%
        );
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
    }

    input[type=range] {
        -webkit-appearance: none;
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        cursor: ew-resize;
        background-color: hsl(var(--hue), 100%, 50%) !important;
        border: 4px solid white;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        box-shadow: var(--box-shadow);
        transform: translateY(-7px);
    }

    input[type=range]::-webkit-slider-thumb:hover {
        transform: translateY(-7px) scale(1.1);
    }

    input[type=range]::-webkit-slider-thumb:active {
        opacity: .5;
        transform: translateY(-7px) scale(1.1);
    }

    .canvas {
        background-image: linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
        background-color: hsl(var(--hue), 100%, 50%);
        position: relative;
        overflow: hidden;
        border-radius: 5px;
    }

    .picker {
        width: 25px;
        height: 25px;
        border-radius: 50px;
        position: relative;
        background: transparent;
        top: 0;
        left: 0;
        z-index: 99999;
        border: #e0e0e0 2px solid;
        box-shadow: var(--box-shadow);

        transform: translate(-50%, -50%);

    }

</style>