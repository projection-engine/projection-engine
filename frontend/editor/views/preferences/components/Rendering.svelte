<script>
    import Range from "frontend/shared/components/range/Range.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import VisualsStore from "../../../stores/VisualsStore";
    import AA_METHODS from "../../../../../engine-core/static/AA_METHODS";

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
    <legend>{Localization.EDITOR_COLOR_CORRECTION}</legend>
    <div data-form="-">
        <Range
                label={Localization.GAMMA}


                precision={3}
                minValue={.1}
                maxValue={10}
                onFinish={v => update("gamma",  v)}
                value={visualSettings.gamma}
        />

        <Range
                label={Localization.EXPOSURE}

                minValue={.1}

                precision={3}
                maxValue={10}
                onFinish={v => update("exposure",  v)}
                value={visualSettings.exposure}
        />
    </div>
</fieldset>


<fieldset>
    <legend>{Localization.ANTI_ALIASING}</legend>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.AAMethod === AA_METHODS.DISABLED}
                handleCheck={() => update("AAMethod", AA_METHODS.DISABLED)}
                label={Localization.DISABLED}
        />
        <Checkbox
                checked={visualSettings.AAMethod === AA_METHODS.FXAA}
                handleCheck={() => update("AAMethod", AA_METHODS.FXAA)}
                label={Localization.FXAA}
        />
        <Checkbox
                disabled={true}
                checked={visualSettings.AAMethod === AA_METHODS.TAA}
                handleCheck={() => update("AAMethod", AA_METHODS.TAA)}
                label={Localization.TAA}
        />
    </div>
</fieldset>
<fieldset>
    <legend>{Localization.MOTION_BLUR_SCALE}</legend>
    <div data-form="-">
        <Range
                label={Localization.SCALE}
                minValue={.0001}
                value={visualSettings.mbVelocityScale}
                onFinish={v => update("mbVelocityScale", v)}
        />
        <Range
                label={Localization.SAMPLES}
                minValue={1}
                integer="true"
                value={visualSettings.mbSamples}
                onFinish={v => update("mbSamples", v)}
        />
    </div>
</fieldset>
<fieldset>
    <legend>{Localization.PHYSICS}</legend>
    <div data-form="-">
        <Range
                label={Localization.PHYSICS_SIMULATION_STEP}
                minValue={.0001}
                value={visualSettings.physicsSimulationStep * 1000}
                onFinish={v => update("physicsSimulationStep", v/1000)}
        />
        <Range
                label={Localization.PHYSICS_SUB_STEPS}
                integer={true}
                minValue={1}
                value={visualSettings.physicsSubSteps}
                onFinish={v => update("physicsSubSteps", v)}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.SSR}</legend>

    <div data-form="-">

        <Range
                label={Localization.STEPS}
                minValue={1}
                integer={true}
                value={visualSettings.SSR.maxSteps}
                onFinish={v => updateSubObject("SSR","maxSteps",v)}
        />
        <Range
                label={Localization.STEP_SIZE}
                minValue={.1}
                value={visualSettings.SSR.stepSize}
                onFinish={v => updateSubObject("SSR","stepSize",v)}
        />

        <Range
                label={Localization.FALLOFF}


                minValue={0}
                value={visualSettings.SSR.falloff}
                onFinish={v => updateSubObject("SSR","falloff",v)}
        />

    </div>
</fieldset>


