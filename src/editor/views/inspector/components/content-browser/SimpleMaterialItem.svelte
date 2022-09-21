<script>
    import Localization from "../../../../../shared/libs/Localization";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import AssetAPI from "../../../../../shared/libs/files/AssetAPI";
    import GPU from "../../../../../../public/engine/production/GPU";
    import MaterialAPI from "../../../../../../public/engine/production/apis/rendering/MaterialAPI";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Range from "../../../../../shared/components/range/Range.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";

    const getUniformObject = (u) => {
        console.log(temp, u)
        const o = {}
        u.forEach(uu => o[uu.key] = uu.data)
        return o
    }

    export let item
    export let data
    let timeout
    let temp
    $: temp = {...data}
    const translate = key => Localization.PROJECT.INSPECTOR[key]
    $: uniform = getUniformObject(temp.uniformData)
    const updateAsset = async (key, value) => {
        temp = {
            ...temp, uniformData: temp.uniformData.map(u => {
                if (u.key === key)
                    return {...u, data: value}
                return u
            })
        }
        console.log(temp)
        if (GPU.materials.get(item.registryID) != null) {
            const instance = GPU.materials.get(item.registryID)
            await MaterialAPI.updateMaterialUniforms(temp.uniformData, instance)
            alert.pushAlert(translate("MATERIAL_UPDATED"), "success")
            GPU.cleanUpTextures()
        }

        clearTimeout(timeout)

        timeout = setTimeout(async () => {

            alert.pushAlert(translate("UPDATING_ASSET"), "alert")
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))

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
            label={translate("FALLBACK_VALUE")}
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
    <Range
            onFinish={v => {
                const newRGB = [...settings]
                newRGB[8] = v
                updateAsset("settings", newRGB)
            }}
            value={settings[8]}
            minValue={0}
            disabled={!settings[2]}
            label={translate("SCALE_ROUGHNESS")}
    />
    <div data-divider="-"></div>
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
</fieldset>

<fieldset>
    <legend>{translate("METALLIC")}</legend>
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
    <Range
            onFinish={v => {
                const newRGB = [...settings]
                newRGB[7] = v
                updateAsset("settings", newRGB)
            }}
            value={settings[7]}
            minValue={0}
            disabled={!settings[3]}
            label={translate("SCALE_METALLIC")}
    />
    <div data-divider="-"></div>
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
</fieldset>

<fieldset>
    <legend>{translate("AO")}</legend>
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
    <Range
            onFinish={v => {
                const newRGB = [...settings]
                newRGB[6] = v
                updateAsset("settings", newRGB)
            }}
            value={settings[6]}
            minValue={0}
            disabled={!settings[4]}
            label={translate("SCALE_AO")}
    />
</fieldset>

<fieldset>
    <legend>{translate("EMISSION")}</legend>
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
            label={translate("FALLBACK_VALUE")}
            value={[fallbackValues[3] * 255, fallbackValues[4] * 255, fallbackValues[5] * 255]}
    />

</fieldset>