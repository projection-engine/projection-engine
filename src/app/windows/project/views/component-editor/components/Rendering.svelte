<script>
    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import {onDestroy, onMount} from "svelte";
    import DataStoreController from "../../../stores/DataStoreController";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";

    let settings = {}
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)
    onDestroy(() => unsubscribeSettings())

    function update(key, value){
        DataStoreController.updateSettings({...settings, [key]: value})
    }
</script>
<Accordion title={"Resolution"}>
    <Range
            label={"X"}
            variant={"embedded"}
            onFinish={v => {
                update("resolution", [v, settings.resolution[1]])
            }}
            incrementPercentage={1}
            precision={0}
            handleChange={() => null}
            value={settings.resolution[0]}
            minValue={1}
    />
    <Range
            label={"Y"}
            variant={"embedded"}
            onFinish={v => {
                update("resolution", [settings.resolution[0], v])
            }}
            incrementPercentage={1}
            precision={0}
            handleChange={() => null}
            value={settings.resolution[1]}
            minValue={1}
    />
</Accordion>
<Checkbox
        checked={settings.fxaa}
        handleCheck={() => {
               update("fxaa", !settings.fxaa)
        }}
        label={"Anti-aliasing"}
/>

<Accordion title={"Screen space reflections"}>
    <Checkbox
            checked={settings.ssr}
            handleCheck={() => {
                update("ssr",  !settings.ssr)
            }}
            label={"Enabled"}
    />
    <Range
            disabled={!settings.ssr}
            label={"Steps"}
            onFinish={v => {
                update("ssrMaxSteps", v)

            }}
            incrementPercentage={1}
            precision={0}
            minValue={0}
            maxValue={100}
            handleChange={v => window.renderer.params.ssrMaxSteps = v}
            value={settings.ssrMaxSteps}
    />
    <Range
            disabled={!settings.ssr}
            label={"Step size"}
            onFinish={v => {
                update("ssrStepSize", v)
            }}
            incrementPercentage={.001}
            precision={4}
            minValue={.05}
            maxValue={1}
            handleChange={v => window.renderer.params.ssrStepSize = v}
            value={settings.ssrStepSize}
    />
</Accordion>


<Accordion title={"Global illumination"}>
    <Checkbox
            checked={settings.ssgi}
            handleCheck={() =>  {
                update("ssgi", !settings.ssgi)
            }}
            label={"Enabled"}
    />
    <Range
            disabled={!settings.ssgi}
            label={"Steps"}
            onFinish={v => {
                    update("ssgiQuality", v)
            }}
            incrementPercentage={1}
            precision={0}
            minValue={0}
            maxValue={100}
            handleChange={v => window.renderer.params.ssgiQuality = v}
            value={settings.ssgiQuality}
    />

    <Range
            disabled={!settings.ssgi}
            label={"Intensity"}
            onFinish={v => {
                update("ssgiBrightness", v)
            }}
            incrementPercentage={.001}
            precision={4}
            minValue={0}
            maxValue={10}
            handleChange={v => {
                window.renderer.params.ssgiBrightness = v
            }}
            value={settings.ssgiBrightness}
    />

    <Range
            disabled={!settings.ssgi}
            label={"Step size"}
            onFinish={v => {
                update("ssgiStepSize", v)
            }}
            incrementPercentage={.001}
            precision={4}
            minValue={.05}
            maxValue={1}
            handleChange={v => window.renderer.params.ssgiStepSize = v}
            value={settings.ssgiStepSize}
    />

</Accordion>

<Accordion title={"Shadows"}>

    <Range
            label={"Atlas resolution"}
            accentColor={"red"}
            onFinish={v => {
                update("shadowMapResolution", v)
            }}
            incrementPercentage={1}
            precision={0}
            minValue={1}

            value={settings.shadowMapResolution}
    />
    <div data-inline="-">
        <Range
                label={"Lights"}
                accentColor={"red"}
                onFinish={v => {
                    update("shadowAtlasQuantity", v)
                }}
                incrementPercentage={1}
                precision={0}
                minValue={1}

                value={settings.shadowAtlasQuantity}
        />

        <Range
                label={"Smoothing samples"}
                accentColor={"green"}
                onFinish={v => {
                    update("pcfSamples", v)
                }}
                incrementPercentage={1}
                precision={0}
                minValue={1}
                maxValue={10}

                value={settings.pcfSamples}
        />
    </div>
</Accordion>

<Accordion title={"Ambient occlusion"}>
    <Checkbox
            checked={settings.ao}
            handleCheck={() => update("ao", !settings.ao)}
            label={"Enabled"}
    />
    <div data-inline="-">
        <Range
                disabled={!settings.ao}
                label={"Strength"}
                accentColor={"red"}
                onFinish={v => {
                    update("total_strength", v)
                }}
                incrementPercentage={.001}
                precision={3}
                minValue={0}

                value={settings.total_strength}
        />
        <Range
                disabled={!settings.ao}
                label={"Base"}
                accentColor={"green"}
                onFinish={v => {
                    update("base", v)
                }}
                incrementPercentage={.001}
                precision={3}
                minValue={0}

                value={settings.base}
        />
    </div>

    <div data-inline="-">
        <Range
                disabled={!settings.ao}
                label={"Area"}
                accentColor={"red"}
                onFinish={v => {
                    update("area", v)
                }}
                incrementPercentage={.001}
                precision={3}
                minValue={0}

                value={settings.area}
        />
        <Range
                disabled={!settings.ao}
                label={"Falloff"}
                accentColor={"green"}
                onFinish={v => {
                    update("falloff", v)
                }}
                incrementPercentage={.001}
                precision={3}
                minValue={0}

                value={settings.falloff}
        />
    </div>

    <div data-inline="-">
        <Range
                disabled={!settings.ao}
                label={"Radius"}
                accentColor={"red"}
                onFinish={v =>{
                    update("radius", v)
                }}
                incrementPercentage={.001}
                precision={3}
                minValue={0}

                value={settings.radius}
        />

        <Range
                label={"Samples"}
                accentColor={"red"}
                onFinish={v => {
                    update("samples", v)
                }}
                incrementPercentage={1}
                precision={0}
                minValue={1} disabled={true}
                maxValue={10}

                value={settings.samples}
        />
    </div>
</Accordion>
