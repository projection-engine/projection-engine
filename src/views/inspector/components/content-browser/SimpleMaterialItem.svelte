<script>
    import Localization from "../../../../libs/libs/Localization";
    import Selector from "../../../../components/selector/Selector.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Checkbox from "../../../../components/checkbox/Checkbox.svelte";
    import SIMPLE_MATERIAL_TEMPLATE, {
        DEFAULT_MATRICES
    } from "../../../../../public/engine/production/materials/simple/SIMPLE_MATERIAL_UNIFORMS";
    import Accordion from "../../../../components/accordion/Accordion.svelte";
    import getUniformObject from "../../utils/get-uniform-object";
    import updateMaterialAsset from "../../utils/update-material-asset";


    export let item
    export let data
    let temp
    $: temp = {...data}
    const translate = key => Localization.PROJECT.INSPECTOR[key]

    const updateAsset = (key, value) => updateMaterialAsset(key, value, item.registryID, temp, v => temp = v, SIMPLE_MATERIAL_TEMPLATE)
    $: uniform = getUniformObject(temp.uniformData)

    $: settings = uniform.settings
    $: fallbackValues = uniform.fallbackValues
    $: rgbSamplerScales = uniform.rgbSamplerScales
    $: linearSamplerScales = uniform.linearSamplerScales ? uniform.linearSamplerScales : SIMPLE_MATERIAL_TEMPLATE.uniformData[2].data
    $: uvScales = uniform.uvScales || DEFAULT_MATRICES[DEFAULT_MATRICES.length - 1]

    function updateScales(index, value) {
        const newRGB = [...rgbSamplerScales]
        newRGB[index] = value


        updateAsset("rgbSamplerScales", newRGB)
    }

    function updateLinearScales(index, value) {
        const newRGB = [...linearSamplerScales]
        newRGB[index] = value

        updateAsset("linearSamplerScales", newRGB)
    }


    function updateUVScales(index, value) {
        const newRGB = [...uvScales]
        newRGB[index] = value
        updateAsset("uvScales", newRGB)
    }
</script>

