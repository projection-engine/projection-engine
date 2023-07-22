<script>

    import Checkbox from "../../../shared/components/checkbox/Checkbox.svelte"
    import ColorPicker from "../../../shared/components/color-picker/ColorPicker.svelte"
    import Range from "../../../shared/components/range/Range.svelte"
    import VisualsStore from "../../../shared/stores/VisualsStore"
    import SettingsStore from "../../../shared/stores/SettingsStore"
    import Component from "../../../../engine/core/instances/components/Component"

    export let toRender
    export let settings
    export let visualSettings

    let fieldValue
    let timeout

    function getValue(s) {
    	if (!toRender)
    		return
    	let current = s
    	const key = toRender.key
    	if (Array.isArray(key)) {
    		for (let i = 0; i < key.length; i++)
    			current = current[key[i]]
    		return current
    	}
    	return current[key]
    }

    function setValue(value, save) {
    	if (!toRender)
    		return
    	const key = toRender.key
    	let s = toRender?.target === "settings" ? settings : visualSettings
    	if (save)
    		s = {...s}
    	if (Array.isArray(key)) {
    		let current = s
    		for (let i = 0; i < key.length - 1; i++)
    			current = current[key[i]]
    		current[[...key].pop()] = value

    	} else
    		s[key] = value
    	if (save) {
    		if (toRender?.target === "settings")
    			SettingsStore.updateStore(s)
    		else
    			VisualsStore.updateStore(s)
    	}
    }

    $: {
    	if (toRender?.target === "settings")
    		fieldValue = getValue(settings)
    	else
    		fieldValue = getValue(visualSettings)
    }

</script>


{#if toRender.type === Component.propTypes.NUMBER}
    <Range
            label={toRender.label}
            incrementPercentage={toRender.increment}
            minValue={toRender.min}
            maxValue={toRender.max}
            value={fieldValue}
            handleChange={v => {
                if(toRender.updateOnChange)
                     setValue(v, false)
                toRender.onChange?.(v)
            }}
            onFinish={v => {
                let value = toRender.onChange?.(v)
                if(value === undefined)
                    value = v
               setValue(value, true)
            }}
            disabled={toRender.disabled}
    />
{:else if toRender.type === Component.propTypes.BOOLEAN}
    <Checkbox
            disabled={toRender.disabled}
            checked={fieldValue}
            handleCheck={() => setValue(!fieldValue, true)}
            label={toRender.label}
    />

{:else if toRender.type === Component.propTypes.COLOR}
    <ColorPicker
            disabled={toRender.disabled}
            value={fieldValue?.map(v => v * 255) || [0,0,0]}
            label={toRender.label}
            timeout={0}
            submit={({r,g,b}) => {
                if(toRender.updateOnChange)
                    setValue([r/255,g/255,b/255], false)
                clearTimeout(timeout)
                timeout = setTimeout(() => setValue([r/255,g/255,b/255], true),150)
            }}
    />
{/if}