<script>
    import Dropdown from "../dropdown/Dropdown.svelte";
    import rgb2hsv from "./utils/rgb-2-hsv";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import ColorCanvas from "./ColorCanvas.svelte";
    import hsv2Hsl from "./utils/hsv-2-hsl";


    let changed = false
    const WIDTH = 200

    export let submit
    export let height = "25px"
    export let value
    export let label
    export let disabled
    let hsl = {}
    let initializationChanged

    $: {
        let hue, saturation, colorValue
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
            hsl = hsv2Hsl(hue, saturation, colorValue)
            initializationChanged = false
        }

    }
</script>


<Dropdown
        hideArrow="true"
        width="100%"
        styles="width: {WIDTH + 32}px; overflow: hidden"
        disabled={disabled}
>
    <div
            slot="button"
            style={(disabled ? "cursor: default;" : "") + `min-height: ${height};max-height: ${height}; background: ${!disabled ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "transparent"};`}
            class="dropdown"
    >
        {#if label}
            <div class="label">{label}</div>
            <ToolTip content={label}/>
        {/if}
    </div>
    <ColorCanvas
            setHsl={v => hsl = v}
            hsl={hsl}
            submit={submit}
            value={value}
            label={label}
    />
</Dropdown>
<style>


    .dropdown {
        border-radius: 3px;
        overflow: hidden;
        width: 100%;
        cursor: pointer;
        transition: 150ms linear;
        position: relative;
        border: var(--pj-border-primary) 1px solid;
    }

    .dropdown:hover {
        opacity: .9;
    }
    .label{
        backdrop-filter: blur(10px) brightness(65%);

        font-size: .7rem;
        position: absolute;
        padding: 0 8px 0 2px;
        width: fit-content;
        font-weight: 550;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
</style>