<Accordion startOpen={true}>
    <svelte:fragment slot="header">{translate("ALBEDO")}</svelte:fragment>
    <fieldset>
        <legend>{translate("SAMPLER")}</legend>
        <div class="content-wrapper">
            <Checkbox
                    label={translate("USE_SAMPLER")}
                    checked={settings[0] !== 0}
                    handleCheck={() => {
                const copy = [...settings]
                copy[0] = copy[0] === 0 ? 1 : 0
                updateAsset("settings", copy)
            }}
            />
            <Selector
                    disabled={!settings[0]}
                    type="image"
                    selected={uniform.albedo}
                    handleChange={v => updateAsset("albedo", v.registryID)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("SAMPLER_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    minValue="0"
                    value={rgbSamplerScales[0]}
                    label="R"
                    onFinish={v => updateScales(0, v)}
            />
            <Range
                    minValue="0"
                    value={rgbSamplerScales[1]}
                    label="G"
                    onFinish={v => updateScales(1, v)}
            />
            <Range
                    minValue="0"
                    value={rgbSamplerScales[2]}
                    label="B"
                    onFinish={v => updateScales(2, v)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("UV_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    value={uvScales[0]}
                    label="U"
                    onFinish={v => updateUVScales(0, v)}
            />
            <Range
                    value={uvScales[1]}
                    label="V"
                    onFinish={v => updateUVScales(1, v)}
            />
        </div>
    </fieldset>

    <ColorPicker
            submit={({r,g,b}) => {
                const newRGB = [...fallbackValues]
                newRGB[0] = r/255
                newRGB[1] = g/255
                newRGB[2] = b/255
                updateAsset("fallbackValues", newRGB)
            }}
            disabled={settings[0]}
            label={translate("FALLBACK_VALUE")}
            value={[fallbackValues[0] * 255, fallbackValues[1] * 255, fallbackValues[2] * 255]}
    />

</Accordion>

<Accordion>
    <svelte:fragment slot="header">{translate("NORMAL")}</svelte:fragment>
    <fieldset>
        <legend>{translate("SAMPLER")}</legend>
        <div class="content-wrapper">
            <Checkbox
                    label={translate("USE_SAMPLER")}
                    checked={settings[1]}
                    handleCheck={() => {
                const copy = [...settings]
                copy[1] = copy[1] === 0 ? 1 : 0
                updateAsset("settings", copy)
            }}
            />
            <Selector
                    disabled={!settings[1]}
                    type="image"
                    selected={uniform.normal}
                    handleChange={v => updateAsset("normal", v.registryID)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("SAMPLER_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    minValue="0"
                    value={rgbSamplerScales[3]}
                    label="R"
                    onFinish={v => updateScales(3, v)}
            />
            <Range
                    minValue="0"
                    value={rgbSamplerScales[4]}
                    label="G"
                    onFinish={v => updateScales(4, v)}
            />
            <Range
                    minValue="0"
                    value={rgbSamplerScales[5]}
                    label="B"
                    onFinish={v => updateScales(5, v)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("UV_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    value={uvScales[2]}
                    label="U"
                    onFinish={v => updateUVScales(2, v)}
            />
            <Range
                    value={uvScales[3]}
                    label="V"
                    onFinish={v => updateUVScales(3, v)}
            />
        </div>
    </fieldset>
</Accordion>

<Accordion>
    <svelte:fragment slot="header">{translate("ROUGHNESS")}</svelte:fragment>
    <fieldset>
        <legend>{translate("SAMPLER")}</legend>
        <div class="content-wrapper">
            <Checkbox
                    label={translate("USE_SAMPLER")}
                    checked={settings[2]}
                    handleCheck={() => {
                const copy = [...settings]
                copy[2] = copy[2] === 0 ? 1 : 0
                updateAsset("settings", copy)
            }}
            />
            <Selector
                    disabled={!settings[2]}
                    type="image"
                    selected={uniform.roughness}
                    handleChange={v => updateAsset("roughness", v.registryID)}
            />
        </div>
    </fieldset>
    <fieldset>
        <div class="content-wrapper">
            <Range
                    minValue="0"
                    value={linearSamplerScales[6]}
                    label="R"
                    onFinish={v => updateLinearScales(6, v)}
            />
            <Range
                    minValue="0"
                    value={linearSamplerScales[7]}
                    label="G"
                    onFinish={v => updateLinearScales(7, v)}
            />
            <Range
                    minValue="0"
                    value={linearSamplerScales[8]}
                    label="B"
                    onFinish={v => updateLinearScales(8, v)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("UV_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    value={uvScales[4]}
                    label="U"
                    onFinish={v => updateUVScales(2, v)}
            />
            <Range
                    value={uvScales[5]}
                    label="V"
                    onFinish={v => updateUVScales(3, v)}
            />
        </div>
    </fieldset>


    <Range
            onFinish={v => {
                const newRGB = [...fallbackValues]
                newRGB[6] = v
                updateAsset("fallbackValues", newRGB)
            }}
            value={fallbackValues[6]}
            maxValue={1}
            minValue={0}
            disabled={settings[2]}
            label={translate("FALLBACK_VALUE")}
    />

</Accordion>

<Accordion title={translate("METALLIC")}>
    <fieldset>
        <legend>{translate("SAMPLER")}</legend>
        <div class="content-wrapper">
            <Checkbox
                    label={translate("USE_SAMPLER")}
                    checked={settings[3]}
                    handleCheck={() => {
                const copy = [...settings]
                copy[3] = copy[3] === 0 ? 1 : 0
                updateAsset("settings", copy)
            }}
            />
            <Selector
                    disabled={!settings[3]}
                    type="image"
                    selected={uniform.metallic}
                    handleChange={v => updateAsset("metallic", v.registryID)}
            />
        </div>
    </fieldset>
    <fieldset>
        <div class="content-wrapper">
            <Range
                    minValue="0"
                    value={linearSamplerScales[3]}
                    label="R"
                    onFinish={v => updateLinearScales(3, v)}
            />
            <Range
                    minValue="0"
                    value={linearSamplerScales[4]}
                    label="G"
                    onFinish={v => updateLinearScales(4, v)}
            />
            <Range
                    minValue="0"
                    value={linearSamplerScales[5]}
                    label="B"
                    onFinish={v => updateLinearScales(5, v)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("UV_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    value={uvScales[4]}
                    label="U"
                    onFinish={v => updateUVScales(4, v)}
            />
            <Range
                    value={uvScales[5]}
                    label="V"
                    onFinish={v => updateUVScales(5, v)}
            />
        </div>
    </fieldset>


    <Range
            onFinish={v => {
                const newRGB = [...fallbackValues]
                newRGB[7] = v
                updateAsset("fallbackValues", newRGB)
            }}
            value={fallbackValues[7]}
            maxValue={1}
            minValue={0}
            disabled={settings[3]}
            label={translate("FALLBACK_VALUE")}
    />

</Accordion>


<Accordion title={translate("AO")}>
    <fieldset>
        <legend>{translate("SAMPLER")}</legend>
        <div class="content-wrapper">
            <Checkbox
                    label={translate("USE_SAMPLER")}
                    checked={settings[4]}
                    handleCheck={() => {
                const copy = [...settings]
                copy[4] = copy[4] === 0 ? 1 : 0
                updateAsset("settings", copy)
            }}
            />
            <Selector
                    disabled={!settings[4]}
                    type="image"
                    selected={uniform.ao}
                    handleChange={v => updateAsset("ao", v.registryID)}
            />
        </div>
    </fieldset>
    <fieldset>
        <div class="content-wrapper">
            <Range
                    minValue="0"
                    value={linearSamplerScales[0]}
                    label="R"
                    onFinish={v => updateLinearScales(0, v)}
            />
            <Range
                    minValue="0"
                    value={linearSamplerScales[1]}
                    label="G"
                    onFinish={v => updateLinearScales(1, v)}
            />
            <Range
                    minValue="0"
                    value={linearSamplerScales[2]}
                    label="B"
                    onFinish={v => updateLinearScales(2, v)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("UV_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    value={uvScales[6]}
                    label="U"
                    onFinish={v => updateUVScales(6, v)}
            />
            <Range
                    value={uvScales[7]}
                    label="V"
                    onFinish={v => updateUVScales(7, v)}
            />
        </div>
    </fieldset>

</Accordion>


<Accordion title={translate("EMISSION")}>
    <fieldset>
        <legend>{translate("SAMPLER")}</legend>
        <div class="content-wrapper">
            <Checkbox
                    label={translate("USE_SAMPLER")}
                    checked={settings[5]}
                    handleCheck={() => {
                const copy = [...settings]
                copy[5] = copy[5] === 0 ? 1 : 0
                updateAsset("settings", copy)
            }}
            />
            <Selector
                    disabled={!settings[5]}
                    type="image"
                    selected={uniform.emission}
                    handleChange={v => updateAsset("emission", v.registryID)}
            />
        </div>
    </fieldset>

    <fieldset>
        <legend>{translate("SAMPLER_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    minValue="0"
                    value={rgbSamplerScales[6]}
                    label="R"
                    onFinish={v => updateScales(6, v)}
            />
            <Range
                    minValue="0"
                    value={rgbSamplerScales[7]}
                    label="G"
                    onFinish={v => updateScales(7, v)}
            />
            <Range
                    minValue="0"
                    value={rgbSamplerScales[8]}
                    label="B"
                    onFinish={v => updateScales(8, v)}
            />
        </div>
    </fieldset>


    <fieldset>
        <legend>{translate("UV_SCALE")}</legend>
        <div class="content-wrapper">
            <Range
                    value={uvScales[8]}
                    label="U"
                    onFinish={v => updateUVScales(8, v)}
            />
            <Range
                    value={uvScales[9]}
                    label="V"
                    onFinish={v => updateUVScales(9, v)}
            />
        </div>
    </fieldset>


    <ColorPicker
            submit={({r,g,b}) => {
                const newRGB = [...fallbackValues]
                newRGB[3] = r/255
                newRGB[4] = g/255
                newRGB[5] = b/255
                updateAsset("fallbackValues", newRGB)
            }}
            disabled={settings[5]}
            label={translate("FALLBACK_VALUE")}
            value={[fallbackValues[3] * 255, fallbackValues[4] * 255, fallbackValues[5] * 255]}
    />

</Accordion>

<style>
    fieldset {
        padding-bottom: 10px;
    }

    .content-wrapper {
        padding-top: 6px;
        padding-left: 35%;
        width: 100%;
        display: grid;
        gap: 3px;
    }
</style>