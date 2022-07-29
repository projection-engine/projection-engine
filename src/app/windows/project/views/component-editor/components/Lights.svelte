<script>
    import Range from "../../../../../components/range/Range.svelte";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";

    export let entityID
    export let type
    export let selected
    export let submit

    let state
    $: {
        state = {
            attenuation: selected.attenuation ? {
                x: selected.attenuation[0],
                y: selected.attenuation[1],
                z: selected.attenuation[2]
            } : {},
            color: {
                r: selected.color[0],
                g: selected.color[1],
                b: selected.color[2]
            },
            size: selected.size,
            indirectAttenuation: selected.attenuation,
            lpvSamples: selected.lpvSamples,
            zNear: selected.zNear,
            zFar: selected.zFar,
            shadowMap: selected.shadowMap,
            intensity: selected.intensity
        }
    }
</script>
{#if type === COMPONENTS.POINT_LIGHT}
    <Accordion title={"Attenuation"} type={"flex"}>
        <Range
                accentColor={"red"}
                incrementPercentage={.01}
                minValue={.0001}
                precision={2}
                value={state.attenuation.x}
                onFinish={(v) => {
                submit([v, state.attenuation.y, state.attenuation.z], "attenuation")
                state = {
                    ...state,
                    attenuation: {
                        ...state.attenuation,
                        x: v
                    }
                }
            }}
                handleChange={e => selected.attenuation[0] = e}/>
        <Range
                accentColor={"green"}
                incrementPercentage={.01}
                minValue={.01}
                precision={2}
                value={state.attenuation.y}
                onFinish={(v) => {
                submit([state.attenuation.x, v, state.attenuation.z], "attenuation")
                state = {
                    ...state,
                    attenuation: {
                        ...state.attenuation,
                        y: v
                    }
                }
            }}
                handleChange={e => selected.attenuation[1] = e}/>
        <Range
                accentColor={"blue"}
                incrementPercentage={.01}
                minValue={.01}
                precision={2}
                value={state.attenuation.z}
                onFinish={(v) => {
                submit([state.attenuation.x, state.attenuation.y, v], "attenuation")
                state = {
                    ...state,
                    attenuation: {
                        ...state.attenuation,
                      z: v
                    }}

            }}
                handleChange={e => selected.attenuation[2] = e}/>

    </Accordion>
{/if}
<Accordion title={"View planes"} type={"grid"}>
    <Range
        accentColor={"red"}
        value={state.zFar}
        label={"Far"}
        precision={3}
        incrementPercentage={.01}
        onFinish={(v) => {
            submit(v, "zFar")
            state = {
                ...state,
                zFar: v
            }
        }}
    />
    <Range
            accentColor={"green"}
            value={state.zNear}
            label={"Near"}
            precision={3}
            incrementPercentage={.01}
            onFinish={(v) => {
                submit(v, "zNear")
                state = {
                    ...state,
                    zNear: v
                }
            }}
            handleChange={e => {
            state = {
                ...state,
                zNear: e
            }
        }}
    />
</Accordion>
<Accordion title={"Intensity & color"}>
    <ColorPicker
            value={state.color}
            submit={color => {
            const split = color.match(/[\d.]+/g)
            const [r, g, b] = split.map(v => parseFloat(v))
            state = {
                ...state,
                color: {r: r, g: g, b: b}
            }
            submit([r, g, b], "color")
        }}
    />
    <Range
            label={"Intensity"}
            accentColor={"red"}
            value={state.intensity}
            minValue={.0001}
            incrementPercentage={.01}
            precision={4}
            onFinish={(v) => {
            submit(v, "intensity")
            state = {
                ...state,
                intensity: v
                }
            }}
            handleChange={e => selected.intensity = e}/>
</Accordion>
<Accordion title={"Shadows"} type={"grid"}>

    <Checkbox
            label={"Casts shadows"}
            checked={state.shadowMap}
            handleCheck={() => {
                state = {...state, shadowMap: !state.shadowMap}
                submit(!state.shadowMap, "shadowMap")
            }}/>
    {#if type === COMPONENTS.DIRECTIONAL_LIGHT || type === COMPONENTS.SKYLIGHT}
        <Range
                label={"Size"}
                accentColor={"green"}
                value={state.size}
                minValue={1}
                incrementPercentage={1}
                precision={0}
                onFinish={(v) => {
                submit(v, "size")
                state = {
                    ...state,
                    size: v
                }
            }}
                handleChange={e => {
                selected.size = e
            }}
        />
    {/if}

</Accordion>




