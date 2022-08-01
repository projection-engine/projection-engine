<script>
    import {onDestroy, onMount} from 'svelte';
    import hsv2Hsl from "./utils/hsv-2-hsl.js";
    import {v4} from "uuid";
    import Dropdown from "../dropdown/Dropdown.svelte";
    import rgb2hsv from "./utils/rgb-2-hsv";
    import hsv2Rgb from "./utils/hsv-2-rgb";

    export let submit = () => null
    let changed = false
    export let size = 250
    export let height = "25px"
    export let value
    export let label
    export let disabled
    const internalID = v4()

    let hue = 0, saturation = 0, colorValue = 100
    let focused = false, boundingBox = {x: 0, y: 0}, clicked = false
    let picker, canvas
    let button


    $: {
        if (value) {
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
        }

    }

    function updatePicker() {
        const {h, s, l} = hsv2Hsl(hue, saturation, colorValue)
        picker.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`
        button.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`
    }

    function handler(event) {
        switch (event.type) {
            case "mousemove": {
                changed = true
                if (focused || clicked) {
                    const x = event.clientX - boundingBox.x
                    const y = event.clientY - boundingBox.y
                    const percentageX = x / size
                    const percentageY = 1 - y / size

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
                        updatePicker()
                }
                break
            }
            case "mousedown":
                boundingBox = canvas.getBoundingClientRect()
                clicked = true
                break
            case "mouseup":
                clicked = false
                if (changed)
                    submit(hsv2Rgb(hue, saturation, colorValue))
                break
        }

    }

    onDestroy(() => {
        canvas.removeEventListener("mousemove", handler)
        canvas.removeEventListener("mousedown", handler)
        document.body.removeEventListener("mouseup", handler)
    })
    onMount(() => {
        picker = document.getElementById(internalID + "-picker")
        canvas = document.getElementById(internalID + "-canvas")

        boundingBox = canvas.getBoundingClientRect()

        const x = (saturation / 100) * size
        const y = (1 - colorValue / 100)  * size
        picker.style.left = x + "px"
        picker.style.top = y + "px"

        const hsl = hsv2Hsl(hue, saturation, colorValue)
        button.style.background = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
        updatePicker()

        canvas.addEventListener("mousemove", handler)
        canvas.addEventListener("mousedown", handler)
        document.body.addEventListener("mouseup", handler)
    })
</script>


<Dropdown hideArrow="true" width="100%" disabled={disabled}>
    <div slot="button" style="min-height: {height};max-height: {height};" bind:this={button} class="dropdown" disabled={disabled}>
        {#if label}
            <div class="label" style="height: {height};">
                {label}
            </div>
        {/if}
    </div>
    <div class="container" style="--hue: {hue}; width: {size + 32}px; height:  {size + 48}px; ">
        <div style="width: {size}px; height: {size}px" class="canvas" id="{internalID}-canvas">
            <div class="picker" id="{internalID}-picker"></div>
        </div>
        <input
                on:change={(event) => {
                    changed = true
                    hue= parseFloat(event.target.value)
                    event.target.parentElement.style.setProperty('--hue', event.target.value);
                    updatePicker()

                }}
                type="range"
                value={hue}
                max="360"
        >
    </div>
</Dropdown>
<style>
    .dropdown {
        border-radius: 3px;
        overflow: hidden;
        width: 100%;
        cursor: pointer;
        transition: 150ms linear;
        position: relative;
    }

    .dropdown:hover {
        opacity: .9;
    }

    .label {
        display: flex;
        align-items: center;

        font-weight: 550;
        position: absolute;
        left: 0;
        padding: 4px;
        font-size: .7rem;
        background: rgba(32, 32, 32, .3);
        color: var(--pj-color-secondary);
    }

    .container {
        box-sizing: border-box;
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 16px;
        padding: 16px;

        background: var(--pj-background-secondary);
        border-radius: 5px;
        border: var(--pj-border-primary) 1px solid;


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
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: var(--box-shadow);
        transform: translateY(-7px);
    }

    input[type=range]::-webkit-slider-thumb:active {
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

        top: 0;
        left: 0;
        z-index: 99999;
        border: #e0e0e0 2px solid;
        box-shadow: var(--box-shadow);

        transform: translate(-50%, -50%);

    }

</style>


