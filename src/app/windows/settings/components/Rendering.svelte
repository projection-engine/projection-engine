<script>
    import Range from "../../../components/range/Range.svelte";
    import Accordion from "../../../components/accordion/Accordion.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import Localization from "../../../libs/Localization";
    import Renderer from "../../project/libs/engine/Renderer";

    export let settings
    export let update

    const translate = (key) => Localization.PROJECT.INSPECTOR[key]

</script>


<Checkbox
        checked={settings.fxaa}
        handleCheck={() => {
               update("fxaa", !settings.fxaa)
        }}
        label={translate("AA")}
/>
<Accordion title={translate("RESOLUTION")}>
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

<Accordion title={translate("SSR")}>
    <Checkbox
            checked={settings.ssr}
            handleCheck={() => {
                update("ssr",  !settings.ssr)
            }}
            label={translate("ENABLED")}
    />
    <Range
            disabled={!settings.ssr}
            label={translate("STEPS")}
            onFinish={v => {
                update("ssrMaxSteps", v)

            }}
            incrementPercentage={1}
            precision={0}
            minValue={0}
            maxValue={100}
            handleChange={v => Renderer.params.ssrMaxSteps = v}
            value={settings.ssrMaxSteps}
    />
    <Range
            disabled={!settings.ssr}
            label={translate("STEP_SIZE")}
            onFinish={v => {
                update("ssrStepSize", v)
            }}
            incrementPercentage={.001}
            precision={4}
            minValue={.05}
            maxValue={1}
            handleChange={v => Renderer.params.ssrStepSize = v}
            value={settings.ssrStepSize}
    />
</Accordion>


<Accordion title={translate("SSGI")}>
    <Checkbox
            checked={settings.ssgi}
            handleCheck={() =>  {
                update("ssgi", !settings.ssgi)
            }}
            label={translate("ENABLED")}
    />
    <Range
            disabled={!settings.ssgi}
            label={translate("STEPS")}
            onFinish={v => {
                    update("ssgiQuality", v)
            }}
            incrementPercentage={1}
            precision={0}
            minValue={0}
            maxValue={100}
            handleChange={v => Renderer.params.ssgiQuality = v}
            value={settings.ssgiQuality}
    />

    <Range
            disabled={!settings.ssgi}
            label={translate("STRENGTH")}
            onFinish={v => {
                update("ssgiBrightness", v)
            }}
            incrementPercentage={.001}
            precision={4}
            minValue={0}
            maxValue={10}
            handleChange={v => {
                Renderer.params.ssgiBrightness = v
            }}
            value={settings.ssgiBrightness}
    />

    <Range
            disabled={!settings.ssgi}
            label={translate("STEP_SIZE")}
            onFinish={v => {
                update("ssgiStepSize", v)
            }}
            incrementPercentage={.001}
            precision={4}
            minValue={.05}
            maxValue={1}
            handleChange={v => Renderer.params.ssgiStepSize = v}
            value={settings.ssgiStepSize}
    />

</Accordion>

<Accordion title={translate("SHADOWS")}>

    <Range
            label={translate("RESOLUTION")}
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
                label={translate("LIGHTS")}
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
                label={translate("SMOOTHING_SAMPLES")}
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

<Accordion title={translate("AO")}>
    <Checkbox
            checked={settings.ao}
            handleCheck={() => update("ao", !settings.ao)}
            label={translate("ENABLED")}
    />
    <div data-inline="-">
        <Range
                disabled={!settings.ao}
                label={translate("STRENGTH")}
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
                label={translate("BASE")}
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
                label={translate("AREA")}
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
                label={translate("FALLOFF")}
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

                label={translate("RADIUS")}
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
                label={translate("SAMPLES")}
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
