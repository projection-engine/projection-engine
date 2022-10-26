<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";

    export let settings
    export let update

</script>

<fieldset>
    <legend>{"Lens distortion"}</legend>
    <div class="content">
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
    </div>
</fieldset>

<fieldset>
    <legend>{"Chromatic aberration"}</legend>
    <div class="content">
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
    </div>
</fieldset>

<fieldset>
    <legend>{"Film grain"}</legend>
    <div class="content">
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
    </div>
</fieldset>

<fieldset>
    <legend>{"Bloom"}</legend>
    <div class="content">
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
    </div>
</fieldset>

<fieldset>
    <legend>{"Color correction"}</legend>
    <div class="content">
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
    </div>
</fieldset>

<style>
    legend {
        font-size: .8rem;
    }

    .content {
        padding-left: 25%;
        display: grid;
        gap: 4px;
    }
</style>
