<script>
    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import {onDestroy, onMount} from "svelte";
    import DataStoreController from "../../../stores/DataStoreController";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";

    let engine = {}
    let settings = {}
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)
    onDestroy(() => unsubscribeSettings())
    let state = {}
    onMount(() => {
        const newState = {}
        newState.FXAASpanMax = settings.FXAASpanMax
        newState.FXAAReduceMin = settings.FXAAReduceMin
        newState.FXAAReduceMul = settings.FXAAReduceMul

        newState.shadowMapResolution = settings.shadowMapResolution
        newState.shadowAtlasQuantity = settings.shadowAtlasQuantity
        newState.pcfSamples = settings.pcfSamples

        newState.total_strength = settings.total_strength
        newState.base = settings.base
        newState.area = settings.area
        newState.falloff = settings.falloff
        newState.radius = settings.radius
        newState.samples = settings.samples

        newState.ssgiQuality = settings.ssgiQuality
        newState.ssgiBrightness = settings.ssgiBrightness
        newState.ssgiStepSize = settings.ssgiStepSize

        newState.ssrMaxSteps = settings.ssrMaxSteps
        newState.ssrStepSize = settings.ssrStepSize

        state = newState
    })
</script>
<Accordion title={"Resolution"}>
    <Range
            label={"X"}
            variant={"embedded"}
            onFinish={v => settings.resolution = [v, settings.resolution[1]]}
            incrementPercentage={1}
            precision={0}
            handleChange={() => null}
            value={settings.resolution[0]}
            minValue={1}
    />
    <Range
            label={"Y"}
            variant={"embedded"}
            onFinish={v => settings.resolution = [settings.resolution[0], v]}
            incrementPercentage={1}
            precision={0}
            handleChange={() => null}
            value={settings.resolution[1]}
            minValue={1}
    />
</Accordion>
<Checkbox
    checked={settings.fxaa}
    handleCheck={() => settings.fxaa = !settings.fxaa}
    label={"Anti-aliasing"}
/>

<Accordion title={"Screen space reflections"}>
    <Checkbox
            checked={settings.ssr}
            handleCheck={() => settings.ssr = !settings.ssr}
            label={"Enabled"}
    />
    <Range
            disabled={!settings.ssr}
            label={"Steps"}
            onFinish={v => settings.ssrMaxSteps = v}
            incrementPercentage={1}
            precision={0}
            minValue={0}
            maxValue={100}
            handleChange={v => window.renderer.params.ssrMaxSteps = v}
            value={state.ssrMaxSteps}
    />
    <Range
            disabled={!settings.ssr}
            label={"Step size"}
            onFinish={v => settings.ssrStepSize = v}
            incrementPercentage={.001}
            precision={4}
            minValue={.05}
            maxValue={1}
            handleChange={v => window.renderer.params.ssrStepSize = v}
            value={state.ssrStepSize}
    />
</Accordion>


<Accordion title={"Global illumination"}>
    <Checkbox
            checked={settings.ssgi}
            handleCheck={() => settings.ssgi = !settings.ssgi}
            label={"Enabled"}
    />
    <Range
            disabled={!settings.ssgi}
            label={"Steps"}
            onFinish={v => settings.ssgiQuality = v}
            incrementPercentage={1}
            precision={0}
            minValue={0}
            maxValue={100}
            handleChange={v => window.renderer.params.ssgiQuality = v}
            value={state.ssgiQuality}
    />

    <Range
            disabled={!settings.ssgi}
            label={"Intensity"}
            onFinish={v => {
                        settings.ssgiBrightness = v
                        state.ssgiBrightness = v
                    }}
            incrementPercentage={.001}
            precision={4}
            minValue={0}
            maxValue={10}
            handleChange={v => {
                        // state.ssgiBrightness = v
                        window.renderer.params.ssgiBrightness = v
                    }}
            value={state.ssgiBrightness}
    />

    <Range
            disabled={!settings.ssgi}
            label={"Step size"}
            onFinish={v => {
                        settings.ssgiStepSize = v
                        state.ssgiStepSize = v
                    }}
            incrementPercentage={.001}
            precision={4}
            minValue={.05}
            maxValue={1}
            handleChange={v => window.renderer.params.ssgiStepSize = v}
            value={state.ssgiStepSize}
    />

</Accordion>

<Accordion title={"Shadows"}>

    <Range
            label={"Atlas resolution"}
            accentColor={"red"}
            onFinish={v => settings.shadowMapResolution = v}
            incrementPercentage={1}
            precision={0}
            minValue={1}
            handleChange={v => state.shadowMapResolution = v}
            value={state.shadowMapResolution}
    />
    <div class="inline">
        <Range
                label={"Lights"}
                accentColor={"red"}
                onFinish={v => settings.shadowAtlasQuantity = v}
                incrementPercentage={1}
                precision={0}
                minValue={1}
                handleChange={v => state.shadowAtlasQuantity = v}
                value={state.shadowAtlasQuantity}
        />

        <Range
                label={"Smoothing samples"}
                accentColor={"green"}
                onFinish={v => settings.pcfSamples = v}
                incrementPercentage={1}
                precision={0}
                minValue={1}
                maxValue={10}
                handleChange={v => state.pcfSamples = v}
                value={state.pcfSamples}
        />
    </div>
</Accordion>

<Accordion title={"Ambient occlusion"}>
    <Checkbox
            checked={settings.ao}
            handleCheck={() => settings.ao = !settings.ao}
            label={"Enabled"}
    />
    <div class="inline">
        <Range
                disabled={!settings.ao}
                label={"Strength"}
                accentColor={"red"}
                onFinish={v => settings.total_strength = v}
                incrementPercentage={.001}
                precision={3}
                minValue={0}
                handleChange={v => state.total_strength = v}
                value={state.total_strength}
        />
        <Range
                disabled={!settings.ao}
                label={"Base"}
                accentColor={"green"}
                onFinish={v => settings.base = v}
                incrementPercentage={.001}
                precision={3}
                minValue={0}
                handleChange={v => state.base = v}
                value={state.base}
        />
    </div>

    <div class="inline">
        <Range
                disabled={!settings.ao}
                label={"Area"}
                accentColor={"red"}
                onFinish={v => settings.area = v}
                incrementPercentage={.001}
                precision={3}
                minValue={0}
                handleChange={v => state.area = v}
                value={state.area}
        />
        <Range
                disabled={!settings.ao}
                label={"Falloff"}
                accentColor={"green"}
                onFinish={v => settings.falloff = v}
                incrementPercentage={.001}
                precision={3}
                minValue={0}
                handleChange={v => state.falloff = v}
                value={state.falloff}
        />
    </div>

    <div class="inline">
        <Range
                disabled={!settings.ao}
                label={"Radius"}
                accentColor={"red"}
                onFinish={v => settings.radius = v}
                incrementPercentage={.001}
                precision={3}
                minValue={0}
                handleChange={v => state.radius = v}
                value={state.radius}
        />

        <Range
                label={"Samples"}
                accentColor={"red"}
                onFinish={v => settings.samples = v}
                incrementPercentage={1}
                precision={0}
                minValue={1} disabled={true}
                maxValue={10}
                handleChange={v => state.samples = v}
                value={state.samples}
        />
    </div>
</Accordion>
