<script>
    import Localization from "../../../../../shared/libs/Localization";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import AssetAPI from "../../../../../shared/libs/files/AssetAPI";
    import GPU from "../../../../../../public/engine/production/GPU";
    import MaterialAPI from "../../../../../../public/engine/production/apis/rendering/MaterialAPI";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Range from "../../../../../shared/components/range/Range.svelte";
    import SIMPLE_MATERIAL_TEMPLATE from "../../../../../../public/engine/static/SIMPLE_MATERIAL_TEMPLATE";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";

    const getUniformObject = (u) => {
        const o = {}
        SIMPLE_MATERIAL_TEMPLATE.uniformData.forEach(uu => o[uu.key] = uu.data)
        return o
    }

    export let item
    export let data
    let timeout
    let temp
    $: temp = {...data}
    const translate = key => Localization.PROJECT.INSPECTOR[key]
    $: uniform = getUniformObject(temp.uniformData)
    const updateAsset = (key, value, t) => {
        console.log(value)
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            const update = temp.uniformData.map((u, i) => {
                if (u.key === key)
                    return {...u, data: value}
                return u
            })
            alert.pushAlert(translate("UPDATING_ASSET"), "alert")
            await AssetAPI.updateAsset(item.registryID, JSON.stringify({...temp, uniformData: update}))
            temp = {...temp, uniformData: update}
            if (GPU.materials.get(item.registryID) != null) {
                const instance = GPU.materials.get(item.registryID)
                await MaterialAPI.updateMaterialUniforms(temp.uniformData, instance)
                alert.pushAlert(translate("MATERIAL_UPDATED"), "success")
                GPU.cleanUpTextures()
            }
        }, 250)
    }

    $: settings = uniform.settings
    $: fallbackValues = uniform.fallbackValues
    $: rgbSamplerScales = uniform.rgbSamplerScales
</script>

<fieldset>
    <legend>{translate("ALBEDO")}</legend>
    <Checkbox
            label={translate("USE_SAMPLER")}
            checked={settings[0]}
            handleCheck={() => {
                const copy = [...settings]
                copy[0] = !settings[0] ? 0 : 1
                updateAsset("settings", copy)
            }}
    />
    <Selector
            disabled={!settings[0]}
            type="image"
            selected={uniform.albedo}
            handleChange={v => updateAsset("albedo", v.registryID)}
    />

    <ColorPicker
            submit={({r,g,b}) => {
                const newRGB = [...rgbSamplerScales]
                newRGB[0] = r/255
                newRGB[1]= g/255
                newRGB[2]= b/255
                updateAsset("rgbSamplerScales", newRGB)
            }}
            disabled={!settings[0]}
            label={translate("SCALE_ALBEDO")}
            value={[rgbSamplerScales[0] * 255, rgbSamplerScales[1] * 255, rgbSamplerScales[2] * 255]}
    />
    <div data-divider="-"></div>
    <ColorPicker
            submit={({r,g,b}) => {
                const newRGB = [...fallbackValues]
                newRGB[0] = r/255
                newRGB[1] = g/255
                newRGB[2] = b/255
                updateAsset("fallbackValues", newRGB)
            }}
            disabled={settings[0]}
            label={translate("FALLBACK_ALBEDO")}
            value={[fallbackValues[0] * 255, fallbackValues[1] * 255, fallbackValues[2] * 255]}
    />
</fieldset>

<fieldset>
    <legend>{translate("NORMAL")}</legend>
    <Checkbox
            label={translate("USE_SAMPLER")}
            checked={settings[1]}
            handleCheck={() => {
                const copy = [...settings]
                copy[1] = !settings[1] ? 0 : 1
                updateAsset("settings", copy)
            }}
    />
    <Selector
            disabled={!settings[1]}
            type="image"
            selected={uniform.normal}
            handleChange={v => updateAsset("normal", v.registryID)}
    />
    <ColorPicker
            submit={({r,g,b}) => {
                const newRGB = [...rgbSamplerScales]
                newRGB[3] = r/255
                newRGB[4]= g/255
                newRGB[5]= b/255
                updateAsset("rgbSamplerScales", newRGB)
            }}
            disabled={!settings[1]}
            label={translate("SCALE_NORMAL")}
            value={[rgbSamplerScales[3] * 255, rgbSamplerScales[4] * 255, rgbSamplerScales[5] * 255]}
    />
