<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";

    export let translate
    export let selected
    export let submit
</script>

<Accordion title={"Lens distortion"}>
    <Checkbox
        checked={selected.distortion}
        handleCheck={() => {
                    submit("distortion",  !selected.distortion)

        }}
        label={"Enabled"}
    />
    <Range
        label={"Strength"}
        disabled={!selected.distortion}
        onFinish={v => {
            submit("distortionStrength",  v)
        }}
        incrementPercentage={.01}
        precision={3}

        value={selected.distortionStrength} maxValue={10} minValue={0}
    />
</Accordion>

<Accordion title={"Chromatic aberration"}>
    <Checkbox
        checked={selected.chromaticAberration}
        handleCheck={() => submit("chromaticAberration", !selected.chromaticAberration)}
        label={"Enabled"}
    />
    <Range
        label={"Strength"}
        disabled={!selected.chromaticAberration}
        onFinish={v => {
            submit("chromaticAberrationStrength",  v)
        }}
        incrementPercentage={.01}
        precision={3}
        value={selected.chromaticAberrationStrength}
        maxValue={10}
        minValue={0}
    />
</Accordion>

<Accordion title={"Film grain"}>
    <Checkbox
        checked={selected.filmGrain}
        handleCheck={() => submit("filmGrain",  !selected.filmGrain)}
        label={"Enabled"}
    />

    <Range
        label={"Strength"}
        disabled={!selected.filmGrain}
        onFinish={v => {
            submit("filmGrainStrength",  v)
        }}
        incrementPercentage={.001}
        precision={3}
        value={selected.filmGrainStrength} maxValue={10} minValue={0}
    />
</Accordion>

<Accordion title={"Bloom"}>
    <Checkbox

        checked={selected.bloom}
        handleCheck={() => submit("bloom",  !selected.bloom)}
        label={"Enabled"}
    />

    <Range
        label={"Strength"}

        disabled={!selected.bloom}
        onFinish={v => {
            submit("bloomStrength",  v)
        }}
        incrementPercentage={.001}
        precision={3}
        value={selected.bloomStrength} maxValue={10} minValue={0}/>

    <Range
        label={"Threshold"}

        disabled={!selected.bloom}
        incrementPercentage={.001}
        precision={3}
        onFinish={v => {
            submit("bloomThreshold",  v)
        }}
        value={selected.bloomThreshold}

        maxValue={1} minValue={0}
    />
</Accordion>

<Accordion title={"Color correction"}>
    <Range
        label={"Gamma"}

        incrementPercentage={.001}
        precision={3}
        minValue={.1}
        maxValue={10}
        onFinish={v => {
            submit("gamma",  v)
        }}
        value={selected.gamma}
    />

    <Range
        label={"Exposure"}

        minValue={.1}
        incrementPercentage={.001}
        precision={3}
        maxValue={10}
        onFinish={v => {
            submit("exposure",  v)
        }}
        value={selected.exposure}
    />
</Accordion>


