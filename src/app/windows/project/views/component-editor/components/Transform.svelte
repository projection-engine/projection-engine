<script>
    import Range from "../../../../../components/range/Range.svelte";

    export let entityID
    export let selected
    export let submitRotation
    export let submitTranslation
    export let submitScaling

    let state = {}
    $: {
        const euler = selected.rotationUpdated ? selected.rotation : Transformation.getEuler(selected.rotationQuat)
        state = {
            xT: selected.translation[0],
            yT: selected.translation[1],
            zT: selected.translation[2],

            xS: selected.scaling[0],
            yS: selected.scaling[1],
            zS: selected.scaling[2],

            xR: euler[0] * 180 / Math.PI,
            yR: euler[1] * 180 / Math.PI,
            zR: euler[2] * 180 / Math.PI,
        }
    }
</script>

<div class="label" style="margin-top: 4px">Translation</div>
<Range
        accentColor={"red"}
        variant={"embedded"}
        label={"X"}
        value={state.xT}
        precision={3}
        incrementPercentage={.01}
        onFinish={(v) => {
                    state = {
                        ...state,
                        xT: v
                    }
                }}
        handleChange={e => {
                    selected.translation[0] = e
                    selected.changed = true
                }}
/>
<Range
        accentColor={"#00ff00"}
        label={"Y"}
        variant={"embedded"}
        precision={3}
        incrementPercentage={.01}
        value={state.yT}
        onFinish={(v) => {
                    state = {
                        ...state,
                        yT: v
                    }
                }}
        handleChange={e => {
                    selected.translation[1] = e
                    selected.changed = true
                }}
/>
<Range
        accentColor={"blue"}
        label={"Z"}
        variant={"embedded"}
        precision={3}
        incrementPercentage={.01}
        value={state.zT}
        onFinish={(v) => {
                    state = {
                        ...state,
                        zT: v
                    }
                    // window.renderer.
                }}
        handleChange={e => {
                    selected.translation[2] = e
                    selected.changed = true
                }}
/>

<div class="label" style="margin-top: 4px">Scaling</div>
<Range
        disabled={selected.lockedScaling}
        accentColor={"red"}
        label={"X"}
        variant={"embedded"}
        value={state.xS}
        minValue={0.001}
        precision={3}

        incrementPercentage={.01}
        onFinish={(v) => {
                    submitScaling("x", v)
                }}
        handleChange={e => {
                    selected.scaling = [e, selected.scaling[1], selected.scaling[2]]
                    state = {...state, xS: e}

                }}
/>
<Range
        disabled={selected.lockedScaling}
        accentColor={"#00ff00"}
        label={"Y"}
        variant={"embedded"}
        value={state.yS}
        minValue={0.001}
        precision={3}
        incrementPercentage={.01}
        onFinish={(v) => {
                    submitScaling("y", v)
                }}
        handleChange={e => {
                    selected.scaling = [selected.scaling[0], e, selected.scaling[2]]
                    state = {...state, yS: e}

                }}/>
<Range
        disabled={selected.lockedScaling}
        accentColor={"blue"}
        label={"Z"}
        variant={"embedded"}
        value={state.zS}
        minValue={0.001}
        precision={3}
        incrementPercentage={.01}
        onFinish={(v) => {
                    submitScaling("z", v)
                }}
        handleChange={e => {
                    selected.scaling = [selected.scaling[0], selected.scaling[1], e]
                    state = {...state, zS: e}

                }}
/>

<div class="label" style="margin-top: 4px">Rotation</div>
<Range
        disabled={selected.lockedRotation}
        accentColor={"red"}
        label={"X"}
        variant={"embedded"}
        metric={"angle"}
        value={state.xR}
        onFinish={(v) => {
            submitRotation("x", v * Math.PI / 180)
        }}
        handleChange={e => {
                    selected.rotation = [parseFloat(e) * Math.PI / 180, selected.rotation[1], selected.rotation[2]]
                    state = {...state, xR: parseFloat(e)}
                }}/>
<Range
        disabled={selected.lockedRotation}
        metric={"angle"}
        accentColor={"#00ff00"}
        label={"Y"}
        variant={"embedded"}
        value={state.yR}
        onFinish={(v) => {
            submitRotation("y", v * Math.PI / 180)
        }}
        handleChange={e => {
            selected.rotation = [selected.rotation[0], parseFloat(e) * Math.PI / 180, selected.rotation[2]]
            state = {...state, yR: parseFloat(e)}
        }}
/>
<Range
        accentColor={"blue"}
        disabled={selected.lockedRotation}
        metric={"angle"}
        label={"Z"}
        variant={"embedded"}
        value={state.zR}
        onFinish={(v) => {
                submitRotation("z", v * Math.PI / 180)
            }}
        handleChange={e => {
        selected.rotation = [selected.rotation[0], selected.rotation[1], parseFloat(e) * Math.PI / 180]
        state = {...state, zR: parseFloat(e)}
    }}
/>



