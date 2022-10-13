<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Accordion from "../../../components/accordion/Accordion.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import Localization from "../../../libs/libs/Localization";

    export let settings
    export let update

    const translate = (key) => Localization.PROJECT.INSPECTOR[key]

    function updateSubObject(objKey, subKey, value) {
        const old = {...settings[objKey]}
        old[subKey] = value
        update(objKey, old)
    }
</script>


<Checkbox
        checked={settings.fxaa}
        handleCheck={() => {
               update("fxaa", !settings.fxaa)
        }}
        label={translate("AA")}
/>

<Accordion title={translate("SSR")}>
    <Checkbox
            checked={settings.SSR.enabled}
            handleCheck={() => updateSubObject("SSR","enabled",!settings.SSR.enabled)}
            label={translate("ENABLED")}
    />

    <div data-inline="-">
        <Range
                label={translate("STEPS")}
                minValue={1}
                integer={true}
                value={settings.SSR.maxSteps}
                onFinish={v => updateSubObject("SSR","maxSteps",v)}
        />
        <Range
                label={translate("STEP_SIZE")}
                incrementPercentage={.001}
                precision={4}
                value={settings.SSR.stepSize}
                onFinish={v => updateSubObject("SSR","stepSize",v)}
        />

    </div>
    <div data-inline="-">
        <Range
                label={translate("DEPTH_THRESHOLD")}
                incrementPercentage={.001}
                precision={4}
                minValue={0}
                value={settings.SSR.depthThreshold}
                onFinish={v => updateSubObject("SSR","depthThreshold",v)}
        />

        <Range
                label={translate("BINARY_SEARCH")}
                integer={true}
                minValue={1}

                value={settings.SSR.binarySearchSteps}
                onFinish={v => updateSubObject("SSR","binarySearchSteps",v)}
        />
    </div>
</Accordion>


<Accordion title={translate("SSGI")}>
    <Checkbox
            checked={settings.SSGI.enabled}
            handleCheck={() => updateSubObject("SSGI","enabled",!settings.SSGI.enabled)}
            label={translate("ENABLED")}
    />
    <div data-inline="-">
        <Range

                label={translate("STEPS")}

                minValue={1}
                integer={true}
                value={settings.SSGI.maxSteps}
                onFinish={v => updateSubObject("SSGI","maxSteps",v)}
        />

        <Range

                label={translate("STRENGTH")}

                incrementPercentage={.01}
                precision={3}
                minValue={0}

                value={settings.SSGI.strength}
                onFinish={v => updateSubObject("SSGI","strength",v)}
        />
    </div>
    <div data-inline="-">
        <Range
                label={translate("STEP_SIZE")}

                incrementPercentage={.001}
                precision={4}

                value={settings.SSGI.stepSize}
                onFinish={v => updateSubObject("SSGI","stepSize",v)}
        />

        <Range
                label={translate("DEPTH_THRESHOLD")}
                incrementPercentage={.001}
                precision={4}
                minValue={0}
                value={settings.SSGI.depthThreshold}
                onFinish={v => updateSubObject("SSGI","depthThreshold",v)}
        />

        <Range
                label={translate("BINARY_SEARCH")}
                integer={true}
                minValue={1}
                value={settings.SSGI.binarySearchSteps}
                onFinish={v => updateSubObject("SSGI","binarySearchSteps",v)}
        />
    </div>
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
            checked={settings.SSAO.enabled}
            handleCheck={() => updateSubObject("SSAO", "enabled", !settings.SSAO.enabled)}
            label={translate("ENABLED")}
    />

    <div data-inline="-">
        <Range
                label={translate("RADIUS")}
                minValue={1}
                value={settings.SSAO.radius}
                onFinish={v => updateSubObject("SSAO","radius",v)}
        />
        <Range
                label={translate("POWER")}
                integer={true}
                minValue={1}
                value={settings.SSAO.power}
                onFinish={v => updateSubObject("SSAO","power",v)}
        />
    </div>
</Accordion>
