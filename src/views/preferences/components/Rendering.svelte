<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";

    export let settings
    export let update

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
        label={Localization.AA}
/>

<fieldset>
    <legend>{Localization.SSR}</legend>
    <div data-form="-">
        <Checkbox
                checked={settings.SSR.enabled}
                handleCheck={() => updateSubObject("SSR","enabled",!settings.SSR.enabled)}
                label={Localization.ENABLED}
        />

        <div data-inline="-">
            <Range
                    label={Localization.STEPS}
                    minValue={1}
                    integer={true}
                    value={settings.SSR.maxSteps}
                    onFinish={v => updateSubObject("SSR","maxSteps",v)}
            />
            <Range
                    label={Localization.STEP_SIZE}
                    incrementPercentage={.001}
                    precision={4}
                    value={settings.SSR.stepSize}
                    onFinish={v => updateSubObject("SSR","stepSize",v)}
            />

        </div>
        <div data-inline="-">
            <Range
                    label={Localization.DEPTH_THRESHOLD}
                    incrementPercentage={.001}
                    precision={4}
                    minValue={0}
                    value={settings.SSR.depthThreshold}
                    onFinish={v => updateSubObject("SSR","depthThreshold",v)}
            />

            <Range
                    label={Localization.BINARY_SEARCH}
                    integer={true}
                    minValue={1}

                    value={settings.SSR.binarySearchSteps}
                    onFinish={v => updateSubObject("SSR","binarySearchSteps",v)}
            />
        </div>
    </div>
</fieldset>


<fieldset>
    <legend>{Localization.SSGI}</legend>
    <div data-form="-">
        <Checkbox
                checked={settings.SSGI.enabled}
                handleCheck={() => updateSubObject("SSGI","enabled",!settings.SSGI.enabled)}
                label={Localization.ENABLED}
        />
        <div data-inline="-">
            <Range

                    label={Localization.STEPS}

                    minValue={1}
                    integer={true}
                    value={settings.SSGI.maxSteps}
                    onFinish={v => updateSubObject("SSGI","maxSteps",v)}
            />

            <Range

                    label={Localization.STRENGTH}

                    incrementPercentage={.01}
                    precision={3}
                    minValue={0}

                    value={settings.SSGI.strength}
                    onFinish={v => updateSubObject("SSGI","strength",v)}
            />
        </div>
        <div data-inline="-">
            <Range
                    label={Localization.STEP_SIZE}

                    incrementPercentage={.001}
                    precision={4}

                    value={settings.SSGI.stepSize}
                    onFinish={v => updateSubObject("SSGI","stepSize",v)}
            />

            <Range
                    label={Localization.DEPTH_THRESHOLD}
                    incrementPercentage={.001}
                    precision={4}
                    minValue={0}
                    value={settings.SSGI.depthThreshold}
                    onFinish={v => updateSubObject("SSGI","depthThreshold",v)}
            />

            <Range
                    label={Localization.BINARY_SEARCH}
                    integer={true}
                    minValue={1}
                    value={settings.SSGI.binarySearchSteps}
                    onFinish={v => updateSubObject("SSGI","binarySearchSteps",v)}
            />
        </div>
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.SHADOWS}</legend>
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

                value={settings.shadowMapResolution}
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

                    value={settings.shadowAtlasQuantity}
            />


        </div>
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.AO}</legend>
    <div data-form="-">
        <Checkbox
                checked={settings.SSAO.enabled}
                handleCheck={() => updateSubObject("SSAO", "enabled", !settings.SSAO.enabled)}
                label={Localization.ENABLED}
        />

        <div data-inline="-">
            <Range
                    label={Localization.RADIUS}
                    minValue={1}
                    value={settings.SSAO.radius}
                    onFinish={v => updateSubObject("SSAO","radius",v)}
            />
            <Range
                    label={Localization.POWER}
                    integer={true}
                    minValue={1}
                    value={settings.SSAO.power}
                    onFinish={v => updateSubObject("SSAO","power",v)}
            />
        </div>
    </div>
</fieldset>

