<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import Localization from "../../../../../libs/libs/Localization";

    export let settings
    export let update

    const translate = (key) => Localization.PROJECT.INSPECTOR[key]
</script>

<Accordion title={"Lens distortion"}>
    <Checkbox
        checked={settings.distortion}
        handleCheck={() => {
                    update("distortion",  !settings.distortion)

        }}
        label={"Enabled"}
    />
    <Range
        label={"Strength"}
        disabled={!settings.distortion}
        onFinish={v => {
            update("distortionStrength",  v)
        }}
        incrementPercentage={.01}
        precision={3}

        value={settings.distortionStrength} maxValue={10} minValue={0}
    />
</Accordion>

<Accordion title={"Chromatic aberration"}>
    <Checkbox
        checked={settings.chromaticAberration}
        handleCheck={() => update("chromaticAberration", !settings.chromaticAberration)}
        label={"Enabled"}
    />
    <Range
        label={"Strength"}
        disabled={!settings.chromaticAberration}
        onFinish={v => {
            update("chromaticAberrationStrength",  v)
        }}
        incrementPercentage={.01}
        precision={3}
        value={settings.chromaticAberrationStrength}
        maxValue={10}
        minValue={0}
    />
</Accordion>

<Accordion title={"Film grain"}>
    <Checkbox
        checked={settings.filmGrain}
        handleCheck={() => update("filmGrain",  !settings.filmGrain)}
        label={"Enabled"}
    />

    <Range
        label={"Strength"}
        disabled={!settings.filmGrain}
        onFinish={v => {
            update("filmGrainStrength",  v)
        }}
        incrementPercentage={.001}
        precision={3}
        value={settings.filmGrainStrength} maxValue={10} minValue={0}
    />
</Accordion>

<Accordion title={"Bloom"}>
    <Checkbox

        checked={settings.bloom}
        handleCheck={() => update("bloom",  !settings.bloom)}
        label={"Enabled"}
    />

    <Range
        label={"Strength"}

        disabled={!settings.bloom}
        onFinish={v => {
            update("bloomStrength",  v)
        }}
        incrementPercentage={.001}
        precision={3}
        value={settings.bloomStrength} maxValue={10} minValue={0}/>

    <Range
        label={"Threshold"}

        disabled={!settings.bloom}
        incrementPercentage={.001}
        precision={3}
        onFinish={v => {
            update("bloomThreshold",  v)
        }}
        value={settings.bloomThreshold}

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
            update("gamma",  v)
        }}
        value={settings.gamma}
    />

    <Range
        label={"Exposure"}

        minValue={.1}
        incrementPercentage={.001}
        precision={3}
        maxValue={10}
        onFinish={v => {
            update("exposure",  v)
        }}
        value={settings.exposure}
    />
</Accordion>


