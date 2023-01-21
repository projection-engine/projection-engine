<script>
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import VisualsStore from "../../../stores/VisualsStore";
    import AA_METHODS from "../../../../../../engine-core/static/AA_METHODS";
    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";

    export let visualSettings

    function update(key, value) {
        VisualsStore.updateStore({...visualSettings, [key]: value})
    }

    function updateSubObject(objKey, subKey, value) {
        const old = {...visualSettings[objKey]}
        old[subKey] = value
        update(objKey, old)
    }
</script>


<fieldset>
    <legend>{LOCALIZATION_EN.RESOLUTION}</legend>
    <div data-form="-">
        <Range
                label={"X"}
                onFinish={v => {
                    update("resolution", [v, visualSettings.resolution[1]])
                }}
                integer={true}
                value={visualSettings.resolution[0]}
                minValue={1}
        />
        <Range
                label={"Y"}
                onFinish={v => {
                    update("resolution", [visualSettings.resolution[0], v])
                }}
                integer={true}
                value={visualSettings.resolution[1]}
                minValue={1}
        />
    </div>
</fieldset>

<Accordion startOpen={true} title={LOCALIZATION_EN.ANTI_ALIASING}>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.AAMethod === AA_METHODS.DISABLED}
                handleCheck={() => update("AAMethod", AA_METHODS.DISABLED)}
                label={LOCALIZATION_EN.DISABLED}
        />
        <Checkbox
                checked={visualSettings.AAMethod === AA_METHODS.FXAA}
                handleCheck={() => update("AAMethod", AA_METHODS.FXAA)}
                label={LOCALIZATION_EN.FXAA}
        />
        <Checkbox
                disabled={true}
                checked={visualSettings.AAMethod === AA_METHODS.TAA}
                handleCheck={() => update("AAMethod", AA_METHODS.TAA)}
                label={LOCALIZATION_EN.TAA}
        />
    </div>
</Accordion>

<Accordion title={LOCALIZATION_EN.PHYSICS}>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.PHYSICS_SIMULATION_STEP}
                minValue={.0001}
                value={visualSettings.physicsSimulationStep * 1000}
                onFinish={v => update("physicsSimulationStep", v/1000)}
        />
        <Range
                label={LOCALIZATION_EN.PHYSICS_SUB_STEPS}
                integer={true}
                minValue={1}
                value={visualSettings.physicsSubSteps}
                onFinish={v => update("physicsSubSteps", v)}
        />
    </div>
</Accordion>

<Accordion title={LOCALIZATION_EN.SSR}>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.STEPS}
                minValue={1}
                integer={true}
                value={visualSettings.SSR.maxSteps}
                onFinish={v => updateSubObject("SSR","maxSteps",v)}
        />
        <Range
                label={LOCALIZATION_EN.STEP_SIZE}
                minValue={.1}
                value={visualSettings.SSR.stepSize}
                onFinish={v => updateSubObject("SSR","stepSize",v)}
        />

        <Range
                label={LOCALIZATION_EN.FALLOFF}


                minValue={0}
                value={visualSettings.SSR.falloff}
                onFinish={v => updateSubObject("SSR","falloff",v)}
        />

    </div>
</Accordion>


<Accordion title={LOCALIZATION_EN.SSGI}>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.SSGI.enabled}
                handleCheck={() => updateSubObject("SSGI","enabled",!visualSettings.SSGI.enabled)}
                label={LOCALIZATION_EN.ENABLED}
        />
        <Range

                label={LOCALIZATION_EN.STEPS}
                maxValue={100}
                minValue={1}
                integer={true}
                value={visualSettings.SSGI.maxSteps}
                onFinish={v => updateSubObject("SSGI","maxSteps",v)}
        />
        <Range
                label={LOCALIZATION_EN.SAMPLES}
                minValue={1}
                integer={true}
                value={visualSettings.SSGI.blurSamples}
                onFinish={v => updateSubObject("SSGI","blurSamples",v)}
        />
        <Range
                label={LOCALIZATION_EN.RADIUS}
                minValue={1}
                integer={true}
                value={visualSettings.SSGI.blurRadius}
                onFinish={v => updateSubObject("SSGI","blurRadius",v)}
        />

        <Range

                label={LOCALIZATION_EN.STRENGTH}

                incrementPercentage={.01}
                precision={3}
                minValue={0}

                value={visualSettings.SSGI.strength}
                onFinish={v => updateSubObject("SSGI","strength",v)}
        />

        <Range
                label={LOCALIZATION_EN.STEP_SIZE}


                minValue={.1}
                value={visualSettings.SSGI.stepSize}
                onFinish={v => updateSubObject("SSGI","stepSize",v)}
        />
    </div>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.GAMMA}
                minValue={.1}
                maxValue={10}
                onFinish={v => updateSubObject("SSGI","gamma",  v)}
                value={visualSettings.SSGI.gamma}
        />

        <Range
                label={LOCALIZATION_EN.EXPOSURE}
                minValue={.1}
                maxValue={10}
                onFinish={v => updateSubObject("SSGI","exposure",  v)}
                value={visualSettings.SSGI.exposure}
        />
    </div>
