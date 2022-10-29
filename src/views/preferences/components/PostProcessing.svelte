<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import VisualsStore from "../../../stores/VisualsStore";

    export let visualSettings
    function update(key, value) {
        VisualsStore.updateStore({...visualSettings, [key]: value})
    }
</script>

<fieldset>
    <legend>{"Lens distortion"}</legend>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.distortion}
                handleCheck={() => {
                    update("distortion",  !visualSettings.distortion)

        }}
                label={"Enabled"}
        />
        <Range
                label={"Strength"}
                disabled={!visualSettings.distortion}
                onFinish={v => {
            update("distortionStrength",  v)
        }}
                incrementPercentage={.01}
                precision={3}

                value={visualSettings.distortionStrength} maxValue={10} minValue={0}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{"Chromatic aberration"}</legend>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.chromaticAberration}
                handleCheck={() => update("chromaticAberration", !visualSettings.chromaticAberration)}
                label={"Enabled"}
        />
        <Range
                label={"Strength"}
                disabled={!visualSettings.chromaticAberration}
                onFinish={v => {
            update("chromaticAberrationStrength",  v)
        }}
                incrementPercentage={.01}
                precision={3}
                value={visualSettings.chromaticAberrationStrength}
                maxValue={10}
                minValue={0}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{"Film grain"}</legend>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.filmGrain}
                handleCheck={() => update("filmGrain",  !visualSettings.filmGrain)}
                label={"Enabled"}
        />

        <Range
                label={"Strength"}
                disabled={!visualSettings.filmGrain}
                onFinish={v => update("filmGrainStrength",  v)}
                incrementPercentage={.0001}
                precision={4}

                value={visualSettings.filmGrainStrength} maxValue={1} minValue={0}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{"Bloom"}</legend>
    <div data-form="-">
        <Checkbox

                checked={visualSettings.bloom}
                handleCheck={() => update("bloom",  !visualSettings.bloom)}
                label={"Enabled"}
        />

        <Range
                label={"Strength"}

                disabled={!visualSettings.bloom}
                onFinish={v => update("bloomStrength",  v)}
                incrementPercentage={.001}
                precision={3}
                value={visualSettings.bloomStrength} maxValue={10} minValue={0}/>

        <Range
                label={"Threshold"}

                disabled={!visualSettings.bloom}
                incrementPercentage={.001}
                precision={3}
                onFinish={v => update("bloomThreshold",  v)}
                value={visualSettings.bloomThreshold}

                maxValue={1} minValue={0}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{"Color correction"}</legend>
    <div data-form="-">
        <Range
                label={"Gamma"}

                incrementPercentage={.001}
                precision={3}
                minValue={.1}
                maxValue={10}
                onFinish={v => update("gamma",  v)}
                value={visualSettings.gamma}
        />

        <Range
                label={"Exposure"}

                minValue={.1}
                incrementPercentage={.001}
                precision={3}
                maxValue={10}
                onFinish={v => update("exposure",  v)}
                value={visualSettings.exposure}
        />
    </div>
</fieldset>