<fieldset>
    <legend>{Localization.SSGI}</legend>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.SSGI.enabled}
                handleCheck={() => updateSubObject("SSGI","enabled",!visualSettings.SSGI.enabled)}
                label={Localization.ENABLED}
        />
        <Range

                label={Localization.STEPS}
                maxValue={100}
                minValue={1}
                integer={true}
                value={visualSettings.SSGI.maxSteps}
                onFinish={v => updateSubObject("SSGI","maxSteps",v)}
        />
        <Range
                label={Localization.BLUR_SAMPLES}
                minValue={1}
                integer={true}
                value={visualSettings.SSGI.blurSamples}
                onFinish={v => updateSubObject("SSGI","blurSamples",v)}
        />


        <Range

                label={Localization.STRENGTH}

                incrementPercentage={.01}
                precision={3}
                minValue={0}

                value={visualSettings.SSGI.strength}
                onFinish={v => updateSubObject("SSGI","strength",v)}
        />

        <Range
                label={Localization.STEP_SIZE}


                minValue={.1}
                value={visualSettings.SSGI.stepSize}
                onFinish={v => updateSubObject("SSGI","stepSize",v)}
        />
    </div>
    <div data-form="-">
        <Range
                label={Localization.GAMMA}
                minValue={.1}
                maxValue={10}
                onFinish={v => updateSubObject("SSGI","gamma",  v)}
                value={visualSettings.SSGI.gamma}
        />

        <Range
                label={Localization.EXPOSURE}
                minValue={.1}
                maxValue={10}
                onFinish={v => updateSubObject("SSGI","exposure",  v)}
                value={visualSettings.SSGI.exposure}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.SSS}</legend>
    <div data-form="-">
        <Range
                label={Localization.STEPS}
                maxValue={100}
                minValue={1}
                integer={true}
                value={visualSettings.SSS.maxSteps}
                onFinish={v => updateSubObject("SSS","maxSteps",v)}
        />
        <Range
                label={Localization.MAX_DISTANCE}
                minValue={.00001}
                value={visualSettings.SSS.maxDistance}
                onFinish={v => updateSubObject("SSS","maxDistance",v)}
        />

        <Range
                label={Localization.DEPTH_THICKNESS}
                minValue={.00001}
                value={visualSettings.SSS.depthThickness}
                onFinish={v => updateSubObject("SSS","depthThickness",v)}
        />

        <Range
                label={Localization.FALLOFF}


                minValue={0}
                value={visualSettings.SSS.edgeFalloff}
                onFinish={v => updateSubObject("SSS","edgeFalloff",v)}
        />

        <Range
                label={Localization.DEPTH_DELTA}


                value={visualSettings.SSS.depthDelta}
                onFinish={v => updateSubObject("SSS","depthDelta",v)}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.DIRECTIONAL_SHADOWS}</legend>
    <div data-form="-">
        <Range
                label={Localization.RESOLUTION}
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
                    label={Localization.LIGHTS}
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
</fieldset>

<fieldset>
    <legend>{Localization.AO}</legend>
    <div data-form="-">
        <Checkbox
                checked={visualSettings.SSAO.enabled}
                handleCheck={() => updateSubObject("SSAO", "enabled", !visualSettings.SSAO.enabled)}
                label={Localization.ENABLED}
        />

        <Range
                label={Localization.BLUR_SAMPLES}
                minValue={1}
                integer={true}
                value={visualSettings.SSAO.blurSamples}
                onFinish={v => updateSubObject("SSAO","blurSamples",v)}
        />
        <Range
                label={Localization.SAMPLES}
                minValue={1}
                maxValue={64}
                integer={true}
                value={visualSettings.SSAO.maxSamples}
                onFinish={v => updateSubObject("SSAO","maxSamples",v)}
        />

        <Range
                label={Localization.RADIUS}
                minValue={0}
                value={visualSettings.SSAO.radius}
                onFinish={v => updateSubObject("SSAO","radius",v)}
        />
        <Range
                label={Localization.POWER}
                minValue={0}
                value={visualSettings.SSAO.power}
                onFinish={v => updateSubObject("SSAO","power",v)}
        />

        <Range
                label={Localization.BIAS}
                value={visualSettings.SSAO.bias}
                onFinish={v => updateSubObject("SSAO","bias",v)}
        />
        <Range
                label={Localization.FALLOFF}
                value={visualSettings.SSAO.falloffDistance}
                onFinish={v => updateSubObject("SSAO","falloffDistance",v)}
        />

    </div>

</fieldset>