</Accordion>

<Accordion title={LOCALIZATION_EN.SSS}>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.STEPS}
                maxValue={100}
                minValue={1}
                integer={true}
                value={visualSettings.SSS.maxSteps}
                onFinish={v => updateSubObject("SSS","maxSteps",v)}
        />
        <Range
                label={LOCALIZATION_EN.MAX_DISTANCE}
                minValue={.00001}
                value={visualSettings.SSS.maxDistance}
                onFinish={v => updateSubObject("SSS","maxDistance",v)}
        />

        <Range
                label={LOCALIZATION_EN.DEPTH_THICKNESS}
                minValue={.00001}
                value={visualSettings.SSS.depthThickness}
                onFinish={v => updateSubObject("SSS","depthThickness",v)}
        />

        <Range
                label={LOCALIZATION_EN.FALLOFF}


                minValue={0}
                value={visualSettings.SSS.edgeFalloff}
                onFinish={v => updateSubObject("SSS","edgeFalloff",v)}
        />

        <Range
                label={LOCALIZATION_EN.DEPTH_DELTA}


                value={visualSettings.SSS.depthDelta}
                onFinish={v => updateSubObject("SSS","depthDelta",v)}
        />
    </div>
</Accordion>

<Accordion title={LOCALIZATION_EN.DIRECTIONAL_SHADOWS}>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.RESOLUTION}
                accentColor={"red"}
                onFinish={v => {
                    update("shadowMapResolution", v)
                }}
                incrementPercentage={1}
                precision={0}
                minValue={1}

                value={visualSettings.shadowMapResolution}
        />
        <div data-inline="-">
            <Range
                    label={LOCALIZATION_EN.LIGHTS}
                    accentColor={"red"}
                    onFinish={v => {
                    update("shadowAtlasQuantity", v)
                }}
                    incrementPercentage={1}
                    precision={0}
                    minValue={1}

                    value={visualSettings.shadowAtlasQuantity}
            />


        </div>
    </div>
</Accordion>

<Accordion title={LOCALIZATION_EN.AO}>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.SSAO.enabled}
                handleCheck={() => updateSubObject("SSAO", "enabled", !visualSettings.SSAO.enabled)}
                label={LOCALIZATION_EN.ENABLED}
        />

        <Range
                label={LOCALIZATION_EN.BLUR_SAMPLES}
                minValue={1}
                integer={true}
                value={visualSettings.SSAO.blurSamples}
                onFinish={v => updateSubObject("SSAO","blurSamples",v)}
        />
        <Range
                label={LOCALIZATION_EN.SAMPLES}
                minValue={1}
                maxValue={64}
                integer={true}
                value={visualSettings.SSAO.maxSamples}
                onFinish={v => updateSubObject("SSAO","maxSamples",v)}
        />

        <Range
                label={LOCALIZATION_EN.RADIUS}
                minValue={0}
                value={visualSettings.SSAO.radius}
                onFinish={v => updateSubObject("SSAO","radius",v)}
        />
        <Range
                label={LOCALIZATION_EN.POWER}
                minValue={0}
                value={visualSettings.SSAO.power}
                onFinish={v => updateSubObject("SSAO","power",v)}
        />

        <Range
                label={LOCALIZATION_EN.BIAS}
                value={visualSettings.SSAO.bias}
                onFinish={v => updateSubObject("SSAO","bias",v)}
        />
        <Range
                label={LOCALIZATION_EN.FALLOFF}
                value={visualSettings.SSAO.falloffDistance}
                onFinish={v => updateSubObject("SSAO","falloffDistance",v)}
        />

    </div>

</Accordion>

