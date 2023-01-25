<script>
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import VisualsStore from "../../../stores/VisualsStore";
    import AA_METHODS from "../../../../../../engine-core/static/AA_METHODS";
    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import ROUTES from "../../../../../../backend/static/ROUTES";
    import OptionDropdown from "../../../../../components/dropdown/OptionDropdown.svelte";
    import {onMount} from "svelte";
    import DEFAULT_GLOBAL_SETTINGS from "../../../../../../backend/static/DEFAULT_GLOBAL_SETTINGS";
    import {AngleBackends} from "../../../../../../backend/static/ANGLE_BACKENDS";
    import VISUAL_SETTINGS from "../../../static/VISUAL_SETTINGS";

    const {ipcRenderer} = window.require("electron")

    export let visualSettings

    let globalSettings = {...DEFAULT_GLOBAL_SETTINGS}

    onMount(() => {
        ipcRenderer.once(ROUTES.GET_GLOBAL_SETTINGS, (_, data) => globalSettings = data)
        ipcRenderer.send(ROUTES.GET_GLOBAL_SETTINGS)
    })

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
    <legend>{LOCALIZATION_EN.GLOBAL}</legend>
    <OptionDropdown
            noPadding={true}
            label={LOCALIZATION_EN.GRAPHICS_BACKEND}
            options={[
                    {icon:                  globalSettings.graphicsBackend === AngleBackends.OPEN_GL    ? "check":undefined,label: "OpenGL", onClick: () => globalSettings.graphicsBackend= AngleBackends.OPEN_GL},
                    {icon:                  globalSettings.graphicsBackend === AngleBackends.VULKAN     ? "check":undefined,label: "Vulkan (Default)", onClick: () => globalSettings.graphicsBackend= AngleBackends.VULKAN },
                    {icon:                  globalSettings.graphicsBackend === AngleBackends.D3D11      ? "check":undefined,label: "D3D11 (Slow shader compilation)", onClick: () => globalSettings.graphicsBackend= AngleBackends.D3D11  },
                    {disabled: true,icon:   globalSettings.graphicsBackend === AngleBackends.D3D9       ? "check":undefined,label: "D3D9", onClick: () => globalSettings.graphicsBackend= AngleBackends.D3D9   },
                    {disabled: true,icon:   globalSettings.graphicsBackend === AngleBackends.D3D12      ? "check":undefined,label: "D3D12", onClick: () => globalSettings.graphicsBackend= AngleBackends.D3D12  }
                ]}
    />

    <OptionDropdown
            noPadding={true}
            label={LOCALIZATION_EN.MAX_MEMORY}
            options={[
                    {icon: globalSettings.maxMemory === 1024 ? "check":undefined,label: "1024mb", onClick: () => globalSettings.maxMemory = 1024},
                    {icon: globalSettings.maxMemory === 2048 ? "check":undefined,label: "2048mb", onClick: () => globalSettings.maxMemory = 2048},
                    {icon: globalSettings.maxMemory === 4096 ? "check":undefined,label: "4096mb", onClick: () => globalSettings.maxMemory = 4096},
                    {icon: globalSettings.maxMemory === 8192 ? "check":undefined,label: "8192mb", onClick: () => globalSettings.maxMemory = 8192},
                    {icon: globalSettings.maxMemory === 16384 ? "check":undefined,label: "16384mb", onClick: () => globalSettings.maxMemory = 16384}
                ]}
    />
    <Checkbox
            checked={visualSettings.AAMethod === AA_METHODS.DISABLED}
            handleCheck={() => globalSettings.vsync =  !globalSettings.vsync}
            label={LOCALIZATION_EN.VSYNC}
    />
    <button data-sveltebuttondefault="-"  style="width: 100%"
            on:click={() => ipcRenderer.send(ROUTES.UPDATE_GLOBAL_SETTINGS, globalSettings)}>{LOCALIZATION_EN.APPLY}</button>
</fieldset>

<Accordion title={LOCALIZATION_EN.RESOLUTION}>
    <div data-svelteform="-">
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
</Accordion>

<Accordion title={LOCALIZATION_EN.ANTI_ALIASING}>
    <div data-svelteform="-">
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
    <div data-svelteform="-">
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
    <div data-svelteform="-">
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
    <fieldset>
        <legend>{LOCALIZATION_EN.GENERAL}</legend>
        <div data-svelteform="-">
            <button data-sveltebuttondefault="-"  on:click={() => VisualsStore.updateStore({...visualSettings, SSGI: {...VISUAL_SETTINGS.SSGI}})}>{LOCALIZATION_EN.DEFAULT}</button>
            <Checkbox
                    checked={visualSettings.SSGI.enabled}
                    handleCheck={() => updateSubObject("SSGI","enabled",!visualSettings.SSGI.enabled)}
                    label={LOCALIZATION_EN.ENABLED}
            />
            <Range

                    label={LOCALIZATION_EN.STRENGTH}

                    incrementPercentage={.01}
                    precision={3}
                    minValue={0}

                    value={visualSettings.SSGI.strength}
                    onFinish={v => updateSubObject("SSGI","strength",v)}
            />

        </div>
    </fieldset>
    <fieldset>
        <legend>{LOCALIZATION_EN.SMOOTHING}</legend>
        <div data-svelteform="-">
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
        </div>
    </fieldset>
    <fieldset>
        <legend>{LOCALIZATION_EN.RAY_MARCHING}</legend>
        <div data-svelteform="-">
            <Range

                    label={LOCALIZATION_EN.STEPS}
                    maxValue={100}
                    minValue={1}
                    integer={true}
                    value={visualSettings.SSGI.maxSteps}
                    onFinish={v => updateSubObject("SSGI","maxSteps",v)}
            />
            <Range
                    label={LOCALIZATION_EN.STEP_SIZE}


                    minValue={.1}
                    value={visualSettings.SSGI.stepSize}
                    onFinish={v => updateSubObject("SSGI","stepSize",v)}
            />
        </div>
    </fieldset>
</Accordion>

<Accordion title={LOCALIZATION_EN.SSS}>
    <div data-svelteform="-">
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
    <div data-svelteform="-">
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
        <div data-svelteinline="-">
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
    <div data-svelteform="-">
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

