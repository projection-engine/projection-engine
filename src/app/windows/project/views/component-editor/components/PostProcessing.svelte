<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Range from "../../../../../components/range/Range.svelte";

    export let selected
</script>

<Accordion title={"Lens distortion"}>
    <Checkbox
        noMargin={true}
        checked={selected.distortion}
        handleCheck={() => selected.distortion = !selected.distortion}
        label={"Enabled"}
        height={"25px"}
        width={"100%"}
    />
    <Range
        label={"Strength"}
        disabled={!selected.distortion}
        onFinish={v => {
            selected.distortionStrength = v
        }}
        incrementPercentage={.01}
        precision={3}

        value={selected.distortionStrength} maxValue={10} minValue={0}
    />
</Accordion>

<Accordion title={"Chromatic aberration"}>
    <Checkbox
        noMargin={true}
        checked={selected.chromaticAberration}
        handleCheck={() => selected.chromaticAberration = !selected.chromaticAberration}
        label={"Chromatic aberration"}
        height={"25px"}
        width={"100%"}
    />
    <Range
        label={"Strength"}
        disabled={!selected.chromaticAberration}
        onFinish={v => {
            selected.chromaticAberrationStrength = v
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
        noMargin={true}
        checked={selected.filmGrain}
        handleCheck={() => selected.filmGrain = !selected.filmGrain}
        label={"Enabled"}
        height={"25px"}
        width={"100%"}
    />

    <Range
        label={"Strength"}
        disabled={!selected.filmGrain}
        onFinish={v => {
            selected.filmGrainStrength = v
        }}
        incrementPercentage={.001}
        precision={3}
        value={selected.filmGrainStrength} maxValue={10} minValue={0}
    />
</Accordion>

<Accordion title={"Bloom"}>
    <Checkbox
        noMargin={true}
        checked={selected.bloom}
        handleCheck={() => selected.bloom = !selected.bloom}
        label={"Enabled"}
        height={"25px"}
        width={"100%"}/>

    <Range
        label={"Strength"}

        disabled={!selected.bloom}
        onFinish={v => {
            selected.bloomStrength = v
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
            selected.bloomThreshold = v
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
            selected.gamma = v
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
            selected.exposure = v
        }}
        value={selected.exposure}
    />
</Accordion>