</fieldset>

<fieldset>
    <legend>{translate("ROUGHNESS")}</legend>
    <Checkbox
            label={translate("USE_SAMPLER")}
            checked={settings[2]}
            handleCheck={() => {
                const copy = [...settings]
                copy[2] = !settings[2] ? 0 : 1
                updateAsset("settings", copy)
            }}
    />
    <Selector
            disabled={!settings[2]}
            type="image"
            selected={uniform.roughness}
            handleChange={v => updateAsset("roughness", v.registryID)}
    />
    <Range minValue={0} disabled={!settings[2]} label={translate("SCALE_ROUGHNESS")}/>
    <div data-divider="-"></div>
    <Range maxValue={1} minValue={0} disabled={settings[2]} label={translate("FALLBACK_ROUGHNESS")}/>
</fieldset>

<fieldset>
    <legend>{translate("METALLIC")}</legend>
    <Checkbox
            label={translate("USE_SAMPLER")}
            checked={settings[3]}
            handleCheck={() => {
                const copy = [...settings]
                copy[3] = !settings[3] ? 0 : 1
                updateAsset("settings", copy)
            }}
    />
    <Selector
            disabled={!settings[3]}
            type="image"
            selected={uniform.metallic}
            handleChange={v => updateAsset("metallic", v.registryID)}
    />
    <Range minValue={0} disabled={!settings[3]} label={translate("SCALE_METALLIC")}/>
    <div data-divider="-"></div>
    <Range maxValue={1} minValue={0} disabled={settings[3]} label={translate("FALLBACK_METALLIC")}/>
</fieldset>

<fieldset>
    <legend>{translate("AO")}</legend>
    <Checkbox
            label={translate("USE_SAMPLER")}
            checked={settings[4]}
            handleCheck={() => {
                const copy = [...settings]
                copy[4] = !settings[4] ? 0 : 1
                updateAsset("settings", copy)
            }}
    />
    <Selector
            disabled={!settings[4]}
            type="image"
            selected={uniform.ao}
            handleChange={v => updateAsset("ao", v.registryID)}
    />
    <Range minValue={0} disabled={!settings[4]} label={translate("SCALE_AO")}/>
</fieldset>

<fieldset>
    <legend>{translate("EMISSION")}</legend>
    <Checkbox
            label={translate("USE_SAMPLER")}
            checked={settings[5]}
            handleCheck={() => {
                const copy = [...settings]
                copy[5] = !settings[5] ? 0 : 1
                updateAsset("settings", copy)
            }}
    />
    <Selector
            disabled={!settings[5]}
            type="image"
            selected={uniform.emission}
            handleChange={v => updateAsset("emission", v.registryID)}
    />
    <ColorPicker
            submit={({r,g,b}) => {
                const newRGB = [...rgbSamplerScales]
                newRGB[6] = r/255
                newRGB[7]= g/255
                newRGB[8]= b/255
                updateAsset("rgbSamplerScales", newRGB)
            }}
            disabled={!settings[5]}
            label={translate("SCALE_EMISSION")}
            value={[rgbSamplerScales[6] * 255, rgbSamplerScales[7] * 255, rgbSamplerScales[8] * 255]}
    />
    <div data-divider="-"></div>
    <ColorPicker
            submit={({r,g,b}) => {
                const newRGB = [...fallbackValues]
                newRGB[3] = r/255
                newRGB[4] = g/255
                newRGB[5] = b/255
                updateAsset("fallbackValues", newRGB)
            }}
            disabled={settings[5]}
            label={translate("FALLBACK_ALBEDO")}
            value={[fallbackValues[3] * 255, fallbackValues[4] * 255, fallbackValues[5] * 255]}
    />

</fieldset>